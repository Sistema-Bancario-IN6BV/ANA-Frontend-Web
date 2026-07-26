import { Card, Badge, LamplightPulse } from '../../../shared/components';
import { EMOTION_LABEL_ES, RISK_COLOR_VAR, RISK_LABEL } from '../../../shared/constants/clinical';
import { formatRelative } from '../../../shared/utils/formatters';
import { useAnaInsights } from '../hooks/useAnaInsights';
import './InsightsPanel.css';

export const InsightsPanel = () => {
  const { history, summary, loading } = useAnaInsights();

  return (
    <div className="insights-panel">
      <Card>
        <h3 className="insights-panel__title">Resumen semanal</h3>
        {loading && !summary ? (
          <LamplightPulse size="sm" label="" />
        ) : summary ? (
          <p className="insights-panel__summary">{summary.summary || summary.message || 'Todavía no hay suficientes datos.'}</p>
        ) : (
          <p className="insights-panel__summary">Conversa con ANA esta semana para ver tu resumen aquí.</p>
        )}
      </Card>

      <Card>
        <h3 className="insights-panel__title">Conversaciones recientes</h3>
        {!history.length && <p className="insights-panel__empty">Aún no hay conversaciones.</p>}
        <ul className="insights-panel__list">
          {history.map((item) => (
            <li key={item._id}>
              <div className="insights-panel__row">
                <Badge tone="soft">{EMOTION_LABEL_ES[item.analysis?.emotional_state] || 'Neutral'}</Badge>
                {item.analysis?.risk_level && (
                  <Badge colorVar={RISK_COLOR_VAR[item.analysis.risk_level]}>
                    {RISK_LABEL[item.analysis.risk_level]}
                  </Badge>
                )}
              </div>
              <p className="insights-panel__text">{item.text}</p>
              <span className="insights-panel__time">{formatRelative(item.createdAt)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};
