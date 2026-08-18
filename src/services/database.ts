import type { ClassRoom, Major, Student, AttendanceStatus } from '../types';

const requestJson = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'មិនអាចភ្ជាប់មូលដ្ឋានទិន្នន័យបានទេ។');
  return data as T;
};

export const studentDatabase = {
  list: () => requestJson<Student[]>('/api/students'),
  create: (student: Student) => requestJson<Student>('/api/students', { method: 'POST', body: JSON.stringify(student) }),
  update: (student: Student) => requestJson<Student>('/api/students', { method: 'PUT', body: JSON.stringify(student) }),
  remove: (ids: string[]) => requestJson<{ deleted: number }>(`/api/students?ids=${encodeURIComponent(ids.join(','))}`, { method: 'DELETE' }),
  import: (students: Student[], mode: 'append' | 'replace') => requestJson<Student[]>('/api/students', {
    method: 'POST',
    body: JSON.stringify({ students, mode })
  })
};

export interface SystemSnapshot {
  students: Student[];
  classes: ClassRoom[];
  majors: Major[];
  attendances: Record<string, Record<string, { status: AttendanceStatus; note?: string }>>;
}

export const createSystemBackup = (snapshot: SystemSnapshot) => requestJson<{ id: number; label: string; createdAt: string }>(
  '/api/backups',
  { method: 'POST', body: JSON.stringify({ label: `Manual backup ${new Date().toISOString()}`, snapshot }) }
);
