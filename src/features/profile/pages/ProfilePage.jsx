import { useState } from 'react';
import QRCode from 'react-qr-code';
import { QrCode, X } from 'lucide-react';
import { Card, PageHeader, Badge, LamplightPulse, Banner } from '../../../shared/components';
import { ROLE_LABELS } from '../../../shared/constants/roles';
import { formatDate, initials } from '../../../shared/utils/formatters';
import { useProfile } from '../hooks/useProfile';
import './ProfilePage.css';

export const ProfilePage = () => {
  const { profile, loading, error } = useProfile();
  const [showQr, setShowQr] = useState(false);

  if (loading) return <LamplightPulse label="Cargando tu perfil…" />;

  return (
    <div>
      <PageHeader eyebrow="Tu cuenta" title="Mi perfil" />
      <Banner tone="error">{error}</Banner>
      {profile && (
        <>
          {showQr && (
            <>
              <div className="profile-qr-backdrop" onClick={() => setShowQr(false)} />
              <div className="profile-qr-modal">
                <div className="profile-qr-modal__header">
                  <span className="profile-qr-modal__title">Mi código QR</span>
                  <button className="profile-qr-modal__close" onClick={() => setShowQr(false)}>
                    <X size={18} />
                  </button>
                </div>
                <p className="profile-qr-modal__hint">
                  Muestra este código al adulto mayor para que te vincule como cuidador sin necesidad de copiar tu ID.
                </p>
                <div className="profile-qr-modal__code">
                  <QRCode value={profile.id} size={200} />
                </div>
              </div>
            </>
          )}

          <Card className="profile-card">
            <div className="profile-card__avatar">{initials(profile.name, profile.surname)}</div>
            <div className="profile-card__info">
              <h2>
                {profile.name} {profile.surname}
              </h2>
              <Badge tone="soft">{ROLE_LABELS[profile.role]}</Badge>
              <dl className="profile-card__fields">
                <div>
                  <dt>Usuario</dt>
                  <dd>{profile.username}</dd>
                </div>
                <div>
                  <dt>Correo</dt>
                  <dd>{profile.email}</dd>
                </div>
                <div>
                  <dt>Teléfono</dt>
                  <dd>{profile.phone || '—'}</dd>
                </div>
                <div>
                  <dt>Miembro desde</dt>
                  <dd>{formatDate(profile.createdAt)}</dd>
                </div>
                <div>
                  <dt>Correo verificado</dt>
                  <dd>{profile.isEmailVerified ? 'Sí' : 'No'}</dd>
                </div>
                <div>
                  <dt>Tu ID (compártelo para vincular cuidado)</dt>
                  <dd className="profile-card__id-row">
                    <code className="profile-card__id">{profile.id}</code>
                    <button className="profile-card__qr-btn" onClick={() => setShowQr(true)}>
                      <QrCode size={14} /> Mostrar QR
                    </button>
                  </dd>
                </div>
              </dl>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
