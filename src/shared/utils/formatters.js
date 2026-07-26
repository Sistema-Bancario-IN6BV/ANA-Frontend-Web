import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDateTime = (value) => {
  if (!value) return '—';
  return format(new Date(value), "d 'de' MMMM, HH:mm", { locale: es });
};

export const formatDate = (value) => {
  if (!value) return '—';
  return format(new Date(value), 'd MMM yyyy', { locale: es });
};

export const formatRelative = (value) => {
  if (!value) return '—';
  return formatDistanceToNow(new Date(value), { locale: es, addSuffix: true });
};

export const initials = (name = '', surname = '') =>
  `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
