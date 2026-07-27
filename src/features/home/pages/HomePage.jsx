import { useAuth } from '../../../shared/hooks/useAuth';
import { ElderlyHome } from './ElderlyHome';
import { CaregiverHome } from './CaregiverHome';
import { AdminHome } from './AdminHome';
import { ELDERLY_ROLE, CAREGIVER_ROLE, ADMIN_ROLE } from '../../../shared/constants/roles';

export const HomePage = () => {
  const { role } = useAuth();

  if (role === ELDERLY_ROLE) return <ElderlyHome />;
  if (role === CAREGIVER_ROLE) return <CaregiverHome />;
  if (role === ADMIN_ROLE) return <AdminHome />;
  return null;
};
