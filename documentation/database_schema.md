# Modélisation de la Base de Données

Ce document résume la modélisation PostgreSQL / Supabase de l'application de gestion scolaire V1.

## Principes Directeurs
1. **Multi-établissement dès la V1** : Chaque entité de données est systématiquement liée à `school_id`.
2. **Historisation absolue** : Un élève ne possède pas directement de `class_id`, mais une relation d'inscription (`enrollments`) pour chaque année scolaire.
3. **Immutabilité financière** :
   - Aucun paiement validé n'est modifié ou supprimé. Seule une annulation contrôlée (`CANCELLED`) avec motif et audit est autorisée.
   - Les montants FCFA sont rigoureusement stockés sous forme de `BIGINT` afin de prévenir tout problème d'arrondi à virgule flottante.
   - La dette de l'élève est enregistrée au moment de l'inscription via `student_fees`, empêchant qu'une modification tarifaire ultérieure altère rétroactivement son solde.
4. **Numérotation atomique des reçus** : Utilisation d'une table de séquence `receipt_sequences` (ex: `ABC-2026-000001`) verrouillée transactionnellement, au lieu d'un `COUNT(*) + 1` non concurrent.

## Liste des 24 Tables
- `schools` : Établissements scolaires (code unique, nom, coordonnées)
- `profiles` : Extension des comptes `auth.users` Supabase
- `roles` : Rôles configurables par école (`ADMIN`, `DIRECTOR`, `ACCOUNTANT`, etc.)
- `permissions` : Permissions unitaires fines (`student.create`, `payment.cancel`, etc.)
- `role_permissions` : Association rôles-permissions
- `user_roles` : Attribution des rôles aux utilisateurs
- `school_years` : Années scolaires (une seule active à la fois)
- `levels` : Niveaux d'enseignement (CI, CP, CE1, 6ème, etc.)
- `teachers` : Fiches internes des enseignants (sans compte en V1)
- `classes` : Classes rattachées à une année scolaire et un niveau
- `subjects` : Matières enseignées
- `students` : Élèves de l'établissement (matricule unique par école)
- `enrollments` : Inscriptions annuelles (élève ↔ classe ↔ année scolaire)
- `fee_types` : Types de frais (Inscription, Scolarité, Autres)
- `fee_structures` : Grille tarifaire par année / niveau / classe
- `student_fees` : Lignes de frais dues par élève pour une inscription
- `payments` : Enregistrement des paiements (espèces V1, validé ou annulé)
- `payment_allocations` : Répartition d'un paiement sur les différents frais dus
- `receipts` : Reçus officiels uniques horodatés
- `receipt_sequences` : Compteurs d'incrémentation sécurisés par année
- `cash_registers` : Sessions de caisse journalière
- `cash_register_closures` : Clôtures de caisse et justification d'écarts
- `notifications` : Notifications internes destinées aux utilisateurs
- `audit_logs` : Journal d'audit traçant toutes les opérations sensibles
