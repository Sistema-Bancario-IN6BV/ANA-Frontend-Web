import { useCallback, useEffect, useState } from 'react';
import { medicationsApi } from '../../../shared/api';
import { useAsync } from '../../../shared/hooks/useAsync';
import { cancelMedicationReminders, scheduleMedicationReminders } from '../../../shared/notifications/pushNotifications';

export const useMedications = () => {
  const [records, setRecords] = useState([]);
  const { loading, error, run } = useAsync();

  const load = useCallback(
    () =>
      run(async () => {
        const res = await medicationsApi.list();
        const meds = res.data || [];
        setRecords(meds);
        // Re-sincroniza los recordatorios locales con lo que hay en el servidor
        // (p. ej. si el usuario reinstaló la app o cambió de dispositivo).
        meds.forEach((med) => scheduleMedicationReminders(med).catch(() => {}));
      }),
    [run]
  );

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const create = (payload) =>
    run(() => medicationsApi.create(payload))
      .then((res) => scheduleMedicationReminders(res.data).catch(() => {}))
      .then(() => load());

  const update = (id, payload) =>
    run(() => medicationsApi.update(id, payload))
      .then((res) => scheduleMedicationReminders(res.data).catch(() => {}))
      .then(() => load());

  const deactivate = (id) =>
    run(() => medicationsApi.deactivate(id))
      .then(() => cancelMedicationReminders(id).catch(() => {}))
      .then(() => load());

  const take = (id) => run(() => medicationsApi.take(id)).then(() => load());

  return { records, loading, error, create, update, deactivate, take };
};
