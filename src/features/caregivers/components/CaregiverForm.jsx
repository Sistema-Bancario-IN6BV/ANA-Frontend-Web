import { useForm } from 'react-hook-form';
import { Input, Button, Banner } from '../../../shared/components';
import { RELATIONSHIP_LABEL } from '../../../shared/constants/clinical';

export const CaregiverForm = ({ onSubmit, loading, error }) => {
  const { register, handleSubmit, formState } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Banner tone="error">{error}</Banner>
      <Input
        label="ID del cuidador"
        id="caregiver"
        hint="Pídele a tu cuidador que te muestre su QR o comparta su ID desde su perfil."
        error={formState.errors.caregiver?.message}
        {...register('caregiver', { required: 'Requerido' })}
      />
      <Input label="Relación" as="select" id="relationship" {...register('relationship', { required: true })}>
        {Object.entries(RELATIONSHIP_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Input>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14 }}>
        <input type="checkbox" {...register('isPrimary')} /> Cuidador principal
      </label>
      <Input label="Notas (opcional)" as="textarea" id="notes" {...register('notes', { maxLength: 300 })} />
      <Button type="submit" loading={loading}>
        Vincular cuidador
      </Button>
    </form>
  );
};
