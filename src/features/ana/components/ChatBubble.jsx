import clsx from 'clsx';
import { Badge } from '../../../shared/components';
import { RISK_COLOR_VAR, RISK_LABEL, EMOTION_LABEL_ES } from '../../../shared/constants/clinical';

export const ChatBubble = ({ message }) => {
  const isAna = message.from === 'ana';

  return (
    <div
      className={clsx(
        'max-w-[72%] mb-3 text-[16px] leading-relaxed animate-[slide-up_0.3s_cubic-bezier(0.22,1,0.36,1)_both]',
        isAna
          ? 'mr-auto bg-white border border-border rounded-[20px] rounded-bl-[4px] px-4 py-3 shadow-soft'
          : 'ml-auto bg-dusk text-parchment rounded-[20px] rounded-br-[4px] px-4 py-3',
        'max-[640px]:max-w-[90%]',
      )}
    >
      <p>{message.text}</p>
      {isAna && message.analysis && (
        <div className="flex gap-2 mt-2 flex-wrap">
          <Badge tone="soft">
            {EMOTION_LABEL_ES[message.analysis.emotional_state] || message.analysis.emotional_state}
          </Badge>
          {(message.analysis.riskLevel || message.analysis.risk_level) && (
            <Badge colorVar={RISK_COLOR_VAR[message.analysis.riskLevel || message.analysis.risk_level]}>
              Riesgo {RISK_LABEL[message.analysis.riskLevel || message.analysis.risk_level]}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
