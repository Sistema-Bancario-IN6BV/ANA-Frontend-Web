import { Outlet } from 'react-router-dom';
import { LamplightPulse } from '../../shared/components';

export const AuthLayout = () => (
  <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
    {/* Left decorative panel */}
    <section className="relative bg-dusk text-parchment flex flex-col justify-center gap-6 px-12 py-16 overflow-hidden max-[860px]:px-8 max-[860px]:py-10">
      {/* Amber glow blob */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 'auto -20% -30% auto',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.22), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="flex items-center gap-3 font-display text-[22px] font-bold relative z-10 animate-[fade-in_0.5s_ease_both]">
        <span
          className="w-3 h-3 rounded-full bg-lamplight"
          style={{ boxShadow: '0 0 0 4px rgba(16,185,129,0.28)' }}
          aria-hidden="true"
        />
        ANA
      </div>

      <h1 className="font-display text-[40px] leading-[1.15] max-w-[420px] relative z-10 animate-[slide-up_0.5s_cubic-bezier(0.22,1,0.36,1)_0.1s_both] max-[860px]:text-[28px]">
        La luz que dejas
        <br />
        encendida para ella.
      </h1>

      <p className="max-w-[380px] text-parchment/78 text-[17px] leading-relaxed relative z-10 animate-[slide-up_0.5s_cubic-bezier(0.22,1,0.36,1)_0.2s_both]">
        Acompañamiento emocional y monitoreo de salud para adultos mayores — y tranquilidad
        para quienes los cuidan.
      </p>

      <div className="relative z-10 animate-[fade-in_0.8s_ease_0.35s_both]">
        <LamplightPulse label="" className="text-lamplight" />
      </div>
    </section>

    {/* Right form panel */}
    <section className="flex items-center justify-center bg-parchment px-6 py-10 animate-[fade-in_0.4s_ease_both]">
      <div className="w-full max-w-[400px]">
        <Outlet />
      </div>
    </section>
  </div>
);
