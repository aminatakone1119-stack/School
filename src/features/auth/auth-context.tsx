import React, { createContext, useContext, useState } from 'react';
import { UserRole } from '@school-management/types';
import { ROLE_DEFAULT_PERMISSIONS, PermissionCode } from '@school-management/shared';

export interface UserSession {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId: string;
  schoolName: string;
  schoolCode: string;
  permissions: PermissionCode[];
}

interface AuthContextValue {
  user: UserSession | null;
  isAuthenticated: boolean;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  hasPermission: (permission: PermissionCode) => boolean;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
}

const defaultUser: UserSession = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'admin@excellence-school.ci',
  firstName: 'Aminata',
  lastName: 'Koné',
  role: UserRole.ADMIN,
  schoolId: '00000000-0000-0000-0000-000000000000',
  schoolName: 'Groupe Scolaire Excellence',
  schoolCode: 'EXC',
  permissions: ROLE_DEFAULT_PERMISSIONS[UserRole.ADMIN] || [],
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(defaultUser);
  const [activeRole, setActiveRoleState] = useState<UserRole>(UserRole.ADMIN);

  const setActiveRole = (newRole: UserRole) => {
    setActiveRoleState(newRole);
    if (user) {
      setUser({
        ...user,
        role: newRole,
        permissions: ROLE_DEFAULT_PERMISSIONS[newRole] || [],
      });
    }
  };

  const hasPermission = (permission: PermissionCode): boolean => {
    if (!user) return false;
    if (user.role === UserRole.ADMIN) return true;
    return user.permissions.includes(permission);
  };

  const login = (email: string, role: UserRole = UserRole.ADMIN) => {
    setUser({
      id: '00000000-0000-0000-0000-000000000001',
      email,
      firstName: 'Utilisateur',
      lastName: 'Connecté',
      role,
      schoolId: '00000000-0000-0000-0000-000000000000',
      schoolName: 'Groupe Scolaire Excellence',
      schoolCode: 'EXC',
      permissions: ROLE_DEFAULT_PERMISSIONS[role] || [],
    });
    setActiveRoleState(role);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        activeRole,
        setActiveRole,
        hasPermission,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
