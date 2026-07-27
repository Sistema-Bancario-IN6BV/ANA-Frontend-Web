import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { Banner } from '../../../shared/components';
import { useLogin } from '../hooks/useLogin';

const HealthAssistLogo = () => (
  <div className="flex flex-col items-center mb-8">
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 shadow-lg"
      style={{ background: 'var(--color-primary-container)' }}>
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" aria-hidden="true">
        <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"
          fill="var(--color-on-primary-container)" opacity=".15"/>
        <path d="M12 8v8M8 12h8" stroke="var(--color-on-primary-container)"
          strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    </div>
    <span className="font-display text-[18px] font-bold"
      style={{ color: 'var(--color-primary)' }}>HealthAssist</span>
  </div>
);

export const LoginPage = () => {
  const { register, handleSubmit, formState } = useForm();
  const { login, loading, error } = useLogin();
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="w-full flex flex-col animate-[slide-up_0.4s_cubic-bezier(0.22,1,0.36,1)_both]">
      <HealthAssistLogo />

      <div className="mb-6 text-center">
        <h2 className="font-display text-[24px] font-semibold mb-1"
          style={{ color: 'var(--color-on-surface)' }}>
          Bienvenido de nuevo
        </h2>
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 15 }}>
          Ana está lista para ayudarte hoy.
        </p>
      </div>

      <Banner tone="error">{error}</Banner>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(login)}>
        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-semibold tracking-wide"
            style={{ color: 'var(--color-on-surface-variant)' }} htmlFor="emailOrUsername">
            Correo electrónico
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--color-outline)' }}>
              <Mail size={18} />
            </span>
            <input
              id="emailOrUsername"
              autoComplete="username"
              placeholder="ejemplo@correo.com"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-[15px] transition-all outline-none"
              style={{
                background: 'var(--color-surface-container-lowest)',
                border: '1.5px solid var(--color-outline-variant)',
                color: 'var(--color-on-surface)',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--color-primary-container)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-outline-variant)'}
              {...register('emailOrUsername', { required: 'Ingresa tu correo o usuario' })}
            />
          </div>
          {formState.errors.emailOrUsername && (
            <span className="text-[12px]" style={{ color: 'var(--color-ember)' }}>
              {formState.errors.emailOrUsername.message}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label className="text-[13px] font-semibold tracking-wide"
              style={{ color: 'var(--color-on-surface-variant)' }} htmlFor="password">
              Contraseña
            </label>
            <Link to="/forgot-password"
              className="text-[12px] font-bold hover:underline"
              style={{ color: 'var(--color-primary)' }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--color-outline)' }}>
              <Lock size={18} />
            </span>
            <input
              id="password"
              type={showPass ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full pl-11 pr-12 py-3.5 rounded-xl text-[15px] transition-all outline-none"
              style={{
                background: 'var(--color-surface-container-lowest)',
                border: '1.5px solid var(--color-outline-variant)',
                color: 'var(--color-on-surface)',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--color-primary-container)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-outline-variant)'}
              {...register('password', { required: 'Ingresa tu contraseña' })}
            />
            <button type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'var(--color-outline)' }}
              onClick={() => setShowPass(v => !v)}>
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {formState.errors.password && (
            <span className="text-[12px]" style={{ color: 'var(--color-ember)' }}>
              {formState.errors.password.message}
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-[15px] mt-1 transition-all active:scale-[0.98] disabled:opacity-60"
          style={{
            background: 'var(--color-primary-container)',
            color: 'var(--color-on-primary-container)',
          }}
        >
          {loading ? 'Iniciando…' : (
            <>Iniciar Sesión <LogIn size={18} /></>
          )}
        </button>
      </form>

      {/* Sign up */}
      <p className="text-center text-[14px] mt-6" style={{ color: 'var(--color-on-surface-variant)' }}>
        ¿No tienes una cuenta?{' '}
        <Link to="/register" className="font-bold hover:underline"
          style={{ color: 'var(--color-primary)' }}>
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
};
