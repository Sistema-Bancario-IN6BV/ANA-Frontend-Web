import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Mail } from 'lucide-react';
import { Button, Input, Banner, Card } from '../../../shared/components';
import { ELDERLY_ROLE, CAREGIVER_ROLE } from '../../../shared/constants/roles';
import { useRegister } from '../hooks/useRegister';

export const RegisterPage = () => {
  const { register, handleSubmit, formState, watch, setValue } = useForm({
    defaultValues: { role: ELDERLY_ROLE },
  });
  const { register: doRegister, loading, error, done } = useRegister();
  const role = watch('role');

  return (
    <div className="relative w-full">
      {done && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => {}} />
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[340px] animate-[slide-up_0.35s_cubic-bezier(0.22,1,0.36,1)_both]">
            <Card className="shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <Mail size={22} style={{ color: 'var(--color-primary)' }} />
                <h2 className="font-display text-[18px]" style={{ color: 'var(--color-on-surface)' }}>Revisa tu correo</h2>
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                Te enviamos un enlace para verificar tu cuenta. Ábrelo desde tu correo para activar tu acceso.
              </p>
              <Link to="/login">
                <Button variant="dusk" className="w-full">Volver a iniciar sesión</Button>
              </Link>
            </Card>
          </div>
        </>
      )}
    <form
      className="w-full flex flex-col gap-4 animate-[slide-up_0.4s_cubic-bezier(0.22,1,0.36,1)_both]"
      onSubmit={handleSubmit(doRegister)}
    >
      <div className="mb-1">
        <h2 className="font-display text-[26px] font-semibold text-ink mb-1">Crea tu cuenta</h2>
        <p className="text-ink-soft">Pocos datos, para empezar a acompañar hoy.</p>
      </div>

      <Banner tone="error">{error}</Banner>

      {/* Role selector */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { val: ELDERLY_ROLE,   label: 'Soy adulto mayor' },
          { val: CAREGIVER_ROLE, label: 'Soy cuidador/a' },
        ].map(({ val, label }) => (
          <button
            key={val}
            type="button"
            onClick={() => setValue('role', val)}
            className={clsx(
              'px-3 py-3 rounded-xl border-[1.5px] font-bold text-sm cursor-pointer transition-all duration-150',
              role === val
                ? 'border-lamplight bg-lamplight-dim text-dusk-700'
                : 'border-border bg-white text-ink-soft hover:border-lamplight/60',
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <input type="hidden" {...register('role', { required: true })} />

      <div className="grid grid-cols-2 gap-3 max-[460px]:grid-cols-1">
        <Input label="Nombre" id="name" error={formState.errors.name?.message}
          {...register('name', { required: 'Requerido', maxLength: 25 })} />
        <Input label="Apellido" id="surname" error={formState.errors.surname?.message}
          {...register('surname', { required: 'Requerido', maxLength: 25 })} />
      </div>

      <Input label="Usuario" id="username" error={formState.errors.username?.message}
        {...register('username', { required: 'Requerido' })} />
      <Input label="Correo electrónico" id="email" type="email" error={formState.errors.email?.message}
        {...register('email', { required: 'Requerido' })} />

      <div className="grid grid-cols-2 gap-3 max-[460px]:grid-cols-1">
        <Input label="Teléfono (8 dígitos)" id="phone" maxLength={8} error={formState.errors.phone?.message}
          {...register('phone', { required: 'Requerido', minLength: 8, maxLength: 8 })} />
        <Input label="Contraseña" id="password" type="password" error={formState.errors.password?.message}
          {...register('password', { required: 'Mínimo 8 caracteres', minLength: 8 })} />
      </div>

      <Button type="submit" size="lg" loading={loading} className="w-full">
        Crear cuenta
      </Button>

      <p className="text-center text-sm text-ink-soft">
        ¿Ya tienes cuenta? <Link to="/login" className="text-lamplight-700 hover:underline">Inicia sesión</Link>
      </p>
    </form>
    </div>
  );
};
