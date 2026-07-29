// Visual-only thresholds for color-coding systolic/diastolic readings.
export const bpTone = (systolic, diastolic) => {
  if (systolic >= 180 || diastolic >= 120) return { label: 'Crisis', colorVar: '--risk-critico' };
  if (systolic >= 140 || diastolic >= 90) return { label: 'Alta', colorVar: '--risk-alto' };
  if (systolic >= 120 || diastolic >= 80) return { label: 'Elevada', colorVar: '--risk-medio' };
  if (systolic < 90 || diastolic < 60) return { label: 'Baja', colorVar: '--risk-alto' };
  return { label: 'Normal', colorVar: '--risk-bajo' };
};
