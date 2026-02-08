export const ROLES = {
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  LABORANT: "LABORANT",
};

export const hasRole = (userRole, requiredRole) => {
  return userRole === requiredRole;
};

export const hasAnyRole = (userRole, roles) => {
  return roles.includes(userRole);
};

export const PERMISSIONS = {
  [ROLES.ADMIN]: {
    canManageUsers: true,
    canManagePatients: true,
    canDeletePatients: true,
    canManageTestCategories: true,
    canManageTestPanels: true,
    canCreateTestResults: true,
    canViewTestResults: true,
    canDeleteTestResults: true,
    canViewDashboard: true,
  },

  [ROLES.DOCTOR]: {
    canManageUsers: false,
    canManagePatients: false,
    canDeletePatients: false,
    canManageTestCategories: false,
    canManageTestPanels: false,
    canCreateTestResults: false,
    canViewTestResults: true,
    canDeleteTestResults: false,
    canViewDashboard: true,
  },

  [ROLES.LABORANT]: {
    canManageUsers: false,
    canManagePatients: true,
    canDeletePatients: false,
    canManageTestCategories: false,
    canManageTestPanels: false,
    canCreateTestResults: true,
    canViewTestResults: true,
    canDeleteTestResults: false,
    canViewDashboard: true,
  },
};

export const hasPermission = (userRole, permission) => {
  return PERMISSIONS[userRole]?.[permission] || false;
};
