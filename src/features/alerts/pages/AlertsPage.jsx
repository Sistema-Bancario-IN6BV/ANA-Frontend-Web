import { PageHeader, Banner, LamplightPulse, EmptyState, Input } from '../../../shared/components';
import { SEVERITY_LABEL, ALERT_TYPE_LABEL } from '../../../shared/constants/clinical';
import { useAlerts } from '../hooks/useAlerts';
import { AlertCard } from '../components/AlertCard';
import './AlertsPage.css';

export const AlertsPage = () => {
  const { alerts, loading, error, filters, setFilters, markAsRead, deactivate } = useAlerts();

  return (
    <div>
      <PageHeader eyebrow="Monitoreo" title="Alertas" description="Avisos generados por ANA según el riesgo detectado." />

      <Banner tone="error">{error}</Banner>

      <div className="alerts-filters">
        <Input
          as="select"
          id="severity"
          label="Severidad"
          value={filters.severity}
          onChange={(e) => setFilters((f) => ({ ...f, severity: e.target.value }))}
        >
          <option value="">Todas</option>
          {Object.entries(SEVERITY_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Input>
        <Input
          as="select"
          id="type"
          label="Tipo"
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
        >
          <option value="">Todos</option>
          {Object.entries(ALERT_TYPE_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Input>
        <Input
          as="select"
          id="isRead"
          label="Estado"
          value={filters.isRead}
          onChange={(e) => setFilters((f) => ({ ...f, isRead: e.target.value }))}
        >
          <option value="">Todas</option>
          <option value="false">No leídas</option>
          <option value="true">Leídas</option>
        </Input>
      </div>

      {loading && !alerts.length ? (
        <LamplightPulse label="Buscando alertas…" />
      ) : !alerts.length ? (
        <EmptyState title="Sin alertas" description="No hay alertas que coincidan con estos filtros. Buena señal." />
      ) : (
        alerts.map((alert) => (
          <AlertCard key={alert._id} alert={alert} onMarkAsRead={markAsRead} onDismiss={deactivate} />
        ))
      )}
    </div>
  );
};
