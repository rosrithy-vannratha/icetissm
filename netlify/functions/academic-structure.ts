import type { Config } from '@netlify/functions';
import { asc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { academicYears, generations, semesters, yearLevels } from '../../db/schema.js';

type ResourceName = 'generations' | 'academicYears' | 'yearLevels' | 'semesters';

const getResourceName = (name: string | null): ResourceName => {
  if (name === 'generations' || name === 'academicYears' || name === 'yearLevels' || name === 'semesters') return name;
  throw new Error('A valid academic resource is required.');
};

const cleanItem = (value: unknown) => {
  if (!value || typeof value !== 'object') throw new Error('Academic item is required.');
  const item = value as Record<string, unknown>;
  if (typeof item.id !== 'string' || !item.id.trim() || typeof item.nameKhmer !== 'string' || !item.nameKhmer.trim()) {
    throw new Error('Academic item ID and Khmer name are required.');
  }
  return Object.fromEntries(Object.entries(item).map(([key, entry]) => [key, typeof entry === 'string' ? entry.trim() : entry]));
};

const errorResponse = (error: unknown) => {
  const message = error instanceof Error ? error.message : 'Academic database request failed.';
  return Response.json({ error: message }, { status: message.includes('required') || message.includes('valid') ? 400 : 500 });
};

export default async (request: Request) => {
  try {
    if (request.method === 'GET') {
      const [generationRows, academicYearRows, yearLevelRows, semesterRows] = await Promise.all([
        db.select().from(generations).orderBy(asc(generations.startYear)),
        db.select().from(academicYears).orderBy(asc(academicYears.startDate)),
        db.select().from(yearLevels).orderBy(asc(yearLevels.levelNumber)),
        db.select().from(semesters).orderBy(asc(semesters.semesterNumber))
      ]);
      return Response.json({
        generations: generationRows,
        academicYears: academicYearRows,
        yearLevels: yearLevelRows,
        semesters: semesterRows
      });
    }

    if (request.method === 'POST' || request.method === 'PUT') {
      const body = await request.json() as { resource?: string; item?: unknown };
      const resource = getResourceName(body.resource || null);
      const item = cleanItem(body.item);
      const id = item.id as string;

      if (resource === 'generations') {
        if (request.method === 'POST') {
          const [created] = await db.insert(generations).values(item as typeof generations.$inferInsert).returning();
          return Response.json(created, { status: 201 });
        }
        const [updated] = await db.update(generations).set(item as Partial<typeof generations.$inferInsert>).where(eq(generations.id, id)).returning();
        return updated ? Response.json(updated) : Response.json({ error: 'Academic item not found.' }, { status: 404 });
      }
      if (resource === 'academicYears') {
        if (request.method === 'POST') {
          const [created] = await db.insert(academicYears).values(item as typeof academicYears.$inferInsert).returning();
          return Response.json(created, { status: 201 });
        }
        const [updated] = await db.update(academicYears).set(item as Partial<typeof academicYears.$inferInsert>).where(eq(academicYears.id, id)).returning();
        return updated ? Response.json(updated) : Response.json({ error: 'Academic item not found.' }, { status: 404 });
      }
      if (resource === 'yearLevels') {
        if (request.method === 'POST') {
          const [created] = await db.insert(yearLevels).values(item as typeof yearLevels.$inferInsert).returning();
          return Response.json(created, { status: 201 });
        }
        const [updated] = await db.update(yearLevels).set(item as Partial<typeof yearLevels.$inferInsert>).where(eq(yearLevels.id, id)).returning();
        return updated ? Response.json(updated) : Response.json({ error: 'Academic item not found.' }, { status: 404 });
      }
      if (request.method === 'POST') {
        const [created] = await db.insert(semesters).values(item as typeof semesters.$inferInsert).returning();
        return Response.json(created, { status: 201 });
      }
      const [updated] = await db.update(semesters).set(item as Partial<typeof semesters.$inferInsert>).where(eq(semesters.id, id)).returning();
      return updated ? Response.json(updated) : Response.json({ error: 'Academic item not found.' }, { status: 404 });
    }

    if (request.method === 'DELETE') {
      const url = new URL(request.url);
      const resource = getResourceName(url.searchParams.get('resource'));
      const id = url.searchParams.get('id')?.trim();
      if (!id) throw new Error('Academic item ID is required.');
      const deleted = resource === 'generations'
        ? await db.delete(generations).where(eq(generations.id, id)).returning({ id: generations.id })
        : resource === 'academicYears'
          ? await db.delete(academicYears).where(eq(academicYears.id, id)).returning({ id: academicYears.id })
          : resource === 'yearLevels'
            ? await db.delete(yearLevels).where(eq(yearLevels.id, id)).returning({ id: yearLevels.id })
            : await db.delete(semesters).where(eq(semesters.id, id)).returning({ id: semesters.id });
      return Response.json({ deleted: deleted.length });
    }

    return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, POST, PUT, DELETE' } });
  } catch (error) {
    return errorResponse(error);
  }
};

export const config: Config = { path: '/api/academic-structure' };
