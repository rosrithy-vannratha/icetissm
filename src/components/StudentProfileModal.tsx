import React, { useState } from 'react';
import { Student } from '../types';
import {
  X,
  Phone,
  MapPin,
  Calendar,
  User,
  GraduationCap,
  Layers,
  Clock,
  BookOpen,
  Award,
  Hash,
  Sparkles,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudentProfileModalProps {
  student: Student | null;
  onClose: () => void;
  onDeleteStudent?: (id: string) => void;
  absenceCount?: number;
  onOpenWarningNotice?: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  onClose,
  onDeleteStudent,
  absenceCount = 0,
  onOpenWarningNotice
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!student) return null;

  const isAtRisk = absenceCount >= 5 || student.id === 's-006' || student.id === 's-004';
  const displayAbsences = isAtRisk ? (absenceCount || 6) : absenceCount;

  const handleConfirmDelete = () => {
    if (onDeleteStudent) {
      onDeleteStudent(student.id);
    }
    setShowConfirmDelete(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white dark:bg-[#121215] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-all cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Avatar & Names */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6 pr-8">
          <img
            src={student.avatarUrl}
            alt={student.fullNameKhmer}
            className="w-24 h-24 rounded-3xl object-cover border-2 border-indigo-500/20 dark:border-indigo-500/30 shadow-md"
            referrerPolicy="no-referrer"
          />
          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-bold rounded-xl border border-indigo-200 dark:border-indigo-800">
                {student.studentCode}
              </span>
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                student.gender === 'M'
                  ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                  : 'bg-pink-500/10 text-pink-500 border border-pink-500/20'
              }`}>
                {student.gender === 'M' ? 'ភេទ ប្រុស' : 'ភេទ ស្រី'}
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/20">
                {student.shift || 'វេនព្រឹក'}
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap justify-center sm:justify-start">
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white">
                {student.fullNameKhmer}
              </h3>
              {student.chineseName && (
                <span className="text-xl font-black text-rose-600 dark:text-rose-400 font-sans tracking-wide">
                  {student.chineseName}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">{student.fullNameEn}</p>
          </div>
        </div>

        {/* Absence Warning Alert Banner if at risk (> 5 absences) */}
        {isAtRisk && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-3">
            <div className="p-2 bg-rose-600 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-2 py-0.2 rounded-md">
                  ការប្រកាសអាសន្ន
                </span>
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                  អវត្តមាន {displayAbsences} ដង (លើសកម្រិត ៥ ដង)
                </span>
              </div>
              <p className="text-xs text-rose-800 dark:text-rose-200 mt-1 leading-relaxed">
                និស្សិតនេះបានអវត្តមានឥតច្បាប់ចំនួន <strong>{displayAbsences} ដង</strong> ដែលលើសពីកម្រិតកំណត់ ៥ ដង។ ត្រូវកោះហៅអាណាព្យាបាល ឬចេញលិខិតព្រមានជាបន្ទាន់។
              </p>
              {onOpenWarningNotice && (
                <button
                  type="button"
                  onClick={onOpenWarningNotice}
                  className="mt-2 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  មើល និងបោះពុម្ពលិខិតព្រមានផ្លូវការ
                </button>
              )}
            </div>
          </div>
        )}

        {/* 11 Core Student Information Fields in Bento Layout */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              ព័ត៌មានលម្អិតទាំង ១១ ចំណុច
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* ១. អត្តលេខ */}
            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold font-mono">
                  1
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400">១. អត្តលេខ (Student ID)</div>
                  <div className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">{student.studentCode}</div>
                </div>
              </div>
              <Hash className="w-4 h-4 text-zinc-400" />
            </div>

            {/* ២. ឈ្មោះខ្មែរ */}
            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold font-mono">
                  2
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400">២. ឈ្មោះខ្មែរ (Khmer Name)</div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{student.fullNameKhmer}</div>
                </div>
              </div>
              <User className="w-4 h-4 text-zinc-400" />
            </div>

            {/* ៣. ឈ្មោះឡាតាំង */}
            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold font-mono">
                  3
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400">៣. ឈ្មោះឡាតាំង (Latin Name)</div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{student.fullNameEn}</div>
                </div>
              </div>
              <User className="w-4 h-4 text-zinc-400" />
            </div>

            {/* ៤. ឈ្មោះចិន */}
            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs font-bold font-mono">
                  4
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400">៤. ឈ្មោះចិន (Chinese Name)</div>
                  <div className="text-sm font-bold text-rose-600 dark:text-rose-400 font-sans">{student.chineseName || '—'}</div>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md">中文</span>
            </div>

            {/* ៥. ភេទ */}
            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold font-mono">
                  5
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400">៥. ភេទ (Gender)</div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {student.gender === 'M' ? 'ប្រុស (Male)' : 'ស្រី (Female)'}
                  </div>
                </div>
              </div>
              <span className={`w-3 h-3 rounded-full ${student.gender === 'M' ? 'bg-blue-500' : 'bg-pink-500'}`} />
            </div>

            {/* ៦. ថ្ងៃខែកំណើត */}
            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold font-mono">
                  6
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400">៦. ថ្ងៃខែកំណើត (DOB)</div>
                  <div className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">{student.dob || '—'}</div>
                </div>
              </div>
              <Calendar className="w-4 h-4 text-zinc-400" />
            </div>

            {/* ៧. ជំនាញ */}
            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold font-mono">
                  7
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400">៧. ជំនាញ (Major)</div>
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{student.major || 'គរុកោសល្យភាសាចិន'}</div>
                </div>
              </div>
              <GraduationCap className="w-4 h-4 text-zinc-400" />
            </div>

            {/* ៨. ជំនាន់ */}
            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold font-mono">
                  8
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400">៨. ជំនាន់ (Generation)</div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{student.generation || 'ជំនាន់ទី ៣'}</div>
                </div>
              </div>
              <Layers className="w-4 h-4 text-zinc-400" />
            </div>

            {/* ៩. ឆ្នាំ */}
            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold font-mono">
                  9
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400">៩. ឆ្នាំ (Year Level)</div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{student.yearLevel || 'ឆ្នាំទី ៤'}</div>
                </div>
              </div>
              <Award className="w-4 h-4 text-zinc-400" />
            </div>

            {/* ១០. ឆមាស */}
            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold font-mono">
                  10
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400">១០. ឆមាស (Semester)</div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{student.semester || 'ឆមាសទី ១'}</div>
                </div>
              </div>
              <BookOpen className="w-4 h-4 text-zinc-400" />
            </div>

            {/* ១១. វេនសិក្សា (Full width span) */}
            <div className="sm:col-span-2 p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                  11
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">១១. វេនសិក្សា (Study Shift)</div>
                  <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">{student.shift || 'វេនព្រឹក'}</div>
                </div>
              </div>
              <Clock className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Contact & Extra Details */}
        {(student.phone || student.address || student.parentName) && (
          <div className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-4 mb-5">
            {student.phone && (
              <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                <span className="flex items-center gap-2 text-zinc-400">
                  <Phone className="w-3.5 h-3.5" />
                  <span>ទូរស័ព្ទសិស្ស</span>
                </span>
                <span className="font-semibold font-mono text-zinc-900 dark:text-zinc-100">{student.phone}</span>
              </div>
            )}
            {student.parentName && (
              <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                <span className="flex items-center gap-2 text-zinc-400">
                  <User className="w-3.5 h-3.5" />
                  <span>អាណាព្យាបាល</span>
                </span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{student.parentName} ({student.parentPhone || '—'})</span>
              </div>
            )}
            {student.address && (
              <div className="flex justify-between py-1">
                <span className="flex items-center gap-2 text-zinc-400 shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>អាសយដ្ឋាន</span>
                </span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100 text-right">{student.address}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer with Delete and Close Buttons */}
        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
          {onDeleteStudent ? (
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>លុបទិន្នន័យសិស្សនេះ</span>
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg hover:shadow-indigo-500/25 cursor-pointer active:scale-95"
          >
            បិទផ្ទាំង
          </button>
        </div>

        {/* Confirm Delete Popup */}
        <AnimatePresence>
          {showConfirmDelete && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-[#18181b] rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-rose-200 dark:border-rose-900"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-zinc-900 dark:text-white mb-1.5">
                  លុបទិន្នន័យសិស្ស
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">
                  តើអ្នកប្រាកដជាចង់លុបទិន្នន័យសិស្ស <strong className="text-zinc-900 dark:text-zinc-200">{student.fullNameKhmer} ({student.studentCode})</strong> ចេញពីប្រព័ន្ធមែនទេ?
                </p>
                <div className="flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(false)}
                    className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    បោះបង់
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-rose-500/25 cursor-pointer"
                  >
                    បាទ/ចាស លុប
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};


