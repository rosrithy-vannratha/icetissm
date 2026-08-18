import { boolean, index, integer, jsonb, pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

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

export const generations = pgTable('generations', {
  id: text('id').primaryKey(),
  nameKhmer: text('name_khmer').notNull(),
  nameEn: text('name_en').notNull().default(''),
  startYear: text('start_year').notNull().default(''),
  endYear: text('end_year').notNull().default(''),
  status: text('status').notNull().default('active'),
  description: text('description').notNull().default('')
});

export const academicYears = pgTable('academic_years', {
  id: text('id').primaryKey(),
  nameKhmer: text('name_khmer').notNull(),
  nameEn: text('name_en').notNull().default(''),
  startDate: text('start_date').notNull().default(''),
  endDate: text('end_date').notNull().default(''),
  isCurrent: boolean('is_current').notNull().default(false),
  description: text('description').notNull().default('')
});

export const yearLevels = pgTable('year_levels', {
  id: text('id').primaryKey(),
  nameKhmer: text('name_khmer').notNull(),
  nameEn: text('name_en').notNull().default(''),
  levelNumber: integer('level_number').notNull(),
  description: text('description').notNull().default('')
});

export const semesters = pgTable('semesters', {
  id: text('id').primaryKey(),
  nameKhmer: text('name_khmer').notNull(),
  nameEn: text('name_en').notNull().default(''),
  semesterNumber: integer('semester_number').notNull(),
  isCurrent: boolean('is_current').notNull().default(false),
  description: text('description').notNull().default('')
});

export const teacherAttendances = pgTable(
  'teacher_attendances',
  {
    id: serial('id').primaryKey(),
    teacherName: text('teacher_name').notNull(),
    attendanceDate: text('attendance_date').notNull(),
    status: text('status').notNull(),
    checkIn: text('check_in').notNull().default(''),
    checkOut: text('check_out').notNull().default(''),
    note: text('note').notNull().default(''),
    recordedBy: text('recorded_by').notNull().default(''),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    uniqueIndex('teacher_attendance_name_date_idx').on(table.teacherName, table.attendanceDate),
    index('teacher_attendance_date_idx').on(table.attendanceDate)
  ]
);
