import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, Mic, MicOff, Send, Volume2 } from 'lucide-react';
import { Banner, EmptyState } from '../../../shared/components';
import { useChat } from '../hooks/useChat';
import { useVoice } from '../hooks/useVoice';
import { ChatBubble } from '../components/ChatBubble';
import { InsightsPanel } from '../components/InsightsPanel';

const SUGGESTIONS = [
  { icon: '📊', label: 'Registrar glucosa' },
  { icon: '❤️', label: 'Presión arterial' },
  { icon: '💬', label: '¿Cómo me siento?' },
  { icon: '📅', label: 'Mi próxima cita' },
];

const PHASE_LABEL = {
  idle:       'Toca para hablar con Ana',
  recording:  'Escuchando… Toca para detener',
  processing: 'Procesando…',
  speaking:   'Ana está hablando…',
};

const Waveform = ({ active }) => (
  <div className="flex items-center gap-1">
    {[3, 6, 9, 12, 9, 6, 3, 6, 9, 12].map((h, i) => (
      <div
        key={i}
        className="w-1 rounded-full transition-all duration-300"
        style={{
          height: active ? `${h * 2 + 4}px` : '6px',
          background: 'rgba(255,255,255,0.7)',
        }}
      />
    ))}
  </div>
);

export const ChatPage = () => {
  const { messages, send, addVoiceMessages, loading: textLoading, error: textError } = useChat();
  const [text, setText] = useState('');
  const listRef = useRef(null);

  const { phase, toggle, error: voiceError } = useVoice({
    onMessage: useCallback(
      ({ user, ana, emotion, risk }) => {
        addVoiceMessages(user, ana, { emotional_state: emotion, risk_level: risk });
      },
      [addVoiceMessages]
    ),
  });

  const loading    = textLoading || phase === 'processing';
  const active     = phase === 'recording' || phase === 'speaking' || textLoading;
  const error      = voiceError || textError;

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    send(text.trim());
    setText('');
  };

  const MicIcon = phase === 'recording' ? MicOff : phase === 'speaking' ? Volume2 : Mic;

  return (
    <div className="grid gap-5 items-start" style={{ gridTemplateColumns: '1fr 300px' }}>
      {/* Main chat */}
      <div
        className="flex flex-col rounded-2xl overflow-hidden"
        style={{ height: '80vh', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
      >
        {/* Voice header */}
        <div
          className="flex flex-col items-center gap-4 px-6 py-8 relative"
          style={{ background: 'linear-gradient(160deg, #006c49 0%, #004d35 100%)' }}
        >
          <Waveform active={active} />

          <button
            type="button"
            onClick={toggle}
            disabled={phase === 'processing'}
            className="w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-xl disabled:opacity-60"
            style={{
              background: phase === 'recording'
                ? '#dc2626'
                : phase === 'speaking'
                ? '#2563eb'
                : 'var(--color-primary-container)',
              boxShadow: phase === 'recording'
                ? '0 0 32px rgba(220,38,38,0.5)'
                : '0 0 32px rgba(16,185,129,0.4)',
            }}
            aria-label={phase === 'recording' ? 'Detener grabación' : 'Hablar con Ana'}
          >
            {phase === 'processing'
              ? <Loader2 size={32} color="white" className="animate-spin" />
              : <MicIcon size={32} color="white" />}
          </button>

          <div>
            <h2 className="text-white font-bold text-[20px] text-center">Habla con Ana</h2>
            <p className="text-white/70 text-[13px] text-center mt-1">
              {PHASE_LABEL[phase]}
            </p>
          </div>

          {/* Suggestion chips */}
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map(({ icon, label }) => (
              <button
                key={label}
                type="button"
                onClick={() => send(label)}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold text-white transition-all hover:opacity-80 disabled:opacity-40"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        <Banner tone="error">{error}</Banner>

        {/* Message history */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-5 flex flex-col scroll-smooth"
          style={{ background: 'var(--color-surface)' }}
        >
          {!messages.length && (
            <EmptyState
              title="Empieza la conversación"
              description="Toca el micrófono o escribe para hablar con Ana."
            />
          )}
          {messages.map((m) => (
            <ChatBubble key={m.id} message={m} />
          ))}
        </div>

        {/* Composer */}
        <form
          onSubmit={onSubmit}
          className="flex gap-3 p-4 border-t"
          style={{
            background: 'var(--color-surface)',
            borderTopColor: 'var(--color-outline-variant)',
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe aquí…"
            aria-label="Mensaje para ANA"
            className="flex-1 min-h-[48px] rounded-full px-5 text-[15px] transition-all outline-none"
            style={{
              border: '1.5px solid var(--color-outline-variant)',
              background: 'var(--color-surface-container-lowest)',
              color: 'var(--color-on-surface)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary-container)')}
            onBlur={(e)  => (e.target.style.borderColor = 'var(--color-outline-variant)')}
          />
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95 disabled:opacity-50"
            style={{ background: 'var(--color-primary-container)' }}
            aria-label="Enviar"
          >
            {textLoading
              ? <Loader2 size={18} color="white" className="animate-spin" />
              : <Send size={18} color="var(--color-on-primary-container)" />}
          </button>
        </form>
      </div>

      <InsightsPanel />
    </div>
  );
};
