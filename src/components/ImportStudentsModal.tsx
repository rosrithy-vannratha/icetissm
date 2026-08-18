import React, { useState, useRef } from 'react';
import { Student, ClassRoom } from '../types';
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
  Users,
  Trash2,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { downloadStudentTemplate, parseStudentsExcelFile } from '../utils/exportUtils';

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassRoom[];
  onImportStudents: (importedStudents: Omit<Student, 'id'>[], mode: 'append' | 'replace') => void;
}

export const ImportStudentsModal: React.FC<ImportStudentsModalProps> = ({
  isOpen,
  onClose,
  classes,
  onImportStudents
}) => {
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'c-12a');
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedStudents, setParsedStudents] = useState<Omit<Student, 'id'>[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  const handleProcessFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsParsing(true);
    setParseErrors([]);
    setParsedStudents([]);

    try {
      const result = await parseStudentsExcelFile(
        selectedFile,
        selectedClassId,
        selectedClass?.nameKhmer || 'ថ្នាក់គរុកោសល្យ ក'
      );
      setParsedStudents(result.students);
      setParseErrors(result.errors);
    } catch (err: any) {
      setParseErrors([err.message || 'កំហុសមិនស្គាល់ក្នុងការអានឯកសារ']);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.name.endsWith('.xlsx') ||
        droppedFile.name.endsWith('.xls') ||
        droppedFile.name.endsWith('.csv')
      ) {
        handleProcessFile(droppedFile);
      } else {
        setParseErrors(['សូមជ្រើសរើសតែឯកសារ Excel (.xlsx, .xls) ឬ CSV (.csv) ប៉ុណ្ណោះ។']);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setFile(null);
    setParsedStudents([]);
    setParseErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmImport = () => {
    if (parsedStudents.length === 0) return;

    // Update class assignment
    const finalStudents = parsedStudents.map((s) => ({
      ...s,
      classId: selectedClassId,
      className: selectedClass?.nameKhmer || s.className
    }));

    onImportStudents(finalStudents, importMode);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    handleClear();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white dark:bg-[#121215] rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative max-h-[92vh] flex flex-col"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => {
            handleClear();
            onClose();
          }}
          className="absolute top-6 right-6 p-2 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-all cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex justify-between items-center pb-5 border-b border-zinc-100 dark:border-zinc-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block">
                EXCEL BATCH IMPORT
              </span>
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">
                នាំចូលបញ្ជីឈ្មោះសិស្សពី Excel / CSV
              </h3>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {/* Action Bar: Download Template & Target Class */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                ថ្នាក់សិក្សាគោលដៅ (Target Class)
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-3.5 py-2 text-xs font-medium text-zinc-900 dark:text-white focus:border-indigo-500 outline-none cursor-pointer"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameKhmer} ({c.academicYear})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <button
                type="button"
                onClick={downloadStudentTemplate}
                className="w-full py-2 px-3.5 bg-white hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>ទាញយកគំរូ Excel (.xlsx) ទាំង ១១ ចំណុច</span>
              </button>
            </div>
          </div>

          {/* Upload Dropzone */}
          {!file && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 scale-[0.99]'
                  : 'border-zinc-300 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-zinc-50/50 dark:bg-zinc-900/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">
                  ចុចទីនេះ ឬអូសទម្លាក់ឯកសារ Excel / CSV មកទីនេះ
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  គាំទ្រឯកសារ .xlsx, .xls, ឬ .csv ដែលមានទិន្នន័យសិស្សទាំង ១១ ចំណុច
                </p>
              </div>
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold rounded-xl border border-indigo-200 dark:border-indigo-800">
                ជ្រើសរើសឯកសារពីកុំព្យូទ័រ
              </span>
            </div>
          )}

          {/* File Selected & Parsing state */}
          {file && (
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <span>{file.name}</span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mt-0.5">
                    {isParsing ? (
                      <span className="text-amber-500 font-medium">កំពុងអានទិន្នន័យ...</span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        អានបាន {parsedStudents.length} នាក់
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                title="ដកឯកសារចេញ"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Errors/Warnings */}
          {parseErrors.length > 0 && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900/50 space-y-1.5">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>ចំណាំ / កំហុសក្នុងការអានឯកសារ ({parseErrors.length})</span>
              </div>
              <div className="text-xs text-rose-700 dark:text-rose-300 space-y-1 pl-6">
                {parseErrors.slice(0, 5).map((err, i) => (
                  <div key={i}>{err}</div>
                ))}
                {parseErrors.length > 5 && (
                  <div className="text-[11px] text-rose-500 italic">
                    ...និង {parseErrors.length - 5} កំហុសផ្សេងទៀត
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Preview Table */}
          {parsedStudents.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                    មើលទិន្នន័យជាមុន (Preview {parsedStudents.length} នាក់)
                  </span>
                </div>

                {/* Import Mode Toggle */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-zinc-500 text-[11px]">របៀបបញ្ចូល:</span>
                  <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700">
                    <button
                      type="button"
                      onClick={() => setImportMode('append')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        importMode === 'append'
                          ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-zinc-400 hover:text-zinc-600'
                      }`}
                    >
                      បន្ថែមថ្មី (Append)
                    </button>
                    <button
                      type="button"
                      onClick={() => setImportMode('replace')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        importMode === 'replace'
                          ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-zinc-400 hover:text-zinc-600'
                      }`}
                      title="ជំនួសទិន្នន័យសិស្សដែលមានអត្តលេខដូចគ្នា"
                    >
                      ជំនួសអត្តលេខដូចគ្នា (Update)
                    </button>
                  </div>
                </div>
              </div>

              <div className="max-h-56 overflow-y-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 bg-zinc-50 dark:bg-zinc-800/90 text-[11px] font-bold uppercase text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-700">
                    <tr>
                      <th className="p-3">ល.រ</th>
                      <th className="p-3">អត្តលេខ</th>
                      <th className="p-3">ឈ្មោះខ្មែរ</th>
                      <th className="p-3">ឈ្មោះចិន</th>
                      <th className="p-3">ភេទ</th>
                      <th className="p-3">ជំនាញ</th>
                      <th className="p-3">ជំនាន់ & ឆ្នាំ</th>
                      <th className="p-3">វេន</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {parsedStudents.map((s, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        <td className="p-3 font-mono text-zinc-400 text-[11px]">#{idx + 1}</td>
                        <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {s.studentCode}
                        </td>
                        <td className="p-3 font-bold text-zinc-900 dark:text-zinc-100">
                          {s.fullNameKhmer}
                        </td>
                        <td className="p-3 font-sans font-bold text-rose-600 dark:text-rose-400">
                          {s.chineseName || '—'}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              s.gender === 'M'
                                ? 'bg-blue-500/10 text-blue-500'
                                : 'bg-pink-500/10 text-pink-500'
                            }`}
                          >
                            {s.gender === 'M' ? 'ប្រុស' : 'ស្រី'}
                          </span>
                        </td>
                        <td className="p-3 text-[11px] text-zinc-600 dark:text-zinc-300">
                          {s.major}
                        </td>
                        <td className="p-3 text-[11px] text-zinc-500">
                          {s.generation} · {s.yearLevel}
                        </td>
                        <td className="p-3 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          {s.shift}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-5 border-t border-zinc-100 dark:border-zinc-800 mt-4">
          <div className="text-xs text-zinc-400">
            {parsedStudents.length > 0 && (
              <span>
                ត្រៀមនាំចូល: <strong className="text-zinc-800 dark:text-zinc-200">{parsedStudents.length}</strong> នាក់
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                handleClear();
                onClose();
              }}
              className="px-5 py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
            >
              បោះបង់
            </button>
            <button
              type="button"
              disabled={parsedStudents.length === 0 || isParsing}
              onClick={handleConfirmImport}
              className={`px-6 py-2.5 rounded-2xl text-xs font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                parsedStudents.length === 0 || isParsing
                  ? 'bg-zinc-300 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/25 active:scale-95'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>បញ្ជាក់ការនាំចូល ({parsedStudents.length})</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
