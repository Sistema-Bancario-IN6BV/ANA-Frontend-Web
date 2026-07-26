import { useState } from 'react';
import { PageHeader, Card, Banner, LamplightPulse, EmptyState, Input, Badge } from '../../../shared/components';
import { ADMIN_ROLE, ELDERLY_ROLE, CAREGIVER_ROLE, ROLE_LABELS, ALL_ROLES } from '../../../shared/constants/roles';
import { useUsersByRole } from '../hooks/useUsersByRole';
import './AdminUsersPage.css';

const TABS = [
  { value: ELDERLY_ROLE, label: 'Adultos mayores' },
  { value: CAREGIVER_ROLE, label: 'Cuidadores' },
  { value: ADMIN_ROLE, label: 'Administradores' },
];

export const AdminUsersPage = () => {
  const [tab, setTab] = useState(ELDERLY_ROLE);
  const { users, loading, error, changeRole } = useUsersByRole(tab);

  return (
    <div>
      <PageHeader eyebrow="Administración" title="Usuarios y roles" description="Gestiona qué rol tiene cada cuenta del sistema." />

      <div className="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            className="admin-tabs__tab"
            data-active={tab === t.value}
            onClick={() => setTab(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Banner tone="error">{error}</Banner>

      {loading && !users.length ? (
        <LamplightPulse label="Cargando usuarios…" />
      ) : !users.length ? (
        <EmptyState title="Sin usuarios en este rol" />
      ) : (
        <Card padded={false}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Estado</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    {u.name} {u.surname}
                  </td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <Badge colorVar={u.status ? '--risk-bajo' : '--risk-alto'} tone="soft">
                      {u.status ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td>
                    <Input
                      as="select"
                      id={`role-${u.id}`}
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className="admin-table__role-select"
                    >
                      {ALL_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABELS[r]}
                        </option>
                      ))}
                    </Input>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};
