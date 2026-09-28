-- =============================================================================
-- Migration: 001_initial_schema.sql
-- Application: Gestion Scolaire (V1 - Primaire & Collège)
-- Source de vérité: Modélisation de la base de données (Supabase / PostgreSQL)
-- Multi-école (school_id), Devise FCFA (BIGINT), Audit, Reçus uniques
-- =============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE gender_enum AS ENUM ('MALE', 'FEMALE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE student_status_enum AS ENUM ('ACTIVE', 'SUSPENDED', 'LEFT', 'TRANSFERRED', 'DROPOUT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE enrollment_status_enum AS ENUM ('ACTIVE', 'SUSPENDED', 'CANCELLED', 'COMPLETED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE school_year_status_enum AS ENUM ('PREPARATION', 'ACTIVE', 'CLOSED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE student_fee_status_enum AS ENUM ('UNPAID', 'PARTIAL', 'PAID', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_method_enum AS ENUM ('CASH');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_enum AS ENUM ('VALIDATED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE cash_register_status_enum AS ENUM ('OPEN', 'CLOSED', 'REOPENED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE notification_type_enum AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. TABLES

-- Table 1: schools
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  logo_url TEXT,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  slogan VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table 2: profiles (extension de auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY, -- Référence auth.users(id)
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  preferred_language VARCHAR(5) NOT NULL DEFAULT 'fr',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table 3: roles
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) NOT NULL,
  description TEXT,
  is_system BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT uq_roles_school_code UNIQUE (school_id, code)
);

-- Table 4: permissions
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  module VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table 5: role_permissions
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT uq_role_permissions UNIQUE (role_id, permission_id)
);

-- Table 6: user_roles
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT uq_user_roles UNIQUE (user_id, role_id)
);

-- Table 7: school_years
CREATE TABLE IF NOT EXISTS school_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status school_year_status_enum NOT NULL DEFAULT 'PREPARATION',
  is_active BOOLEAN NOT NULL DEFAULT false,
  closed_at TIMESTAMPTZ,
  closed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT uq_school_years_name UNIQUE (school_id, name)
);

-- Table 8: levels
CREATE TABLE IF NOT EXISTS levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50),
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table 9: teachers
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  specialty VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table 10: classes
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  school_year_id UUID NOT NULL REFERENCES school_years(id) ON DELETE RESTRICT,
  level_id UUID NOT NULL REFERENCES levels(id) ON DELETE RESTRICT,
  name VARCHAR(100) NOT NULL,
  room VARCHAR(50),
  capacity INT NOT NULL DEFAULT 40,
  main_teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table 11: subjects
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table 12: students
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  matricule VARCHAR(50) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  birth_date DATE NOT NULL,
  gender gender_enum NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  photo_url TEXT,
  status student_status_enum NOT NULL DEFAULT 'ACTIVE',
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT uq_students_matricule UNIQUE (school_id, matricule)
);

-- Table 13: enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_year_id UUID NOT NULL REFERENCES school_years(id) ON DELETE RESTRICT,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE RESTRICT,
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status enrollment_status_enum NOT NULL DEFAULT 'ACTIVE',
  is_repeater BOOLEAN NOT NULL DEFAULT false,
  previous_enrollment_id UUID REFERENCES enrollments(id) ON DELETE SET NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Contrainte: Une seule inscription active par élève et année scolaire
CREATE UNIQUE INDEX IF NOT EXISTS uq_one_active_enrollment_per_year 
ON enrollments(student_id, school_year_id) 
WHERE status = 'ACTIVE';

-- Table 14: fee_types
CREATE TABLE IF NOT EXISTS fee_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT uq_fee_types_code UNIQUE (school_id, code)
);

-- Table 15: fee_structures (montants en BIGINT FCFA)
CREATE TABLE IF NOT EXISTS fee_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  school_year_id UUID NOT NULL REFERENCES school_years(id) ON DELETE CASCADE,
  level_id UUID NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  fee_type_id UUID NOT NULL REFERENCES fee_types(id) ON DELETE RESTRICT,
  amount BIGINT NOT NULL CHECK (amount >= 0),
  is_mandatory BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table 16: student_fees (montants en BIGINT FCFA)
CREATE TABLE IF NOT EXISTS student_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  fee_type_id UUID NOT NULL REFERENCES fee_types(id) ON DELETE RESTRICT,
  amount_due BIGINT NOT NULL CHECK (amount_due >= 0),
  status student_fee_status_enum NOT NULL DEFAULT 'UNPAID',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table 21: cash_registers (définie avant payments pour la clé étrangère)
