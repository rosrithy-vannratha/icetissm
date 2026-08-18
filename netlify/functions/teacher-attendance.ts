import type { Config } from '@netlify/functions';
import { asc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { teacherAttendances } from '../../db/schema.js';

const allowedStatuses = new Set(['present', 'permission', 'absent', 'late']);

const cleanRecord = (value: Record<string, unknown>, date: string, recordedBy: string) => {
  const teacherName = typeof value.teacherName === 'string' ? value.teacherName.trim() : '';
  const status = typeof value.status === 'string' ? value.status : '';
  if (!teacherName || !date) throw new Error('Teacher name and attendance date are required.');
  if (!allowedStatuses.has(status)) throw new Error('A valid attendance status is required.');
  return {
    teacherName,
    attendanceDate: date,
    status,
    checkIn: typeof value.checkIn === 'string' ? value.checkIn.trim() : '',
    checkOut: typeof value.checkOut === 'string' ? value.checkOut.trim() : '',
    note: typeof value.note === 'string' ? value.note.trim() : '',
    recordedBy
  };
};

export default async (request: Request) => {
  try {
    if (request.method === 'GET') {
      const date = new URL(request.url).searchParams.get('date')?.trim();
      if (!date) return Response.json({ error: 'Attendance date is required.' }, { status: 400 });
      const rows = await db.select().from(teacherAttendances)
        .where(eq(teacherAttendances.attendanceDate, date))
        .orderBy(asc(teacherAttendances.teacherName));
      return Response.json(rows.map(({ id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...row }) => row));
    }

    if (request.method === 'POST') {
      const body = await request.json() as { date?: string; records?: Record<string, unknown>[]; recordedBy?: string };
      const date = body.date?.trim() || '';
      const recordedBy = body.recordedBy?.trim() || '';
      const records = Array.isArray(body.records) ? body.records.map((record) => cleanRecord(record, date, recordedBy)) : [];
      if (records.length === 0) return Response.json({ error: 'At least one attendance record is required.' }, { status: 400 });

      for (const record of records) {
        await db.insert(teacherAttendances).values(record).onConflictDoUpdate({
          target: [teacherAttendances.teacherName, teacherAttendances.attendanceDate],
          set: { ...record, updatedAt: new Date() }
        });
      }

      const rows = await db.select().from(teacherAttendances)
        .where(eq(teacherAttendances.attendanceDate, date))
        .orderBy(asc(teacherAttendances.teacherName));
      return Response.json(rows.map(({ id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...row }) => row));
    }

    return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, POST' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Teacher attendance request failed.';
    return Response.json({ error: message }, { status: message.includes('required') || message.includes('valid') ? 400 : 500 });
  }
};

export const config: Config = { path: '/api/teacher-attendance' };
