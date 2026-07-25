import { httpClient } from './httpClient';

export const anaApi = {
  analyzeText: (text) => httpClient.post('/ana/analyze', { text }).then((r) => r.data),

  // Voice → JSON (transcription + analysis text)
  analyzeVoice: (blob) => {
    const form = new FormData();
    form.append('audio', blob, 'audio.webm');
    return httpClient
      .post('/ana/voice', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data);
  },

  // Voice → MP3 (ANA habla con voz femenina según idioma detectado)
  // Returns { type:'audio', blob, transcription, response, emotion, risk } | { type:'empty' }
  analyzeVoiceSpeak: async (blob) => {
    const form = new FormData();
    form.append('audio', blob, 'audio.webm');
    const resp = await httpClient.post('/ana/voice/speak', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'arraybuffer',
    });
    const ct = resp.headers['content-type'] || '';
    if (!ct.includes('audio')) return { type: 'empty' };
    return {
      type: 'audio',
      blob: new Blob([resp.data], { type: 'audio/mpeg' }),
      transcription: decodeURIComponent(resp.headers['x-transcription'] || ''),
      response:      decodeURIComponent(resp.headers['x-response']      || ''),
      emotion:       resp.headers['x-emotion']  || 'neutral',
      risk:          resp.headers['x-risk']     || 'bajo',
    };
  },

  // Visión → detecta objetos/riesgos (caídas, soledad, medicación) en una foto
  detectObjects: (file) => {
    const form = new FormData();
    form.append('file', file, file.name || 'scene.jpg');
    return httpClient
      .post('/ana/vision/detect', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data);
  },

  // Documentos → OCR + entidades de salud de una receta/informe (PDF o imagen)
  readDocument: (file) => {
    const form = new FormData();
    form.append('file', file, file.name || 'document.pdf');
    return httpClient
      .post('/ana/documents/read', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data);
  },

  getScans: (type, limit = 5, skip = 0) =>
    httpClient.get('/ana/scans', { params: { type, limit, skip } }).then((r) => r.data),

  getWeeklySummary: (elderlyId) =>
    httpClient.get('/ana/summary', { params: elderlyId ? { elderlyId } : {} }).then((r) => r.data),
  getHistory: (limit = 20, skip = 0, elderlyId) =>
    httpClient
      .get('/ana/history', { params: { limit, skip, ...(elderlyId ? { elderlyId } : {}) } })
      .then((r) => r.data),
  getById: (id) => httpClient.get(`/ana/${id}`).then((r) => r.data),
  delete: (id) => httpClient.delete(`/ana/${id}`).then((r) => r.data),
  getEmotionsStats: (elderlyId) =>
    httpClient.get('/ana/stats/emotions', { params: elderlyId ? { elderlyId } : {} }).then((r) => r.data),
};