CREATE TABLE IF NOT EXISTS cash_registers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  opened_by UUID NOT NULL REFERENCES profiles(id),
  opened_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  closed_by UUID REFERENCES profiles(id),
  closed_at TIMESTAMPTZ,
  status cash_register_status_enum NOT NULL DEFAULT 'OPEN',
  opening_amount BIGINT NOT NULL DEFAULT 0 CHECK (opening_amount >= 0),
  closing_amount BIGINT CHECK (closing_amount >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table 22: cash_register_closures
CREATE TABLE IF NOT EXISTS cash_register_closures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cash_register_id UUID NOT NULL REFERENCES cash_registers(id) ON DELETE CASCADE,
  closed_by UUID NOT NULL REFERENCES profiles(id),
  expected_amount BIGINT NOT NULL,
  declared_amount BIGINT NOT NULL,
  difference BIGINT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table 17: payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE RESTRICT,
  amount BIGINT NOT NULL CHECK (amount > 0),
  payment_method payment_method_enum NOT NULL DEFAULT 'CASH',
  status payment_status_enum NOT NULL DEFAULT 'VALIDATED',
  payment_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  receipt_number VARCHAR(100) NOT NULL UNIQUE,
  cash_register_id UUID NOT NULL REFERENCES cash_registers(id) ON DELETE RESTRICT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES profiles(id),
  cancellation_reason TEXT,
  idempotency_key VARCHAR(100) UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table 18: payment_allocations
CREATE TABLE IF NOT EXISTS payment_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  student_fee_id UUID NOT NULL REFERENCES student_fees(id) ON DELETE RESTRICT,
  amount BIGINT NOT NULL CHECK (amount > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table 19: receipts
CREATE TABLE IF NOT EXISTS receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  receipt_number VARCHAR(100) NOT NULL UNIQUE,
  pdf_url TEXT,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  generated_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table 20: receipt_sequences (évite COUNT(*) + 1 pour la concurrence)
CREATE TABLE IF NOT EXISTS receipt_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  year INT NOT NULL,
  last_number BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT uq_receipt_sequences UNIQUE (school_id, year)
);

-- Table 23: notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type_enum NOT NULL DEFAULT 'INFO',
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Table 24: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  metadata JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 4. INDEXES RECOMMANDEES
CREATE INDEX IF NOT EXISTS idx_students_search 
ON students(school_id, matricule, last_name, first_name, status);

CREATE INDEX IF NOT EXISTS idx_enrollments_lookup 
ON enrollments(student_id, school_year_id, class_id, status);

CREATE INDEX IF NOT EXISTS idx_payments_lookup 
ON payments(school_id, student_id, payment_date, receipt_number, status, cash_register_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_lookup 
ON audit_logs(school_id, user_id, entity_type, entity_id, created_at);

CREATE INDEX IF NOT EXISTS idx_student_fees_enrollment 
ON student_fees(enrollment_id, student_id, status);

-- 5. VUES FINANCIERES
CREATE OR REPLACE VIEW student_financial_summary AS
SELECT 
  s.id AS student_id,
  s.school_id,
  s.matricule,
  s.first_name,
  s.last_name,
  e.id AS current_enrollment_id,
  e.school_year_id,
  e.class_id,
  COALESCE(SUM(sf.amount_due), 0) AS total_due,
  COALESCE(SUM(
    CASE WHEN p.status = 'VALIDATED' THEN pa.amount ELSE 0 END
  ), 0) AS total_paid,
  COALESCE(SUM(sf.amount_due), 0) - COALESCE(SUM(
    CASE WHEN p.status = 'VALIDATED' THEN pa.amount ELSE 0 END
  ), 0) AS remaining
FROM students s
LEFT JOIN enrollments e ON e.student_id = s.id AND e.status = 'ACTIVE'
LEFT JOIN student_fees sf ON sf.enrollment_id = e.id AND sf.status != 'CANCELLED'
LEFT JOIN payment_allocations pa ON pa.student_fee_id = sf.id
LEFT JOIN payments p ON pa.payment_id = p.id
GROUP BY s.id, s.school_id, s.matricule, s.first_name, s.last_name, e.id, e.school_year_id, e.class_id;

-- 6. FONCTION DE GENERATION DE NUMERO DE REÇU
CREATE OR REPLACE FUNCTION generate_receipt_number(p_school_id UUID, p_year INT)
RETURNS TEXT AS $$
DECLARE
  v_school_code TEXT;
  v_next_val BIGINT;
  v_receipt_number TEXT;
BEGIN
  SELECT code INTO v_school_code FROM schools WHERE id = p_school_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'École introuvable';
  END IF;

  INSERT INTO receipt_sequences (school_id, year, last_number, updated_at)
  VALUES (p_school_id, p_year, 1, timezone('utc', now()))
  ON CONFLICT (school_id, year)
  DO UPDATE SET 
    last_number = receipt_sequences.last_number + 1,
    updated_at = timezone('utc', now())
  RETURNING last_number INTO v_next_val;

  -- Format: CODEECOLE-ANNEE-NUMERO (ex: ABC-2026-000001)
  v_receipt_number := v_school_code || '-' || p_year::TEXT || '-' || LPAD(v_next_val::TEXT, 6, '0');
  RETURN v_receipt_number;
END;
$$ LANGUAGE plpgsql;
