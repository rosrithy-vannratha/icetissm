CREATE TABLE "academic_years" (
	"id" text PRIMARY KEY,
	"name_khmer" text NOT NULL,
	"name_en" text DEFAULT '' NOT NULL,
	"start_date" text DEFAULT '' NOT NULL,
	"end_date" text DEFAULT '' NOT NULL,
	"is_current" boolean DEFAULT false NOT NULL,
	"description" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "generations" (
	"id" text PRIMARY KEY,
	"name_khmer" text NOT NULL,
	"name_en" text DEFAULT '' NOT NULL,
	"start_year" text DEFAULT '' NOT NULL,
	"end_year" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"description" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "semesters" (
	"id" text PRIMARY KEY,
	"name_khmer" text NOT NULL,
	"name_en" text DEFAULT '' NOT NULL,
	"semester_number" integer NOT NULL,
	"is_current" boolean DEFAULT false NOT NULL,
	"description" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teacher_attendances" (
	"id" serial PRIMARY KEY,
	"teacher_name" text NOT NULL,
	"attendance_date" text NOT NULL,
	"status" text NOT NULL,
	"check_in" text DEFAULT '' NOT NULL,
	"check_out" text DEFAULT '' NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"recorded_by" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "year_levels" (
	"id" text PRIMARY KEY,
	"name_khmer" text NOT NULL,
	"name_en" text DEFAULT '' NOT NULL,
	"level_number" integer NOT NULL,
	"description" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "teacher_attendance_name_date_idx" ON "teacher_attendances" ("teacher_name","attendance_date");--> statement-breakpoint
CREATE INDEX "teacher_attendance_date_idx" ON "teacher_attendances" ("attendance_date");
--> statement-breakpoint
INSERT INTO "generations" ("id", "name_khmer", "name_en", "start_year", "end_year", "status", "description") VALUES
('gen-01', 'ជំនាន់ទី ១', 'Generation 1', '2021', '2025', 'graduated', 'ជំនាន់ស្ថាបនិកដំបូងរបស់វិទ្យាស្ថានគរុកោសល្យភាសាចិន'),
('gen-02', 'ជំនាន់ទី ២', 'Generation 2', '2022', '2026', 'active', 'ជំនាន់បញ្ចប់ការសិក្សាឆ្នាំ ២០២៦'),
('gen-03', 'ជំនាន់ទី ៣', 'Generation 3', '2023', '2027', 'active', 'ជំនាន់បច្ចុប្បន្នកំពុងសិក្សាឆ្នាំទី ៤'),
('gen-04', 'ជំនាន់ទី ៤', 'Generation 4', '2024', '2028', 'active', 'ជំនាន់សកម្មកំពុងសិក្សា'),
('gen-05', 'ជំនាន់ទី ៥', 'Generation 5', '2025', '2029', 'upcoming', 'ជំនាន់ថ្មីដែលនឹងត្រូវចូលរៀនវគ្គបន្ទាប់');
--> statement-breakpoint
INSERT INTO "academic_years" ("id", "name_khmer", "name_en", "start_date", "end_date", "is_current", "description") VALUES
('ay-2023', '2023-2024', 'Academic Year 2023-2024', '2023-10-01', '2024-07-31', false, 'ឆ្នាំសិក្សាកន្លងទៅ'),
('ay-2024', '2024-2025', 'Academic Year 2024-2025', '2024-10-01', '2025-07-31', false, 'ឆ្នាំសិក្សាកន្លងទៅ'),
('ay-2025', '2025-2026', 'Academic Year 2025-2026', '2025-10-01', '2026-07-31', false, 'ឆ្នាំសិក្សាកន្លងទៅ'),
('ay-2026', '2026-2027', 'Academic Year 2026-2027', '2026-10-01', '2027-07-31', false, 'ឆ្នាំសិក្សាថ្មីដែលបានកំណត់សម្រាប់វគ្គបន្ទាប់'),
('ay-2027', '2027-2028', 'Academic Year 2027-2028', '2027-10-01', '2028-07-31', false, 'ឆ្នាំសិក្សាគ្រោងទុកបន្ទាប់');
--> statement-breakpoint
INSERT INTO "year_levels" ("id", "name_khmer", "name_en", "level_number", "description") VALUES
('yl-01', 'ឆ្នាំទី ១', 'Year 1 (Freshman)', 1, 'កម្រិតឆ្នាំដំបូង និងមូលដ្ឋានគ្រឹះភាសាចិន'),
('yl-02', 'ឆ្នាំទី ២', 'Year 2 (Sophomore)', 2, 'កម្រិតមធ្យម និងភាសាវិទ្យាចិន'),
('yl-03', 'ឆ្នាំទី ៣', 'Year 3 (Junior)', 3, 'កម្រិតខ្ពស់ និងជំនាញគរុកោសល្យបង្រៀនជាក់ស្តែង'),
('yl-04', 'ឆ្នាំទី ៤', 'Year 4 (Senior)', 4, 'កម្រិតបញ្ចប់ការសិក្សា ចុះកម្មសិក្សា និងសារណា');
--> statement-breakpoint
INSERT INTO "semesters" ("id", "name_khmer", "name_en", "semester_number", "is_current", "description") VALUES
('sem-01', 'ឆមាសទី ១', 'Semester 1', 1, true, 'ឆមាសទី ១ ប្រចាំឆ្នាំសិក្សា'),
('sem-02', 'ឆមាសទី ២', 'Semester 2', 2, false, 'ឆមាសទី ២ ប្រចាំឆ្នាំសិក្សា'),
('sem-03', 'ឆមាសវិស្សមកាល / វគ្គខ្លី', 'Summer / Intensive Term', 3, false, 'វគ្គសិក្សាពង្រឹងសមត្ថភាព ឬវគ្គបំប៉នពិសេស');
