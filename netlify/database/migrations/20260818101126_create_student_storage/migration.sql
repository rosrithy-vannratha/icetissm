CREATE TABLE "student_history" (
	"id" serial PRIMARY KEY,
	"student_id" text NOT NULL,
	"operation" text NOT NULL,
	"snapshot" jsonb NOT NULL,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" text PRIMARY KEY,
	"student_code" text NOT NULL UNIQUE,
	"full_name_khmer" text NOT NULL,
	"full_name_en" text NOT NULL,
	"chinese_name" text DEFAULT '' NOT NULL,
	"gender" text NOT NULL,
	"dob" text NOT NULL,
	"major" text NOT NULL,
	"generation" text NOT NULL,
	"year_level" text NOT NULL,
	"semester" text NOT NULL,
	"shift" text NOT NULL,
	"class_id" text NOT NULL,
	"class_name" text NOT NULL,
	"avatar_url" text DEFAULT '' NOT NULL,
	"initial_khmer" text DEFAULT '' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"parent_name" text DEFAULT '' NOT NULL,
	"parent_phone" text DEFAULT '' NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_backups" (
	"id" serial PRIMARY KEY,
	"label" text NOT NULL,
	"snapshot" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "student_history_student_id_idx" ON "student_history" ("student_id");--> statement-breakpoint
CREATE INDEX "students_class_id_idx" ON "students" ("class_id");--> statement-breakpoint
CREATE INDEX "students_major_idx" ON "students" ("major");