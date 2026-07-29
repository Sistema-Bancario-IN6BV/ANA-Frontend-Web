// Visual-only thresholds (mg/dL) for color-coding readings in the UI.
// Not a medical judgment — ANA's risk engine is the source of truth for alerts.
export const glucoseTone = (value) => {
  if (value < 70) return { label: 'Baja', colorVar: '--risk-alto' };
  if (value <= 140) return { label: 'Normal', colorVar: '--risk-bajo' };
  if (value <= 200) return { label: 'Elevada', colorVar: '--risk-medio' };
  return { label: 'Alta', colorVar: '--risk-critico' };
};
