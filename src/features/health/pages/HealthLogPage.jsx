import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, Droplets, Save } from 'lucide-react';
import { useAsync } from '../../../shared/hooks/useAsync';
import { glucoseApi, bloodPressureApi } from '../../../shared/api';
import { Banner } from '../../../shared/components';

const MEASURE_TYPES = [
  { value: 'AYUNAS', label: 'En ayunas' },
  { value: 'POSTPRANDIAL', label: 'Después de comer' },
  { value: 'ALEATORIO', label: 'Aleatorio' },
];

const BP_STATUS = [
  { value: 'NORMAL', label: 'Normal' },
  { value: 'ELEVADA', label: 'Elevada' },
  { value: 'ALTA', label: 'Alta' },
];

const SectionCard = ({ icon: Icon, iconColor, accentColor, title, children }) => (
  <div className="rounded-2xl p-6 flex flex-col gap-5 border-l-4"
    style={{
      background: 'var(--color-surface-container-lowest)',
      borderLeftColor: accentColor,
      boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
    }}>
    <div className="flex items-center gap-3">
      <Icon size={22} style={{ color: iconColor }} />
      <span className="font-bold text-[17px]" style={{ color: 'var(--color-on-surface)' }}>{title}</span>
    </div>
    {children}
  </div>
);

const BigInput = ({ label, value, onChange, unit, placeholder = '—' }) => (
  <div className="flex flex-col items-center gap-1 flex-1">
    <div className="w-full rounded-xl border-[1.5px] p-3 flex flex-col items-center"
      style={{
        borderColor: 'var(--color-outline-variant)',
        background: 'var(--color-surface-container-low)',
      }}>
      <input
        type="number"
        className="w-full bg-transparent outline-none text-center text-[40px] font-bold"
        style={{ color: 'var(--color-on-surface)', fontFamily: 'Manrope, sans-serif' }}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {unit && <span className="text-[12px] font-semibold uppercase tracking-wide"
        style={{ color: 'var(--color-on-surface-variant)' }}>{unit}</span>}
    </div>
    <span className="text-[11px]" style={{ color: 'var(--color-outline)' }}>{label}</span>
  </div>
);

const ChipSelect = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(o => (
      <button
        key={o.value}
        type="button"
        onClick={() => onChange(o.value)}
        className="px-4 py-2 rounded-full text-[13px] font-bold transition-all border-[1.5px]"
        style={value === o.value
          ? { background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)', borderColor: 'var(--color-primary-container)' }
          : { background: 'var(--color-surface-container-lowest)', color: 'var(--color-on-surface-variant)', borderColor: 'var(--color-outline-variant)' }
        }
      >
        {o.label}
      </button>
    ))}
  </div>
);

export const HealthLogPage = () => {
  const navigate = useNavigate();
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [bpStatus, setBpStatus] = useState('NORMAL');
  const [glucose, setGlucose] = useState('');
  const [measureType, setMeasureType] = useState('AYUNAS');
  const [notes, setNotes] = useState('');

  const { loading: bpLoading, run: runBp, error: bpError } = useAsync();
  const { loading: gLoading, run: runG, error: gError } = useAsync();

  const loading = bpLoading || gLoading;
  const error = bpError || gError;

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

  const handleSave = async () => {
    const tasks = [];
    if (systolic && diastolic) {
      tasks.push(runBp(() => bloodPressureApi.create({
        systolic: Number(systolic), diastolic: Number(diastolic),
        pulse: pulse ? Number(pulse) : undefined,
        notes: notes || undefined,
      })));
    }
    if (glucose) {
      tasks.push(runG(() => glucoseApi.create({
        glucoseLevel: Number(glucose), measureType, notes: notes || undefined,
      })));
    }
    if (!tasks.length) return;
    await Promise.all(tasks);
    if (!bpError && !gError) navigate('/');
  };

  const canSave = (systolic && diastolic) || glucose;

  return (
    <div className="max-w-xl mx-auto animate-[fade-in_0.35s_ease_both] flex flex-col gap-5">
      {/* Header */}
      <div className="rounded-2xl p-5 border-l-4"
        style={{
          background: 'var(--color-surface-container-lowest)',
          borderLeftColor: 'var(--color-primary-container)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
        }}>
        <h1 className="font-bold text-[22px]" style={{ color: 'var(--color-on-surface)' }}>
          Nuevo Registro
        </h1>
        <p className="text-[13px] mt-1 capitalize" style={{ color: 'var(--color-on-surface-variant)' }}>
          {dateStr} · {timeStr}
        </p>
      </div>

      <Banner tone="error">{error}</Banner>

      {/* Blood Pressure */}
      <SectionCard icon={HeartPulse} iconColor="var(--color-secondary)"
        accentColor="var(--color-secondary)" title="Presión Arterial">
        <div className="flex items-center gap-3">
          <BigInput label="SYS" value={systolic} onChange={setSystolic} unit="mmHg" />
          <span className="text-[28px] font-bold" style={{ color: 'var(--color-outline-variant)' }}>/</span>
          <BigInput label="DIA" value={diastolic} onChange={setDiastolic} unit="mmHg" />
          <BigInput label="Pulso" value={pulse} onChange={setPulse} unit="BPM" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-bold tracking-wide" style={{ color: 'var(--color-on-surface-variant)' }}>
            ESTADO
          </span>
          <ChipSelect options={BP_STATUS} value={bpStatus} onChange={setBpStatus} />
        </div>
      </SectionCard>

      {/* Glucose */}
      <SectionCard icon={Droplets} iconColor="var(--color-primary-container)"
        accentColor="var(--color-primary-container)" title="Glucosa en Sangre">
        <BigInput label="Nivel de glucosa" value={glucose} onChange={setGlucose} unit="mg/dL" />
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-bold tracking-wide" style={{ color: 'var(--color-on-surface-variant)' }}>
            TIPO DE MEDICIÓN
          </span>
          <ChipSelect options={MEASURE_TYPES} value={measureType} onChange={setMeasureType} />
        </div>
      </SectionCard>

      {/* Notes */}
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-bold" style={{ color: 'var(--color-on-surface-variant)' }}>
          Notas adicionales
        </span>
        <textarea
          rows={3}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="¿Cómo te sientes? Agrega cualquier observación…"
          className="w-full rounded-xl p-4 text-[15px] outline-none resize-none transition-all"
          style={{
            border: '1.5px solid var(--color-outline-variant)',
            background: 'var(--color-surface-container-lowest)',
            color: 'var(--color-on-surface)',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--color-primary-container)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-outline-variant)'}
        />
      </div>

      {/* Save */}
      <button
        type="button"
        disabled={!canSave || loading}
        onClick={handleSave}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-[16px] transition-all active:scale-[0.98] disabled:opacity-50"
        style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
      >
        <Save size={18} />
        {loading ? 'Guardando…' : 'Guardar Registro'}
      </button>
    </div>
  );
};
