import { useMemo, useState } from 'react';
import {
  PageHeader,
  Button,
  Card,
  Modal,
  EmptyState,
  Banner,
  LamplightPulse,
  TrendChart,
  Badge,
} from '../../../shared/components';
import { formatDateTime } from '../../../shared/utils/formatters';
import { MEASURE_TYPE_LABEL } from '../../../shared/constants/clinical';
import { useGlucose } from '../hooks/useGlucose';
import { GlucoseForm } from '../components/GlucoseForm';
import { glucoseTone } from '../components/glucoseLevels';
import './GlucoseListPage.css';

export const GlucoseListPage = () => {
  const { records, loading, error, create, deactivate } = useGlucose();
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({ loading: false, error: null });

  const chartData = useMemo(
    () =>
      [...records]
        .sort((a, b) => new Date(a.measuredAt) - new Date(b.measuredAt))
        .slice(-14)
        .map((r) => ({ label: formatDateTime(r.measuredAt).split(',')[0], glucoseLevel: r.glucoseLevel })),
    [records]
  );

  const handleCreate = async (values) => {
    setFormState({ loading: true, error: null });
    try {
      await create({
        ...values,
        measuredAt: values.measuredAt ? new Date(values.measuredAt).toISOString() : undefined,
      });
      setOpen(false);
    } catch (err) {
      setFormState({ loading: false, error: err.message });
      return;
    }
    setFormState({ loading: false, error: null });
  };

  return (
    <div>
      <PageHeader
        eyebrow="Signos vitales"
        title="Glucosa"
        description="Tendencia de los últimos registros de glucosa en sangre."
        actions={<Button onClick={() => setOpen(true)}>Registrar lectura</Button>}
      />

      <Banner tone="error">{error}</Banner>

      {chartData.length > 1 && (
        <Card style={{ marginBottom: 24 }}>
          <TrendChart data={chartData} lines={[{ key: 'glucoseLevel', label: 'mg/dL', color: 'var(--color-lamplight)' }]} />
        </Card>
      )}

      {loading && !records.length ? (
        <LamplightPulse label="Cargando registros…" />
      ) : !records.length ? (
        <EmptyState
          title="Todavía no hay lecturas"
          description="Registra tu primera medición de glucosa para empezar a ver tu tendencia."
          action={<Button onClick={() => setOpen(true)}>Registrar lectura</Button>}
        />
      ) : (
        <div className="glucose-grid">
          {records.map((r) => {
            const tone = glucoseTone(r.glucoseLevel);
            return (
              <Card key={r._id} className="glucose-card">
                <div className="glucose-card__value-row">
                  <span className="glucose-card__value">{r.glucoseLevel}</span>
                  <span className="glucose-card__unit">mg/dL</span>
                  <Badge colorVar={tone.colorVar} tone="soft">
                    {tone.label}
                  </Badge>
                </div>
                <p className="glucose-card__meta">{MEASURE_TYPE_LABEL[r.measureType]} · {formatDateTime(r.measuredAt)}</p>
                {r.notes && <p className="glucose-card__notes">{r.notes}</p>}
                <button type="button" className="glucose-card__remove" onClick={() => deactivate(r._id)}>
                  Eliminar
                </button>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={open} title="Registrar lectura de glucosa" onClose={() => setOpen(false)}>
        <GlucoseForm onSubmit={handleCreate} loading={formState.loading} error={formState.error} />
      </Modal>
    </div>
  );
};
