/**
 * School Management System - Domain Models & DTO Interfaces
 * Source of truth: Specifications V1 & Database Model
 */

import {
  Gender,
  StudentStatus,
  EnrollmentStatus,
  SchoolYearStatus,
  FeeTypeCode,
  StudentFeeStatus,
  PaymentMethod,
  PaymentStatus,
  CashRegisterStatus,
  NotificationType,
  SupportedLanguage,
} from './enums';

export interface School {
  id: string; // UUID
  name: string;
  code: string;
  logo_url?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  slogan?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string; // UUID = auth.users.id
  school_id: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  is_active: boolean;
  preferred_language: SupportedLanguage;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  school_id: string;
  name: string;
  code: string;
  description?: string | null;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  code: string; // ex: student.create, payment.cancel
  name: string;
  description?: string | null;
  module: string;
  created_at: string;
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  created_at: string;
}

export interface UserRoleAssignment {
  id: string;
  user_id: string;
  role_id: string;
  created_at: string;
}

export interface SchoolYear {
  id: string;
  school_id: string;
  name: string; // Ex: 2026-2027
  start_date: string;
  end_date: string;
  status: SchoolYearStatus;
  is_active: boolean;
  closed_at?: string | null;
  closed_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Level {
  id: string;
  school_id: string;
  name: string;
  code?: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Teacher {
  id: string;
  school_id: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  specialty?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SchoolClass {
  id: string;
  school_id: string;
  school_year_id: string;
  level_id: string;
  name: string;
  room?: string | null;
  capacity: number;
  main_teacher_id?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  school_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  school_id: string;
  matricule: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: Gender;
  phone?: string | null;
  address?: string | null;
  photo_url?: string | null;
  status: StudentStatus;
  archived_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  school_id: string;
  student_id: string;
  school_year_id: string;
  class_id: string;
  enrollment_date: string;
  status: EnrollmentStatus;
  is_repeater: boolean;
  previous_enrollment_id?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface FeeType {
  id: string;
  school_id: string;
  name: string;
  code: FeeTypeCode | string;
  is_active: boolean;
  created_at: string;
}

export interface FeeStructure {
  id: string;
  school_id: string;
  school_year_id: string;
  level_id: string;
  class_id?: string | null;
  fee_type_id: string;
  amount: number; // Stored as BIGINT in database (FCFA)
  is_mandatory: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentFee {
  id: string;
  school_id: string;
  student_id: string;
  enrollment_id: string;
  fee_type_id: string;
  amount_due: number; // BIGINT (FCFA)
  status: StudentFeeStatus;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  school_id: string;
  student_id: string;
  enrollment_id: string;
  amount: number; // BIGINT (FCFA)
  payment_method: PaymentMethod;
  status: PaymentStatus;
  payment_date: string;
  receipt_number: string;
  cash_register_id: string;
  created_by: string;
  cancelled_at?: string | null;
  cancelled_by?: string | null;
  cancellation_reason?: string | null;
  idempotency_key?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentAllocation {
  id: string;
  payment_id: string;
  student_fee_id: string;
  amount: number; // BIGINT (FCFA)
  created_at: string;
}

export interface Receipt {
  id: string;
  school_id: string;
  payment_id: string;
  receipt_number: string;
  pdf_url?: string | null;
  generated_at: string;
  generated_by: string;
  created_at: string;
}

export interface ReceiptSequence {
  id: string;
  school_id: string;
  year: number;
  last_number: number;
  updated_at: string;
}

export interface CashRegister {
  id: string;
  school_id: string;
  opened_by: string;
  opened_at: string;
  closed_by?: string | null;
  closed_at?: string | null;
  status: CashRegisterStatus;
  opening_amount: number; // BIGINT
  closing_amount?: number | null; // BIGINT
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CashRegisterClosure {
  id: string;
  cash_register_id: string;
  closed_by: string;
  expected_amount: number; // BIGINT
  declared_amount: number; // BIGINT
  difference: number; // BIGINT
  notes?: string | null;
  created_at: string;
}

export interface AppNotification {
  id: string;
  school_id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  read_at?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  school_id: string;
  user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  old_values?: Record<string, unknown> | null;
  new_values?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
}

export interface DashboardSummary {
  students: number;
  activeStudents: number;
  classes: number;
  teachers: number;
  paymentsToday: number; // FCFA
  paymentsMonth: number; // FCFA
  expected: number; // FCFA
  paid: number; // FCFA
  remaining: number; // FCFA
  studentsWithDebt: number;
}
