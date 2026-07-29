import { useForm } from 'react-hook-form';
import { Input, Button, Banner } from '../../../shared/components';

export const BloodPressureForm = ({ onSubmit, loading, error }) => {
  const { register, handleSubmit, formState } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Banner tone="error">{error}</Banner>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input
          label="Sistólica"
          type="number"
          id="systolic"
          error={formState.errors.systolic?.message}
          {...register('systolic', { required: 'Requerido', valueAsNumber: true, min: 0, max: 300 })}
        />
        <Input
          label="Diastólica"
          type="number"
          id="diastolic"
          error={formState.errors.diastolic?.message}
          {...register('diastolic', { required: 'Requerido', valueAsNumber: true, min: 0, max: 200 })}
        />
      </div>
      <Input
        label="Pulso (opcional)"
        type="number"
        id="pulse"
        {...register('pulse', { valueAsNumber: true, min: 0, max: 300 })}
      />
      <Input label="Fecha y hora" type="datetime-local" id="measuredAt" {...register('measuredAt')} />
      <Input label="Notas (opcional)" as="textarea" id="notes" {...register('notes', { maxLength: 300 })} />
      <Button type="submit" loading={loading}>
        Guardar lectura
      </Button>
    </form>
  );
};
