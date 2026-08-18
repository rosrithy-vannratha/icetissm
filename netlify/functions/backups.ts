import type { Config } from '@netlify/functions';
import { desc } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { systemBackups } from '../../db/schema.js';

export default async (request: Request) => {
  try {
    if (request.method === 'GET') {
      const backups = await db
        .select({ id: systemBackups.id, label: systemBackups.label, createdAt: systemBackups.createdAt })
        .from(systemBackups)
        .orderBy(desc(systemBackups.createdAt))
        .limit(20);
      return Response.json(backups);
    }

    if (request.method === 'POST') {
      const body = await request.json() as { label?: string; snapshot?: unknown };
      if (!body.snapshot || typeof body.snapshot !== 'object') {
        return Response.json({ error: 'A system snapshot is required.' }, { status: 400 });
      }

      const [backup] = await db.insert(systemBackups).values({
        label: body.label?.trim() || `System backup ${new Date().toISOString()}`,
        snapshot: body.snapshot
      }).returning({ id: systemBackups.id, label: systemBackups.label, createdAt: systemBackups.createdAt });

      return Response.json(backup, { status: 201 });
    }

    return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, POST' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Backup request failed.';
    return Response.json({ error: message }, { status: 500 });
  }
};

export const config: Config = { path: '/api/backups' };
