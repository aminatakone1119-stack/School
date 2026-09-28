/**
 * System Constants
 * Source of truth: Functional & Technical Specs V1
 */

export const APP_NAME = 'EduManage';
export const API_PREFIX = '/api/v1';
export const DEFAULT_PAGE_SIZE = 20;

export const DEFAULT_PERMISSIONS = [
  // Students
  'student.read',
  'student.create',
  'student.update',
  'student.archive',
  // Enrollments
  'enrollment.read',
  'enrollment.create',
  'enrollment.update',
  // Payments
  'payment.read',
  'payment.create',
  'payment.cancel',
  // Cashbox
  'cashbox.read',
  'cashbox.close',
  'cashbox.reopen',
  // School Years
  'school_year.create',
  'school_year.close',
  'school_year.reopen',
  // Users
  'user.read',
  'user.create',
  'user.update',
  'user.disable',
  // Roles & Audit
  'role.manage',
  'audit.read',
  // Reports
  'report.financial.read',
] as const;

export type PermissionCode = typeof DEFAULT_PERMISSIONS[number];

export const ROLE_DEFAULT_PERMISSIONS: Record<string, PermissionCode[]> = {
  ADMIN: [...DEFAULT_PERMISSIONS],
  DIRECTOR: [
    'student.read',
    'student.create',
    'student.update',
    'enrollment.read',
    'enrollment.create',
    'enrollment.update',
    'payment.read',
    'cashbox.read',
    'school_year.create',
    'school_year.close',
    'school_year.reopen',
    'user.read',
    'audit.read',
    'report.financial.read',
  ],
  ACCOUNTANT: [
    'student.read',
    'enrollment.read',
    'payment.read',
    'payment.create',
    'payment.cancel',
    'cashbox.read',
    'cashbox.close',
    'report.financial.read',
  ],
};

export const RECEIPT_NUMBER_REGEX = /^[A-Z0-9]{2,10}-\d{4}-\d{6}$/;
export const MATRICULE_REGEX = /^[A-Z0-9]{2,10}-\d{4}-\d{4,6}$/;
