import { Link } from 'react-router-dom';
import { Users, Droplets, HeartPulse, Bell } from 'lucide-react';
import { Card, PageHeader } from '../../../shared/components';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useCaregivers } from '../../caregivers/hooks/useCaregivers';
import { useAlerts } from '../../alerts/hooks/useAlerts';

const TILES = [
  {
    to: '/caregivers',
    Icon: Users,
    title: 'Mis adultos mayores',
    desc: 'A quién acompañas.',
    iconBg: 'bg-parchment-dim',
    iconColor: 'text-dusk',
  },
  {
    to: '/glucose',
    Icon: Droplets,
    title: 'Glucosa',
    desc: 'Lecturas recientes.',
    iconBg: 'bg-sage-dim',
    iconColor: 'text-sage',
  },
  {
    to: '/blood-pressure',
    Icon: HeartPulse,
    title: 'Presión arterial',
    desc: 'Lecturas recientes.',
    iconBg: 'bg-ember-dim',
    iconColor: 'text-ember',
  },
  {
    to: '/alerts',
    Icon: Bell,
    title: 'Alertas',
    desc: 'Avisos que requieren atención.',
    iconBg: 'bg-clay-dim',
    iconColor: 'text-clay',
  },
];

export const CaregiverHome = () => {
  const { user } = useAuth();
  const { links } = useCaregivers();
  const { alerts } = useAlerts();
  const unread = alerts.filter((a) => !a.isRead).length;

  return (
    <div>
      <PageHeader
        eyebrow="Panel de cuidado"
        title={`Hola, ${user?.username || ''}`}
        description="Así está hoy la persona que acompañas."
      />

      <div className="grid grid-cols-2 gap-4 mb-8 animate-[slide-up_0.4s_cubic-bezier(0.22,1,0.36,1)_0.05s_both]">
        <Card>
          <div className="text-[30px] font-bold text-dusk">{links.length}</div>
          <div className="text-ink-soft text-[13px] font-bold uppercase tracking-wide mt-1">Adultos mayores vinculados</div>
        </Card>
        <Card>
          <div className="text-[30px] font-bold text-dusk">{unread}</div>
          <div className="text-ink-soft text-[13px] font-bold uppercase tracking-wide mt-1">Alertas sin leer</div>
        </Card>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {TILES.map(({ to, Icon, title, desc, iconBg, iconColor }, i) => (
          <Link key={to} to={to} className="block cursor-pointer">
            <Card
              hover
              className="h-full flex flex-col gap-3 animate-[slide-up_0.4s_cubic-bezier(0.22,1,0.36,1)_both]"
              style={{ animationDelay: `${0.1 + i * 0.07}s` }}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
                <Icon size={22} strokeWidth={2} />
              </div>
              <div>
                <div className="font-bold text-ink text-[16px] mb-1">{title}</div>
                <div className="text-ink-soft text-sm leading-relaxed">{desc}</div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
