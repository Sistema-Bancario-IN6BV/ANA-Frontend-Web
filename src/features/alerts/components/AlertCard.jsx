import clsx from 'clsx';
import { Badge } from '../../../shared/components';
import { ALERT_TYPE_LABEL, SEVERITY_COLOR_VAR, SEVERITY_LABEL } from '../../../shared/constants/clinical';
import { formatRelative } from '../../../shared/utils/formatters';
import './AlertCard.css';

export const AlertCard = ({ alert, onMarkAsRead, onDismiss }) => (
  <div
    className={clsx('alert-card', !alert.isRead && 'alert-card--unread')}
    style={{ '--alert-color': `var(${SEVERITY_COLOR_VAR[alert.severity]})` }}
  >
    <div className="alert-card__bar" />
    <div className="alert-card__body">
      <div className="alert-card__top">
        <Badge colorVar={SEVERITY_COLOR_VAR[alert.severity]}>{SEVERITY_LABEL[alert.severity]}</Badge>
        <span className="alert-card__type">{ALERT_TYPE_LABEL[alert.type] || alert.type}</span>
        <span className="alert-card__time">{formatRelative(alert.createdAt)}</span>
      </div>
      <p className="alert-card__message">{alert.message}</p>
      <div className="alert-card__actions">
        {!alert.isRead && (
          <button type="button" onClick={() => onMarkAsRead(alert._id)}>
            Marcar como leída
          </button>
        )}
        <button type="button" onClick={() => onDismiss(alert._id)}>
          Descartar
        </button>
      </div>
    </div>
  </div>
);
