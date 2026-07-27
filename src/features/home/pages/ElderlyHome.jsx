import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Plus, Bot, AlertTriangle, Users, Droplets, HeartPulse } from 'lucide-react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useGlucose } from '../../glucose/hooks/useGlucose';
import { useBloodPressure } from '../../bloodPressure/hooks/useBloodPressure';
import { useAlerts } from '../../alerts/hooks/useAlerts';
import { glucoseTone } from '../../glucose/components/glucoseLevels';
import { bpTone } from '../../bloodPressure/components/bpLevels';
import { ALERT_TYPE_LABEL, SEVERITY_COLOR_VAR } from '../../../shared/constants/clinical';
import { formatRelative } from '../../../shared/utils/formatters';

const MetricCard = ({ icon: Icon, iconColor, borderColor, label, value, unit, badge, to }) => (
  <Link to={to} className="block hover:opacity-90 transition-opacity">
    <div className="rounded-xl p-4 shadow-sm flex flex-col gap-2 border-l-4 h-full"
      style={{
        background: 'var(--color-surface-container-lowest)',
        borderLeftColor: borderColor,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      }}>
      <div className="flex justify-between items-start">
        <Icon size={20} style={{ color: iconColor }} />
        {badge && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)' }}>
            {badge}
          </span>
        )}
      </div>
      <span className="text-[12px] font-semibold tracking-wide" style={{ color: 'var(--color-on-surface-variant)' }}>
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-[28px] font-bold" style={{ color: 'var(--color-on-surface)' }}>{value}</span>
        {unit && <span className="text-[12px]" style={{ color: 'var(--color-on-surface-variant)' }}>{unit}</span>}
      </div>
    </div>
  </Link>
);

const QuickAction = ({ to, bgColor, textColor, icon: Icon, label }) => (
  <Link to={to}
    className="flex flex-col items-center justify-center gap-2 py-6 rounded-xl shadow-md transition-all active:scale-95 hover:opacity-90"
    style={{ background: bgColor, color: textColor }}>
    <Icon size={28} />
    <span className="text-[14px] font-bold tracking-wide">{label}</span>
  </Link>
);

const NextStepCard = ({ icon: Icon, iconColor, accent, title, sub, action }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl border-l-4"
    style={{
      background: 'var(--color-surface-container-lowest)',
      borderLeftColor: accent,
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
    }}>
    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: `${accent}22` }}>
      <Icon size={18} style={{ color: iconColor }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-[15px]" style={{ color: 'var(--color-on-surface)' }}>{title}</p>
      <p className="text-[12px]" style={{ color: 'var(--color-on-surface-variant)' }}>{sub}</p>
    </div>
    {action && (
      <span className="text-[13px] font-bold flex-shrink-0" style={{ color: 'var(--color-primary)' }}>{action}</span>
    )}
  </div>
);

// Rango clínico usado únicamente para escalar las barras del sparkline (no es un umbral médico).
const GLUCOSE_CHART_MIN = 40;
const GLUCOSE_CHART_MAX = 300;

