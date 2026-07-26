import { useCallback, useState } from 'react';
import { anaApi } from '../../../shared/api';
import { useAsync } from '../../../shared/hooks/useAsync';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const { loading, error, run } = useAsync();

  const send = useCallback(
    (text) =>
      run(async () => {
        setMessages((prev) => [...prev, { from: 'user', text, id: `u-${Date.now()}` }]);
        const res = await anaApi.analyzeText(text);
        const reply = res.data?.messageFromANA || res.data?.response || 'Gracias por contarme.';
        setMessages((prev) => [
          ...prev,
          {
            from:     'ana',
            text:     reply,
            id:       `a-${Date.now()}`,
            analysis: res.data?.analysis,
          },
        ]);
      }),
    [run]
  );

  // Used by useVoice to inject transcription + ANA response from voice endpoint
  const addVoiceMessages = useCallback((userText, anaText, analysis) => {
    const ts = Date.now();
    setMessages((prev) => {
      const next = [...prev];
      if (userText) next.push({ from: 'user', text: userText, id: `u-${ts}`, voice: true });
      if (anaText)  next.push({ from: 'ana',  text: anaText,  id: `a-${ts}`, analysis, voice: true });
      return next;
    });
  }, []);

  return { messages, send, addVoiceMessages, loading, error };
};
