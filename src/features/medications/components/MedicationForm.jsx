import { useState } from 'react';
import { View } from 'react-native';
import { TextField, Button, Banner } from '../../../shared/components';
import { spacing } from '../../../shared/constants/theme';

const TIME_LIST_PATTERN = /^([01]\d|2[0-3]):[0-5]\d(\s*,\s*([01]\d|2[0-3]):[0-5]\d)*$/;

export const MedicationForm = ({ defaultValues, onSubmit, loading, error }) => {
  const [name, setName] = useState(defaultValues?.name || '');
  const [dose, setDose] = useState(defaultValues?.dose || '');
  const [times, setTimes] = useState(defaultValues?.times?.join(', ') || '');
  const [notes, setNotes] = useState(defaultValues?.notes || '');
  const [timesError, setTimesError] = useState(null);

  const submit = () => {
    if (!TIME_LIST_PATTERN.test(times.trim())) {
      setTimesError('Formato inválido, usa HH:mm separado por comas (ej. 08:00, 20:00)');
      return;
    }
    setTimesError(null);
    onSubmit({
      name,
      dose,
      times: times.split(',').map((t) => t.trim()).filter(Boolean),
      notes: notes || undefined,
    });
  };

  return (
    <View style={{ gap: spacing.lg }}>
      <Banner tone="error">{error}</Banner>
      <TextField label="Medicamento" value={name} onChangeText={setName} />
      <TextField label="Dosis" placeholder="Ej. 500mg" value={dose} onChangeText={setDose} />
      <TextField
        label="Horarios"
        placeholder="Ej. 08:00, 14:00, 20:00"
        hint="Separados por coma, formato 24h."
        error={timesError}
        value={times}
        onChangeText={setTimes}
      />
      <TextField label="Notas (opcional)" value={notes} onChangeText={setNotes} multiline />
      <Button title="Guardar medicamento" loading={loading} disabled={!name || !dose || !times} onPress={submit} />
    </View>
  );
};
