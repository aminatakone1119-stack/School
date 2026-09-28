import { z } from 'zod';
import { Gender, StudentStatus, EnrollmentStatus, SchoolYearStatus, PaymentMethod } from '@school-management/types';

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const studentSchema = z.object({
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  matricule: z.string().min(3, 'Le matricule est obligatoire'),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format date requis: AAAA-MM-JJ'),
  gender: z.nativeEnum(Gender),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  photo_url: z.string().url().optional().nullable().or(z.literal('')),
  status: z.nativeEnum(StudentStatus).default(StudentStatus.ACTIVE),
});

export const enrollmentSchema = z.object({
  student_id: z.string().uuid('Identifiant élève invalide'),
  school_year_id: z.string().uuid('Identifiant année scolaire invalide'),
  class_id: z.string().uuid('Identifiant classe invalide'),
  enrollment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format date requis: AAAA-MM-JJ'),
  is_repeater: z.boolean().default(false),
  previous_enrollment_id: z.string().uuid().optional().nullable(),
  status: z.nativeEnum(EnrollmentStatus).default(EnrollmentStatus.ACTIVE),
});

export const paymentSchema = z.object({
  student_id: z.string().uuid('Identifiant élève invalide'),
  enrollment_id: z.string().uuid('Identifiant inscription invalide'),
  cash_register_id: z.string().uuid('Identifiant caisse invalide'),
  amount: z.number().int().positive('Le montant doit être strictement supérieur à 0 FCFA'),
  payment_method: z.nativeEnum(PaymentMethod).default(PaymentMethod.CASH),
  allocations: z.array(
    z.object({
      student_fee_id: z.string().uuid(),
      amount: z.number().int().positive(),
    })
  ).min(1, 'Au moins une allocation de frais est requise'),
  idempotency_key: z.string().optional(),
});

export const paymentCancellationSchema = z.object({
  cancellation_reason: z.string().min(5, 'Le motif d’annulation doit contenir au moins 5 caractères'),
});

export const schoolYearSchema = z.object({
  name: z.string().regex(/^\d{4}-\d{4}$/, 'Format requis: 2026-2027'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.nativeEnum(SchoolYearStatus).default(SchoolYearStatus.PREPARATION),
});

export const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit comporter au moins 6 caractères'),
});
