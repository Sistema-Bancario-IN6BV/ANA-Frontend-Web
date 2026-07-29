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
import { useBloodPressure } from '../hooks/useBloodPressure';
import { BloodPressureForm } from '../components/BloodPressureForm';
import { bpTone } from '../components/bpLevels';
import './BloodPressureListPage.css';

export const BloodPressureListPage = () => {
  const { records, loading, error, create, deactivate } = useBloodPressure();
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({ loading: false, error: null });

  const chartData = useMemo(
    () =>
      [...records]
        .sort((a, b) => new Date(a.measuredAt) - new Date(b.measuredAt))
        .slice(-14)
        .map((r) => ({
          label: formatDateTime(r.measuredAt).split(',')[0],
          systolic: r.systolic,
          diastolic: r.diastolic,
        })),
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
        title="Presión arterial"
        description="Tendencia de sistólica y diastólica en los últimos registros."
        actions={<Button onClick={() => setOpen(true)}>Registrar lectura</Button>}
      />

      <Banner tone="error">{error}</Banner>

      {chartData.length > 1 && (
        <Card style={{ marginBottom: 24 }}>
          <TrendChart
            data={chartData}
            lines={[
              { key: 'systolic', label: 'Sistólica', color: 'var(--color-lamplight)' },
              { key: 'diastolic', label: 'Diastólica', color: 'var(--color-dusk)' },
            ]}
          />
        </Card>
      )}

      {loading && !records.length ? (
        <LamplightPulse label="Cargando registros…" />
      ) : !records.length ? (
        <EmptyState
          title="Todavía no hay lecturas"
          description="Registra tu primera medición de presión arterial."
          action={<Button onClick={() => setOpen(true)}>Registrar lectura</Button>}
        />
      ) : (
        <div className="bp-grid">
          {records.map((r) => {
            const tone = bpTone(r.systolic, r.diastolic);
            return (
              <Card key={r._id} className="bp-card">
                <div className="bp-card__value-row">
                  <span className="bp-card__value">
                    {r.systolic}/{r.diastolic}
                  </span>
                  <span className="bp-card__unit">mmHg</span>
                  <Badge colorVar={tone.colorVar} tone="soft">
                    {tone.label}
                  </Badge>
                </div>
                <p className="bp-card__meta">
                  {r.pulse ? `${r.pulse} lpm · ` : ''}
                  {formatDateTime(r.measuredAt)}
                </p>
                {r.notes && <p className="bp-card__notes">{r.notes}</p>}
                <button type="button" className="bp-card__remove" onClick={() => deactivate(r._id)}>
                  Eliminar
                </button>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={open} title="Registrar presión arterial" onClose={() => setOpen(false)}>
        <BloodPressureForm onSubmit={handleCreate} loading={formState.loading} error={formState.error} />
      </Modal>
    </div>
  );
};
