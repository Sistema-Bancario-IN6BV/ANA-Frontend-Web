import { useState } from 'react';
import {
  PageHeader,
  Button,
  Card,
  Modal,
  EmptyState,
  Banner,
  LamplightPulse,
  Badge,
} from '../../../shared/components';
import { useAuth } from '../../../shared/hooks/useAuth';
import { ELDERLY_ROLE } from '../../../shared/constants/roles';
import { formatRelative } from '../../../shared/utils/formatters';
import { useMedications } from '../hooks/useMedications';
import { MedicationForm } from '../components/MedicationForm';
import './MedicationsListPage.css';

export const MedicationsListPage = () => {
  const { role } = useAuth();
  const { records, loading, error, create, update, deactivate, take } = useMedications();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formState, setFormState] = useState({ loading: false, error: null });
  const canManage = role === ELDERLY_ROLE;

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    setOpen(true);
  };

  const handleSubmit = async (values) => {
    setFormState({ loading: true, error: null });
    try {
      if (editing) {
        await update(editing._id, values);
      } else {
        await create(values);
      }
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
        title="Medicamentos"
        description={
          canManage
            ? 'Tus medicamentos y horarios para recibir recordatorios.'
            : 'Medicamentos y horarios registrados.'
        }
        actions={canManage && <Button onClick={openCreate}>Agregar medicamento</Button>}
      />

      <Banner tone="error">{error}</Banner>

      {loading && !records.length ? (
        <LamplightPulse label="Cargando medicamentos…" />
      ) : !records.length ? (
        <EmptyState
          title="Sin medicamentos registrados"
          description={
            canManage
              ? 'Agrega un medicamento y sus horarios para que ANA te lo recuerde.'
              : 'Todavía no hay medicamentos registrados.'
          }
          action={canManage && <Button onClick={openCreate}>Agregar medicamento</Button>}
        />
      ) : (
        <div className="medication-grid">
          {records.map((r) => (
            <Card key={r._id} className="medication-card">
              <div className="medication-card__top">
                <span className="medication-card__name">{r.name}</span>
                <span className="medication-card__dose">{r.dose}</span>
              </div>
              <div className="medication-card__times">
                {r.times.map((t) => (
                  <Badge key={t} tone="soft">{t}</Badge>
                ))}
              </div>
              {r.notes && <p className="medication-card__notes">{r.notes}</p>}
              <p className="medication-card__last-taken">
                {r.lastTakenAt ? `Última toma: ${formatRelative(r.lastTakenAt)}` : 'Sin registro de tomas'}
              </p>
              {canManage && (
                <>
                  <Button size="sm" onClick={() => take(r._id)} style={{ marginTop: 12 }}>
                    Marcar como tomado
                  </Button>
                  <div className="medication-card__actions">
                    <button type="button" onClick={() => openEdit(r)}>Editar</button>
                    <button type="button" className="medication-card__remove" onClick={() => deactivate(r._id)}>
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} title={editing ? 'Editar medicamento' : 'Agregar medicamento'} onClose={() => setOpen(false)}>
        <MedicationForm
          defaultValues={editing || undefined}
          onSubmit={handleSubmit}
          loading={formState.loading}
          error={formState.error}
        />
      </Modal>
    </div>
  );
};
