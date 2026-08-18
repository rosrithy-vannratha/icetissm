import type { Config } from '@netlify/functions';
import { asc, eq, inArray } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { studentHistory, students } from '../../db/schema.js';

type StudentInput = typeof students.$inferInsert;

const editableFields = [
  'id', 'studentCode', 'fullNameKhmer', 'fullNameEn', 'chineseName', 'gender', 'dob', 'major',
  'generation', 'yearLevel', 'semester', 'shift', 'classId', 'className', 'avatarUrl',
  'initialKhmer', 'phone', 'parentName', 'parentPhone', 'address'
] as const;

const cleanStudent = (value: Record<string, unknown>): StudentInput => {
  const cleaned = Object.fromEntries(
    editableFields.map((field) => [field, typeof value[field] === 'string' ? value[field].trim() : value[field]])
  ) as StudentInput;

  if (!cleaned.id || !cleaned.studentCode || !cleaned.fullNameKhmer || !cleaned.fullNameEn) {
    throw new Error('Student ID, student code, Khmer name, and English name are required.');
  }
  if (cleaned.gender !== 'M' && cleaned.gender !== 'F') {
    throw new Error('Gender must be M or F.');
  }

  return cleaned;
};

const publicStudent = ({ createdAt: _createdAt, updatedAt: _updatedAt, ...student }: typeof students.$inferSelect) => student;

const errorResponse = (error: unknown) => {
  const message = error instanceof Error ? error.message : 'Database request failed.';
  const status = message.includes('required') || message.includes('must be')
    ? 400
    : message.includes('unique') || message.includes('duplicate')
      ? 409
      : 500;
  return Response.json({ error: message }, { status });
};

export default async (request: Request) => {
  try {
    if (request.method === 'GET') {
      const rows = await db.select().from(students).orderBy(asc(students.fullNameKhmer));
      return Response.json(rows.map(publicStudent));
    }

    if (request.method === 'POST') {
      const body = await request.json() as Record<string, unknown>;

      if (Array.isArray(body.students)) {
        const values = body.students.map((student) => cleanStudent(student as Record<string, unknown>));
        if (values.length === 0) return Response.json([]);

        if (body.mode === 'replace') {
          for (const value of values) {
            const [current] = await db.select().from(students).where(eq(students.studentCode, value.studentCode)).limit(1);
            if (current) {
              await db.insert(studentHistory).values({
                studentId: current.id,
                operation: 'import_update',
                snapshot: current
              });
            }
            await db.insert(students).values(value).onConflictDoUpdate({
              target: students.studentCode,
              set: { ...value, updatedAt: new Date() }
            });
          }
        } else {
          await db.insert(students).values(values).onConflictDoNothing({ target: students.studentCode });
        }

        const rows = await db.select().from(students).orderBy(asc(students.fullNameKhmer));
        return Response.json(rows.map(publicStudent), { status: 201 });
      }

      const value = cleanStudent(body);
      const [created] = await db.insert(students).values(value).returning();
      return Response.json(publicStudent(created), { status: 201 });
    }

    if (request.method === 'PUT') {
      const value = cleanStudent(await request.json() as Record<string, unknown>);
      const [current] = await db.select().from(students).where(eq(students.id, value.id)).limit(1);
      if (!current) return Response.json({ error: 'Student not found.' }, { status: 404 });

      await db.insert(studentHistory).values({ studentId: current.id, operation: 'update', snapshot: current });
      const [updated] = await db.update(students).set({ ...value, updatedAt: new Date() }).where(eq(students.id, value.id)).returning();
      return Response.json(publicStudent(updated));
    }

    if (request.method === 'DELETE') {
      const url = new URL(request.url);
      const ids = (url.searchParams.get('ids') || '').split(',').map((id) => id.trim()).filter(Boolean);
      if (ids.length === 0) return Response.json({ error: 'At least one student ID is required.' }, { status: 400 });

      const existing = await db.select().from(students).where(inArray(students.id, ids));
      if (existing.length > 0) {
        await db.insert(studentHistory).values(
          existing.map((student) => ({ studentId: student.id, operation: 'delete', snapshot: student }))
        );
        await db.delete(students).where(inArray(students.id, ids));
      }
      return Response.json({ deleted: existing.length });
    }

    return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, POST, PUT, DELETE' } });
  } catch (error) {
    return errorResponse(error);
  }
};

export const config: Config = { path: '/api/students' };