export const ElderlyHome = () => {
  const { user } = useAuth();
  const name = user?.username || user?.name || 'Usuario';

  const { records: glucoseRecords, loading: glucoseLoading } = useGlucose();
  const { records: bpRecords, loading: bpLoading } = useBloodPressure();
  const { alerts } = useAlerts();

  const latestGlucose = glucoseRecords[0];
  const latestBp = bpRecords[0];
  const glucoseBadge = latestGlucose ? glucoseTone(latestGlucose.glucoseLevel) : null;
  const bpBadge = latestBp ? bpTone(latestBp.systolic, latestBp.diastolic) : null;

  const lastUpdated = [latestGlucose?.measuredAt, latestBp?.measuredAt]
    .filter(Boolean)
    .sort((a, b) => new Date(b) - new Date(a))[0];

  const trendBars = useMemo(
    () =>
      [...glucoseRecords]
        .sort((a, b) => new Date(a.measuredAt) - new Date(b.measuredAt))
        .slice(-7)
        .map((r) => ({
          height: Math.min(
            100,
            Math.max(
              8,
              ((r.glucoseLevel - GLUCOSE_CHART_MIN) / (GLUCOSE_CHART_MAX - GLUCOSE_CHART_MIN)) * 100
            )
          ),
        })),
    [glucoseRecords]
  );

  const nextSteps = alerts
    .filter((a) => !a.isRead)
    .slice(0, 3);

  return (
    <div className="max-w-2xl mx-auto animate-[fade-in_0.35s_ease_both]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 flex items-center justify-center font-bold text-white text-sm"
            style={{ borderColor: 'var(--color-primary-container)', background: 'var(--color-primary)' }}>
            {name[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-[20px] font-bold" style={{ color: 'var(--color-primary)' }}>
              ¡Hola, {name}!
            </h1>
            <p className="text-[12px]" style={{ color: 'var(--color-on-surface-variant)' }}>
              Tu panel de salud
            </p>
          </div>
        </div>
        <Link to="/alerts" className="w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-surface-container-low"
          style={{ color: 'var(--color-primary)' }} aria-label="Notificaciones">
          <Bell size={20} />
        </Link>
      </div>

      {/* Today summary label */}
      <div className="flex justify-between items-end mb-3">
        <span className="text-[11px] font-bold uppercase tracking-widest"
          style={{ color: 'var(--color-on-surface-variant)' }}>Resumen de hoy</span>
        <span className="text-[11px]" style={{ color: 'var(--color-primary)' }}>
          {lastUpdated ? `Actualizado ${formatRelative(lastUpdated)}` : 'Sin registros aún'}
        </span>
      </div>

      {/* Bento grid — vitals */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <MetricCard
          icon={Droplets} iconColor="var(--color-primary-container)"
          borderColor="var(--color-primary-container)"
          label="Glucosa"
          value={latestGlucose ? latestGlucose.glucoseLevel : glucoseLoading ? '…' : '—'}
          unit="mg/dL"
          badge={glucoseBadge ? glucoseBadge.label : 'Sin datos'} to="/glucose"
        />
        <MetricCard
          icon={HeartPulse} iconColor="var(--color-secondary)"
          borderColor="var(--color-secondary)"
          label="Presión Arterial"
          value={latestBp ? `${latestBp.systolic}/${latestBp.diastolic}` : bpLoading ? '…' : '—'}
          badge={bpBadge ? bpBadge.label : 'Sin datos'} to="/blood-pressure"
        />
        {/* Weekly trend */}
        {trendBars.length > 1 && (
          <div className="col-span-2 rounded-xl p-4"
            style={{
              background: 'var(--color-surface-container-lowest)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}>
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-[14px]" style={{ color: 'var(--color-on-surface)' }}>
                Tendencia de glucosa
              </span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-primary-container)' }} />
                <span className="text-[11px]" style={{ color: 'var(--color-on-surface-variant)' }}>Últimas lecturas</span>
              </div>
            </div>
            <div className="h-20 flex items-end justify-between px-2 pb-1"
              style={{ borderBottom: '1px solid var(--color-outline-variant)' }}>
              {trendBars.map((bar, i) => (
                <div key={i} className="w-5 rounded-t-sm"
                  style={{
                    height: `${bar.height}%`,
                    background: `rgba(16,185,129,${0.2 + (i / trendBars.length) * 0.6})`,
                  }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <p className="text-[11px] font-bold uppercase tracking-widest mb-3"
        style={{ color: 'var(--color-on-surface-variant)' }}>
        Acciones Rápidas
      </p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <QuickAction
          to="/health-log"
          bgColor="var(--color-primary)" textColor="var(--color-on-primary)"
          icon={Plus} label="Registrar Vitales"
        />
        <QuickAction
          to="/ana"
          bgColor="var(--color-secondary)" textColor="var(--color-on-secondary)"
          icon={Bot} label="Asistente Virtual"
        />
      </div>

      {/* Próximos pasos */}
      <p className="text-[11px] font-bold uppercase tracking-widest mb-3"
        style={{ color: 'var(--color-on-surface-variant)' }}>
        Próximos Pasos
      </p>
      <div className="flex flex-col gap-3">
        {nextSteps.length === 0 && (
          <div className="flex items-center gap-4 p-4 rounded-xl"
            style={{ background: 'var(--color-surface-container-lowest)' }}>
            <p className="text-[13px]" style={{ color: 'var(--color-on-surface-variant)' }}>
              No tienes alertas pendientes. ¡Todo en orden!
            </p>
          </div>
        )}
        {nextSteps.map((alert) => (
          <Link key={alert._id} to="/alerts">
            <NextStepCard
              icon={AlertTriangle}
              iconColor={`var(${SEVERITY_COLOR_VAR[alert.severity]})`}
              accent={`var(${SEVERITY_COLOR_VAR[alert.severity]})`}
              title={ALERT_TYPE_LABEL[alert.type] || alert.type}
              sub={formatRelative(alert.createdAt)}
              action="Ver"
            />
          </Link>
        ))}
        <Link to="/caregivers">
          <NextStepCard
            icon={Users} iconColor="var(--color-primary)"
            accent="var(--color-primary)"
            title="Mis cuidadores"
            sub="Ver quién te acompaña"
          />
        </Link>
      </div>
    </div>
  );
};
