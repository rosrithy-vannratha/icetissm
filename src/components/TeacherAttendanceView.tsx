import React, { useEffect, useMemo, useState } from 'react';
import { Check, Clock3, Save, UserCheck, UsersRound } from 'lucide-react';
import type { AttendanceStatus, ClassRoom, TeacherAttendanceRecord } from '../types';
import { teacherAttendanceDatabase } from '../services/database';

interface TeacherAttendanceViewProps {
  classes: ClassRoom[];
  recordedBy: string;
}

const statusOptions: Array<{ value: AttendanceStatus; label: string; activeClass: string }> = [
  { value: 'present', label: 'វត្តមាន', activeClass: 'bg-emerald-600 text-white border-emerald-600' },
  { value: 'late', label: 'មកយឺត', activeClass: 'bg-amber-500 text-white border-amber-500' },
  { value: 'permission', label: 'សុំច្បាប់', activeClass: 'bg-sky-600 text-white border-sky-600' },
  { value: 'absent', label: 'អវត្តមាន', activeClass: 'bg-rose-600 text-white border-rose-600' }
];

const today = () => new Date().toISOString().slice(0, 10);

export const TeacherAttendanceView: React.FC<TeacherAttendanceViewProps> = ({ classes, recordedBy }) => {
  const [selectedDate, setSelectedDate] = useState(today);
  const [records, setRecords] = useState<Record<string, TeacherAttendanceRecord>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const teachers = useMemo(() => {
    const teacherClasses = new Map<string, string[]>();
    classes.forEach((classroom) => {
      const teacherName = classroom.teacherName.trim();
      if (!teacherName) return;
      teacherClasses.set(teacherName, [...(teacherClasses.get(teacherName) || []), classroom.nameKhmer]);
    });
    return Array.from(teacherClasses, ([name, assignedClasses]) => ({ name, assignedClasses }));
  }, [classes]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setMessage('');
    teacherAttendanceDatabase.list(selectedDate)
      .then((storedRecords) => {
        if (cancelled) return;
        const storedMap = Object.fromEntries(storedRecords.map((record) => [record.teacherName, record]));
        const nextRecords = Object.fromEntries(teachers.map(({ name }) => [name, storedMap[name] || {
          teacherName: name,
          attendanceDate: selectedDate,
          status: 'present' as AttendanceStatus,
          checkIn: '07:30',
          checkOut: '',
          note: '',
          recordedBy
        }]));
        setRecords(nextRecords);
      })
      .catch((error) => {
        if (!cancelled) setMessage(error instanceof Error ? error.message : 'មិនអាចទាញវត្តមានគ្រូបានទេ។');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedDate, teachers, recordedBy]);

  const updateRecord = (teacherName: string, patch: Partial<TeacherAttendanceRecord>) => {
    setRecords((current) => ({
      ...current,
      [teacherName]: { ...current[teacherName], ...patch, teacherName, attendanceDate: selectedDate, recordedBy }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const saved = await teacherAttendanceDatabase.save(selectedDate, Object.keys(records).map((teacherName) => ({ ...records[teacherName], recordedBy })));
      setRecords(Object.fromEntries(saved.map((record) => [record.teacherName, record])));
      setMessage('បានរក្សាទុកវត្តមានគ្រូបង្រៀនរួចរាល់។');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'មិនអាចរក្សាទុកវត្តមានគ្រូបានទេ។');
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.keys(records).filter((teacherName) => records[teacherName].status === 'present').length;

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-7">
        <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
              <UsersRound className="h-4 w-4" /> Teacher Attendance
            </div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">វត្តមានគ្រូបង្រៀន</h2>
            <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">កត់ត្រាស្ថានភាព ម៉ោងចូល ម៉ោងចេញ និងកំណត់ចំណាំប្រចាំថ្ងៃសម្រាប់គ្រូទាំងអស់។</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">គ្រូសរុប</p>
              <p className="mt-1 text-xl font-black text-zinc-900 dark:text-white">{teachers.length}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900/60 dark:bg-emerald-950/30">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">មានវត្តមាន</p>
              <p className="mt-1 text-xl font-black text-emerald-700 dark:text-emerald-400">{presentCount}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-3 text-sm font-bold text-zinc-700 dark:text-zinc-200">
            <Clock3 className="h-4 w-4 text-emerald-600" /> កាលបរិច្ឆេទ
            <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-zinc-700 dark:bg-zinc-900" />
          </label>
          {message && <p className={`text-xs font-semibold ${message.includes('រួចរាល់') ? 'text-emerald-600' : 'text-rose-600'}`}>{message}</p>}
        </div>

        {loading ? (
          <div className="space-y-3">{[1, 2, 3].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />)}</div>
        ) : teachers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
            <UserCheck className="mx-auto h-9 w-9 text-zinc-300" />
            <p className="mt-3 text-sm font-bold text-zinc-700 dark:text-zinc-200">មិនទាន់មានគ្រូក្នុងថ្នាក់រៀន</p>
            <p className="mt-1 text-xs text-zinc-400">បន្ថែមឈ្មោះគ្រូបន្ទុកក្នុងផ្ទាំងថ្នាក់រៀនជាមុនសិន។</p>
          </div>
        ) : (
          <div className="space-y-3">
            {teachers.map((teacher) => {
              const record = records[teacher.name];
              return (
                <article key={teacher.name} className="grid gap-4 rounded-2xl border border-zinc-200/80 p-4 dark:border-zinc-800 lg:grid-cols-[minmax(190px,1.1fr)_minmax(300px,1.5fr)_190px_minmax(180px,1fr)] lg:items-center">
                  <div>
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white">{teacher.name}</h3>
                    <p className="mt-1 text-[11px] text-zinc-400">{teacher.assignedClasses.join(' · ')}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {statusOptions.map((option) => (
                      <button key={option.value} type="button" onClick={() => updateRecord(teacher.name, { status: option.value })} className={`rounded-xl border px-3 py-2 text-[11px] font-bold transition ${record?.status === option.value ? option.activeClass : 'border-zinc-200 bg-zinc-50 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400'}`}>
                        {record?.status === option.value && <Check className="mr-1 inline h-3 w-3" />}{option.label}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-[10px] font-bold text-zinc-400">ចូល<input type="time" value={record?.checkIn || ''} onChange={(event) => updateRecord(teacher.name, { checkIn: event.target.value })} className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-2 py-2 font-mono text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200" /></label>
                    <label className="text-[10px] font-bold text-zinc-400">ចេញ<input type="time" value={record?.checkOut || ''} onChange={(event) => updateRecord(teacher.name, { checkOut: event.target.value })} className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-2 py-2 font-mono text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200" /></label>
                  </div>
                  <input type="text" value={record?.note || ''} onChange={(event) => updateRecord(teacher.name, { note: event.target.value })} placeholder="កំណត់ចំណាំ..." className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                </article>
              );
            })}
          </div>
        )}

        {teachers.length > 0 && !loading && (
          <div className="mt-5 flex justify-end">
            <button type="button" disabled={saving} onClick={handleSave} className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/15 transition hover:bg-emerald-500 disabled:cursor-wait disabled:opacity-60">
              <Save className="h-4 w-4" /> {saving ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកវត្តមានគ្រូ'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
