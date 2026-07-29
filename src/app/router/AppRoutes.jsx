import { Routes, Route } from 'react-router-dom';
import { AuthLayout } from '../Layouts/AuthLayout';
import { DashboardLayout } from '../Layouts/DashboardLayout';
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute';

import { LoginPage } from '../../features/auth/pages/LoginPage';
import { RegisterPage } from '../../features/auth/pages/RegisterPage';
import { VerifyEmailPage } from '../../features/auth/pages/VerifyEmailPage';
import { ForgotPasswordPage } from '../../features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../../features/auth/pages/ResetPasswordPage';

import { HomePage } from '../../features/home/pages/HomePage';
import { ChatPage } from '../../features/ana/pages/ChatPage';
import { ScanPage } from '../../features/ana/pages/ScanPage';
import { ElderlyInsightsPage } from '../../features/ana/pages/ElderlyInsightsPage';
import { GlucoseListPage } from '../../features/glucose/pages/GlucoseListPage';
import { BloodPressureListPage } from '../../features/bloodPressure/pages/BloodPressureListPage';
import { MedicationsListPage } from '../../features/medications/pages/MedicationsListPage';
import { AlertsPage } from '../../features/alerts/pages/AlertsPage';
import { CaregiversPage } from '../../features/caregivers/pages/CaregiversPage';
import { AdminUsersPage } from '../../features/users/pages/AdminUsersPage';
import { ProfilePage } from '../../features/profile/pages/ProfilePage';
import { NotFoundPage } from '../../features/home/pages/NotFoundPage';
import { HealthLogPage } from '../../features/health/pages/HealthLogPage';

import { ADMIN_ROLE, CAREGIVER_ROLE } from '../../shared/constants/roles';

export const AppRoutes = () => (
  <Routes>
    <Route element={<PublicOnlyRoute />}>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>
    </Route>

    <Route path="/verify-email" element={<AuthLayout />}>
      <Route index element={<VerifyEmailPage />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/ana" element={<ChatPage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/health-log" element={<HealthLogPage />} />
        <Route path="/glucose" element={<GlucoseListPage />} />
        <Route path="/blood-pressure" element={<BloodPressureListPage />} />
        <Route path="/medications" element={<MedicationsListPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/caregivers" element={<CaregiversPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route element={<ProtectedRoute roles={[ADMIN_ROLE]} />}>
          <Route path="/users" element={<AdminUsersPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={[CAREGIVER_ROLE, ADMIN_ROLE]} />}>
          <Route path="/insights" element={<ElderlyInsightsPage />} />
        </Route>
      </Route>
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
