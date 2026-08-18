import type {
  AcademicYear,
  AttendanceStatus,
  ClassRoom,
  Generation,
  Major,
  Semester,
  Student,
  TeacherAttendanceRecord,
  YearLevel
} from '../types';

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

export type AcademicResource = 'generations' | 'academicYears' | 'yearLevels' | 'semesters';
export type AcademicItem = Generation | AcademicYear | YearLevel | Semester;

export interface AcademicStructureData {
  generations: Generation[];
  academicYears: AcademicYear[];
  yearLevels: YearLevel[];
  semesters: Semester[];
}

export const academicDatabase = {
  list: () => requestJson<AcademicStructureData>('/api/academic-structure'),
  create: <T extends AcademicItem>(resource: AcademicResource, item: T) => requestJson<T>('/api/academic-structure', {
    method: 'POST',
    body: JSON.stringify({ resource, item })
  }),
  update: <T extends AcademicItem>(resource: AcademicResource, item: T) => requestJson<T>('/api/academic-structure', {
    method: 'PUT',
    body: JSON.stringify({ resource, item })
  }),
  remove: (resource: AcademicResource, id: string) => requestJson<{ deleted: number }>(
    `/api/academic-structure?resource=${resource}&id=${encodeURIComponent(id)}`,
    { method: 'DELETE' }
  )
};

export const teacherAttendanceDatabase = {
  list: (date: string) => requestJson<TeacherAttendanceRecord[]>(`/api/teacher-attendance?date=${encodeURIComponent(date)}`),
  save: (date: string, records: TeacherAttendanceRecord[]) => requestJson<TeacherAttendanceRecord[]>('/api/teacher-attendance', {
    method: 'POST',
    body: JSON.stringify({ date, records, recordedBy: records[0]?.recordedBy || '' })
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
