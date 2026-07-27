import { Screen, ScreenHeader, Banner, EmptyState, LamplightPulse } from '../../../shared/components';
import { useAlerts } from '../hooks/useAlerts';
import { AlertCard } from '../components/AlertCard';

export const AlertsScreen = () => {
  const { alerts, loading, error, markAsRead, deactivate } = useAlerts();

  return (
    <Screen>
      <ScreenHeader eyebrow="Monitoreo" title="Alertas" description="Avisos generados por ANA según el riesgo detectado." />
      <Banner tone="error">{error}</Banner>

      {loading && !alerts.length ? (
        <LamplightPulse label="Buscando alertas…" />
      ) : !alerts.length ? (
        <EmptyState title="Sin alertas" description="No hay alertas registradas. Buena señal." />
      ) : (
        alerts.map((alert) => (
          <AlertCard key={alert._id} alert={alert} onMarkAsRead={markAsRead} onDismiss={deactivate} />
        ))
      )}
    </Screen>
  );
};
