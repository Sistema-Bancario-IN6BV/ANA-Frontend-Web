import { useMemo, useState } from 'react';
import { PageHeader, Card, Badge, EmptyState, Banner, LamplightPulse, TrendChart, Input } from '../../../shared/components';
import { EMOTION_LABEL_ES, RISK_COLOR_VAR, RISK_LABEL } from '../../../shared/constants/clinical';
import { formatDate, formatRelative } from '../../../shared/utils/formatters';
import { useCaregivers } from '../../caregivers/hooks/useCaregivers';
import { useElderlyInsights } from '../hooks/useElderlyInsights';
import '../components/InsightsPanel.css';

const RISK_SCORE = { bajo: 1, medio: 2, alto: 3, critico: 4 };

export const ElderlyInsightsPage = () => {
  const { links, loading: linksLoading } = useCaregivers();
  const elderlyOptions = useMemo(() => {
    const byId = new Map();
    links.forEach((l) => byId.set(l.elderly, l.elderlyName || l.elderly));
    return [...byId.entries()].map(([id, name]) => ({ id, name }));
  }, [links]);
  const [selectedId, setSelectedId] = useState('');
  const activeId = selectedId || elderlyOptions[0]?.id || '';

  const { history, summary, loading, error } = useElderlyInsights(activeId);

  const chartData = useMemo(
    () =>
      [...history]
        .filter((h) => h.analysis?.risk_level)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .slice(-14)
        .map((h) => ({ label: formatDate(h.createdAt), risk: RISK_SCORE[h.analysis.risk_level] || 1 })),
    [history]
  );

  return (
    <div>
      <PageHeader
        eyebrow="Bienestar emocional"
        title="Tendencia de ANA"
        description="Historial y nivel de riesgo detectado por ANA para tus adultos mayores vinculados."
      />

      <Banner tone="error">{error}</Banner>

      {linksLoading && !elderlyOptions.length ? (
        <LamplightPulse label="Cargando vínculos…" />
      ) : !elderlyOptions.length ? (
        <EmptyState
          title="Sin adultos mayores vinculados"
          description="Cuando tengas un vínculo activo con un adulto mayor, aquí verás su tendencia emocional."
        />
      ) : (
        <>
          <Card style={{ marginBottom: 24 }}>
            <Input label="Adulto mayor" as="select" value={activeId} onChange={(e) => setSelectedId(e.target.value)}>
              {elderlyOptions.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </Input>
          </Card>

          <Card style={{ marginBottom: 24 }}>
            <h3 className="insights-panel__title">Resumen semanal</h3>
            {loading && !summary ? (
              <LamplightPulse size="sm" label="" />
            ) : (
              <p className="insights-panel__summary">
                {summary?.summary || summary?.message || 'Todavía no hay suficientes datos.'}
              </p>
            )}
          </Card>

          {chartData.length > 1 && (
            <Card style={{ marginBottom: 24 }}>
              <h3 className="insights-panel__title">Tendencia de riesgo (1 = bajo, 4 = crítico)</h3>
              <TrendChart data={chartData} lines={[{ key: 'risk', label: 'Riesgo', color: 'var(--color-lamplight)' }]} />
            </Card>
          )}

          <Card>
            <h3 className="insights-panel__title">Conversaciones recientes</h3>
            {!history.length && <p className="insights-panel__empty">Aún no hay conversaciones.</p>}
            <ul className="insights-panel__list">
              {history.map((item) => (
                <li key={item._id}>
                  <div className="insights-panel__row">
                    <Badge tone="soft">{EMOTION_LABEL_ES[item.analysis?.emotional_state] || 'Neutral'}</Badge>
                    {item.analysis?.risk_level && (
                      <Badge colorVar={RISK_COLOR_VAR[item.analysis.risk_level]}>{RISK_LABEL[item.analysis.risk_level]}</Badge>
                    )}
                  </div>
                  <p className="insights-panel__text">{item.text}</p>
                  <span className="insights-panel__time">{formatRelative(item.createdAt)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </div>
  );
};
