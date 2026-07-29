import { useForm } from 'react-hook-form';
import { Input, Button, Banner } from '../../../shared/components';
import { MEASURE_TYPE_LABEL } from '../../../shared/constants/clinical';

export const GlucoseForm = ({ onSubmit, loading, error }) => {
  const { register, handleSubmit, formState } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Banner tone="error">{error}</Banner>
      <Input
        label="Nivel de glucosa (mg/dL)"
        type="number"
        id="glucoseLevel"
        error={formState.errors.glucoseLevel?.message}
        {...register('glucoseLevel', { required: 'Requerido', valueAsNumber: true, min: 0, max: 1000 })}
      />
      <Input label="Tipo de medición" as="select" id="measureType" {...register('measureType', { required: true })}>
        {Object.entries(MEASURE_TYPE_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Input>
      <Input label="Fecha y hora" type="datetime-local" id="measuredAt" {...register('measuredAt')} />
      <Input label="Notas (opcional)" as="textarea" id="notes" {...register('notes', { maxLength: 300 })} />
      <Button type="submit" loading={loading}>
        Guardar lectura
      </Button>
    </form>
  );
};
