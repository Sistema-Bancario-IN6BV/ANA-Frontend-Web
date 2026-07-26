import { useState } from 'react';
import {
  PageHeader,
  Button,
  Card,
  Modal,
  Badge,
  EmptyState,
  Banner,
  LamplightPulse,
} from '../../../shared/components';
import { useAuth } from '../../../shared/hooks/useAuth';
import { ELDERLY_ROLE } from '../../../shared/constants/roles';
import { RELATIONSHIP_LABEL } from '../../../shared/constants/clinical';
import { formatDate } from '../../../shared/utils/formatters';
import { useCaregivers } from '../hooks/useCaregivers';
import { CaregiverForm } from '../components/CaregiverForm';
import './CaregiversPage.css';

export const CaregiversPage = () => {
  const { role } = useAuth();
  const { links, loading, error, create, deactivate } = useCaregivers();
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({ loading: false, error: null });
  const canCreate = role === ELDERLY_ROLE;

  const handleCreate = async (values) => {
    setFormState({ loading: true, error: null });
    try {
      await create({ ...values, isPrimary: Boolean(values.isPrimary) });
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
        eyebrow="Red de cuidado"
        title={role === ELDERLY_ROLE ? 'Mis cuidadores' : 'Vínculos de cuidado'}
        description={
          role === ELDERLY_ROLE
            ? 'Las personas que reciben tus avisos y pueden ver tus signos vitales.'
            : 'Vínculos entre adultos mayores y sus cuidadores.'
        }
        actions={canCreate && <Button onClick={() => setOpen(true)}>Vincular cuidador</Button>}
      />

      <Banner tone="error">{error}</Banner>

      {loading && !links.length ? (
        <LamplightPulse label="Cargando vínculos…" />
      ) : !links.length ? (
        <EmptyState
          title="Sin vínculos todavía"
          description={
            canCreate
              ? 'Vincula a un familiar o cuidador para que reciba tus alertas.'
              : 'Todavía no hay vínculos registrados.'
          }
          action={canCreate && <Button onClick={() => setOpen(true)}>Vincular cuidador</Button>}
        />
      ) : (
        <div className="caregiver-grid">
          {links.map((link) => (
            <Card key={link._id} className="caregiver-card">
              <div className="caregiver-card__top">
                <Badge tone="soft">{RELATIONSHIP_LABEL[link.relationship] || link.relationship}</Badge>
                {link.isPrimary && <Badge colorVar="--risk-medio">Principal</Badge>}
              </div>
              <p className="caregiver-card__id">
                {role === ELDERLY_ROLE ? 'Cuidador' : 'Adulto mayor'}:{' '}
                {role === ELDERLY_ROLE ? (link.caregiverName || link.caregiver) : (link.elderlyName || link.elderly)}
              </p>
              {link.notes && <p className="caregiver-card__notes">{link.notes}</p>}
              <p className="caregiver-card__meta">Desde {formatDate(link.createdAt)}</p>
              <button type="button" className="caregiver-card__remove" onClick={() => deactivate(link._id)}>
                Quitar vínculo
              </button>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} title="Vincular cuidador" onClose={() => setOpen(false)}>
        <CaregiverForm onSubmit={handleCreate} loading={formState.loading} error={formState.error} />
      </Modal>
    </div>
  );
};
