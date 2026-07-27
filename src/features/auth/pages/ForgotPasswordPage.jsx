import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button, Input, Banner } from '../../../shared/components';
import { useVerification } from '../hooks/useVerification';
import './AuthForm.css';

export const ForgotPasswordPage = () => {
  const { register, handleSubmit } = useForm();
  const { forgotPassword, loading, error } = useVerification();
  const [sent, setSent] = useState(false);

  const onSubmit = async ({ email }) => {
    await forgotPassword(email).catch(() => {});
    setSent(true);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h2 className="auth-form__title">Recupera tu contraseña</h2>
        <p className="auth-form__subtitle">Te enviaremos un enlace para crear una nueva.</p>
      </div>
      <Banner tone="error">{error}</Banner>
      {sent ? (
        <Banner tone="success">Si el correo existe, te llegará un enlace en unos minutos.</Banner>
      ) : (
        <>
          <Input label="Correo electrónico" id="email" type="email" {...register('email', { required: true })} />
          <Button type="submit" size="lg" loading={loading}>
            Enviar enlace
          </Button>
        </>
      )}
      <p className="auth-form__footer">
        <Link to="/login">Volver a iniciar sesión</Link>
      </p>
    </form>
  );
};
