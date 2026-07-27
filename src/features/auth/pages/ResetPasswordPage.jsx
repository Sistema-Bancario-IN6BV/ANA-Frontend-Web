import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Input, Banner } from '../../../shared/components';
import { useVerification } from '../hooks/useVerification';
import './AuthForm.css';

export const ResetPasswordPage = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const { register, handleSubmit, formState } = useForm();
  const { resetPassword, loading, error } = useVerification();
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async ({ newPassword }) => {
    await resetPassword(token, newPassword);
    setDone(true);
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h2 className="auth-form__title">Crea una nueva contraseña</h2>
      </div>
      {!token && <Banner tone="error">Falta el enlace de restablecimiento.</Banner>}
      <Banner tone="error">{error}</Banner>
      {done && <Banner tone="success">Contraseña actualizada. Redirigiendo…</Banner>}
      <Input
        label="Nueva contraseña"
        id="newPassword"
        type="password"
        error={formState.errors.newPassword?.message}
        {...register('newPassword', { required: 'Requerido', minLength: 8 })}
      />
      <Button type="submit" size="lg" loading={loading} disabled={!token}>
        Guardar contraseña
      </Button>
      <p className="auth-form__footer">
        <Link to="/login">Volver a iniciar sesión</Link>
      </p>
    </form>
  );
};
