import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, LamplightPulse, Banner } from '../../../shared/components';
import { useVerification } from '../hooks/useVerification';
import './AuthForm.css';

export const VerifyEmailPage = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const { verifyEmail, loading, error } = useVerification();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;
    verifyEmail(token)
      .then(() => setSuccess(true))
      .catch(() => {});
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card className="auth-form">
      {!token && <Banner tone="error">Falta el enlace de verificación. Revisa tu correo.</Banner>}
      {loading && <LamplightPulse label="Verificando tu correo…" />}
      {!loading && success && (
        <>
          <h2 className="auth-form__title">Cuenta verificada</h2>
          <p className="auth-form__subtitle">Ya puedes iniciar sesión y empezar a usar ANA.</p>
        </>
      )}
      {!loading && error && <Banner tone="error">{error}</Banner>}
      <Link to="/login">Ir a iniciar sesión</Link>
    </Card>
  );
};
