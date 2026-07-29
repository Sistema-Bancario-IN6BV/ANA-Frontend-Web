// Severity/risk vocabulary shared across alerts, glucose, blood pressure and ANA.

export const SEVERITY = {
  BAJA: 'BAJA',
  MEDIA: 'MEDIA',
  ALTA: 'ALTA',
  CRITICA: 'CRITICA',
};

export const SEVERITY_LABEL = {
  BAJA: 'Baja',
  MEDIA: 'Media',
  ALTA: 'Alta',
  CRITICA: 'Crítica',
};

export const SEVERITY_COLOR_VAR = {
  BAJA: '--risk-bajo',
  MEDIA: '--risk-medio',
  ALTA: '--risk-alto',
  CRITICA: '--risk-critico',
};

export const RISK_LABEL = {
  bajo: 'Bajo',
  medio: 'Medio',
  alto: 'Alto',
  critico: 'Crítico',
};

export const RISK_COLOR_VAR = {
  bajo: '--risk-bajo',
  medio: '--risk-medio',
  alto: '--risk-alto',
  critico: '--risk-critico',
};

export const ALERT_TYPE_LABEL = {
  EMOCION_NEGATIVA: 'Emoción negativa',
  PRESION_ALTA: 'Presión alta',
  PRESION_BAJA: 'Presión baja',
  GLUCOSA_ALTA: 'Glucosa alta',
  GLUCOSA_BAJA: 'Glucosa baja',
  INACTIVIDAD: 'Inactividad',
  RIESGO_CAIDA: 'Riesgo de caída',
  MEDICAMENTO_OMITIDO: 'Medicamento omitido',
};

export const MEASURE_TYPE_LABEL = {
  AYUNAS: 'En ayunas',
  POSTPRANDIAL: 'Después de comer',
  ALEATORIO: 'Aleatorio',
};

export const RELATIONSHIP_LABEL = {
  HIJO: 'Hijo/a',
  NIETO: 'Nieto/a',
  FAMILIAR: 'Familiar',
  PROFESIONAL: 'Profesional de salud',
};

export const EMOTION_LABEL_ES = {
  alegria: 'Alegría',
  tristeza: 'Tristeza',
  miedo: 'Miedo',
  ira: 'Ira',
  disgust: 'Disgusto',
  estresado: 'Estresado',
  deprimido: 'Decaído',
  ansioso: 'Ansioso',
  neutral: 'Neutral',
  soledad: 'Soledad',
  confuso: 'Confundido',
  euforia: 'Euforia',
};
