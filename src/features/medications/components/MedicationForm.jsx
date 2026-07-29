import { useForm } from 'react-hook-form';
import { Input, Button, Banner } from '../../../shared/components';

const TIME_LIST_PATTERN = /^([01]\d|2[0-3]):[0-5]\d(\s*,\s*([01]\d|2[0-3]):[0-5]\d)*$/;

export const MedicationForm = ({ defaultValues, onSubmit, loading, error }) => {
  const { register, handleSubmit, formState } = useForm({
    defaultValues: defaultValues
      ? { ...defaultValues, times: defaultValues.times?.join(', ') }
      : undefined,
  });

  const submit = (values) =>
    onSubmit({
      ...values,
      times: values.times
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });

  return (
    <form onSubmit={handleSubmit(submit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Banner tone="error">{error}</Banner>
      <Input
        label="Medicamento"
        id="name"
        error={formState.errors.name?.message}
        {...register('name', { required: 'Requerido', maxLength: 150 })}
      />
      <Input
        label="Dosis"
        id="dose"
        placeholder="Ej. 500mg"
        error={formState.errors.dose?.message}
        {...register('dose', { required: 'Requerido', maxLength: 50 })}
      />
      <Input
        label="Horarios"
        id="times"
        placeholder="Ej. 08:00, 14:00, 20:00"
        hint="Separados por coma, formato 24h."
        error={formState.errors.times?.message}
        {...register('times', {
          required: 'Requerido',
          pattern: { value: TIME_LIST_PATTERN, message: 'Formato inválido, usa HH:mm separado por comas' },
        })}
      />
      <Input label="Notas (opcional)" as="textarea" id="notes" {...register('notes', { maxLength: 300 })} />
      <Button type="submit" loading={loading}>
        Guardar medicamento
      </Button>
    </form>
  );
};
