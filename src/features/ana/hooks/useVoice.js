import { useCallback, useRef, useState } from 'react';
import { anaApi } from '../../../shared/api';

/**
 * Manages the full voice pipeline:
 *   idle → recording → processing → speaking → idle
 *
 * @param {function} onMessage  Called with { user, ana, emotion, risk } when a response arrives
 */
export const useVoice = ({ onMessage } = {}) => {
  const [phase, setPhase] = useState('idle'); // 'idle' | 'recording' | 'processing' | 'speaking'
  const [error, setError] = useState(null);
  const recorderRef = useRef(null);
  const chunksRef   = useRef([]);
  const audioRef    = useRef(null);

  const start = useCallback(async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Tu navegador no soporta acceso al micrófono');
      return;
    }
    try {
      const stream   = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        handleStop(mimeType);
      };

      recorder.start(200); // collect data every 200 ms
      recorderRef.current = recorder;
      setPhase('recording');
    } catch {
      setError('No se pudo acceder al micrófono. Verifica los permisos.');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const stop = useCallback(() => {
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop();
    }
  }, []);

  const toggle = useCallback(() => {
    if (phase === 'idle') start();
    else if (phase === 'recording') stop();
  }, [phase, start, stop]);

  async function handleStop(mimeType) {
    setPhase('processing');

    const blob = new Blob(chunksRef.current, { type: mimeType });
    if (blob.size < 2000) {
      // Audio too short — likely silence
      setPhase('idle');
      return;
    }

    try {
      const result = await anaApi.analyzeVoiceSpeak(blob);

      if (result.type !== 'audio') {
        setPhase('idle');
        return;
      }

      // Notify chat
      onMessage?.({
        user:    result.transcription,
        ana:     result.response,
        emotion: result.emotion,
        risk:    result.risk,
      });

      // Play ANA's MP3 response
      setPhase('speaking');
      const url   = URL.createObjectURL(result.blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(url);
        setPhase('idle');
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        setPhase('idle');
      };

      await audio.play().catch(() => setPhase('idle'));
    } catch (err) {
      setError(err.message || 'Error al procesar la voz');
      setPhase('idle');
    }
  }

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPhase('idle');
  }, []);

  return { phase, toggle, stop, stopPlayback, error, setError };
};
