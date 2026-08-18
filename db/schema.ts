import { index, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const students = pgTable(
  'students',
  {
    id: text('id').primaryKey(),
    studentCode: text('student_code').notNull().unique(),
    fullNameKhmer: text('full_name_khmer').notNull(),
    fullNameEn: text('full_name_en').notNull(),
    chineseName: text('chinese_name').notNull().default(''),
    gender: text('gender').notNull(),
    dob: text('dob').notNull(),
    major: text('major').notNull(),
    generation: text('generation').notNull(),
    yearLevel: text('year_level').notNull(),
    semester: text('semester').notNull(),
    shift: text('shift').notNull(),
    classId: text('class_id').notNull(),
    className: text('class_name').notNull(),
    avatarUrl: text('avatar_url').notNull().default(''),
    initialKhmer: text('initial_khmer').notNull().default(''),
    phone: text('phone').notNull().default(''),
    parentName: text('parent_name').notNull().default(''),
    parentPhone: text('parent_phone').notNull().default(''),
    address: text('address').notNull().default(''),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [index('students_class_id_idx').on(table.classId), index('students_major_idx').on(table.major)]
);

export const studentHistory = pgTable(
  'student_history',
  {
    id: serial('id').primaryKey(),
    studentId: text('student_id').notNull(),
    operation: text('operation').notNull(),
    snapshot: jsonb('snapshot').notNull(),
    changedAt: timestamp('changed_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [index('student_history_student_id_idx').on(table.studentId)]
);

export const systemBackups = pgTable('system_backups', {
  id: serial('id').primaryKey(),
  label: text('label').notNull(),
  snapshot: jsonb('snapshot').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});
