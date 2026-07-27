import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen, ScreenHeader, Card, Badge, Button, Banner, EmptyState, LamplightPulse, AppModal } from '../../../shared/components';
import { colors, fonts, spacing } from '../../../shared/constants/theme';
import { ELDERLY_ROLE } from '../../../shared/constants/roles';
import { useAuth } from '../../../shared/hooks/useAuth';
import { formatRelative } from '../../../shared/utils/formatters';
import { useMedications } from '../hooks/useMedications';
import { MedicationForm } from '../components/MedicationForm';

export const MedicationsScreen = () => {
  const { role } = useAuth();
  const { records, loading, error, create, update, deactivate, take } = useMedications();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formState, setFormState] = useState({ loading: false, error: null });
  const canManage = role === ELDERLY_ROLE;

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    setOpen(true);
  };

  const handleSubmit = async (values) => {
    setFormState({ loading: true, error: null });
    try {
      if (editing) {
        await update(editing._id, values);
      } else {
        await create(values);
      }
      setOpen(false);
      setFormState({ loading: false, error: null });
    } catch (err) {
      setFormState({ loading: false, error: err.message });
    }
  };

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Signos vitales"
        title="Medicamentos"
        description={
          canManage
            ? 'Tus medicamentos y horarios. ANA te avisará cuando sea hora de tomarlos.'
            : 'Medicamentos y horarios registrados.'
        }
        actions={canManage ? <Button title="Agregar medicamento" onPress={openCreate} /> : null}
      />

      <Banner tone="error">{error}</Banner>

      {loading && !records.length ? (
        <LamplightPulse label="Cargando medicamentos…" />
      ) : !records.length ? (
        <EmptyState
          title="Sin medicamentos registrados"
          description={canManage ? 'Agrega un medicamento para recibir recordatorios.' : 'Todavía no hay medicamentos registrados.'}
          action={canManage ? <Button title="Agregar medicamento" onPress={openCreate} /> : null}
        />
      ) : (
        <View style={{ gap: spacing.md }}>
          {records.map((r) => (
            <Card key={r._id}>
              <View style={styles.top}>
                <Text style={styles.name}>{r.name}</Text>
                <Text style={styles.dose}>{r.dose}</Text>
              </View>
              <View style={styles.times}>
                {r.times.map((t) => (
                  <Badge key={t} soft>{t}</Badge>
                ))}
              </View>
              {r.notes ? <Text style={styles.notes}>{r.notes}</Text> : null}
              <Text style={styles.lastTaken}>
                {r.lastTakenAt ? `Última toma: ${formatRelative(r.lastTakenAt)}` : 'Sin registro de tomas'}
              </Text>
              {canManage && (
                <>
                  <Button title="Marcar como tomado" size="sm" onPress={() => take(r._id)} style={{ marginTop: spacing.sm }} />
                  <View style={styles.actions}>
                    <Pressable onPress={() => openEdit(r)}>
                      <Text style={styles.edit}>Editar</Text>
                    </Pressable>
                    <Pressable onPress={() => deactivate(r._id)}>
                      <Text style={styles.remove}>Eliminar</Text>
                    </Pressable>
                  </View>
                </>
              )}
            </Card>
          ))}
        </View>
      )}

      <AppModal visible={open} title={editing ? 'Editar medicamento' : 'Agregar medicamento'} onClose={() => setOpen(false)}>
        <MedicationForm
          defaultValues={editing || undefined}
          onSubmit={handleSubmit}
          loading={formState.loading}
          error={formState.error}
        />
      </AppModal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  name: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.ink,
  },
  dose: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
  },
  times: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  notes: {
    marginTop: spacing.xs,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink,
  },
  lastTaken: {
    marginTop: spacing.xs,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkSoft,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  edit: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.dusk,
  },
  remove: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.clay,
  },
});
