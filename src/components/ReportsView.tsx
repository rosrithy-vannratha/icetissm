import React, { useState, useMemo } from 'react';
import { Student, ClassRoom, StudentReportSummary } from '../types';
import { MONTHLY_TREND_DATA } from '../data/mockData';
import { exportReportsToExcel, exportReportsToCSV } from '../utils/exportUtils';
import {
  Calendar,
  Download,
  FileSpreadsheet,
  TrendingUp,
  UserX,
  Search,
  MoreVertical,
  Printer,
  ChevronDown,
  Sparkles,
  BarChart,
  Eye
} from 'lucide-react';
import { motion } from 'motion/react';

interface ReportsViewProps {
  students: Student[];
  classes: ClassRoom[];
  onOpenStudentModal?: (student: Student) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  students,
  classes,
  onOpenStudentModal
}) => {
  const [fromDate, setFromDate] = useState('2023-10-01');
  const [toDate, setToDate] = useState('2023-10-31');
  const [selectedClass, setSelectedClass] = useState('all');
  const [studentSearch, setStudentSearch] = useState('');
  const [activeMonthHover, setActiveMonthHover] = useState<number | null>(null);

  // Generate realistic student attendance summary reports based on screenshot 1
  const reportData: StudentReportSummary[] = useMemo(() => {
    // Exact seed data mapping from screenshot 1 for first 5 records:
    // STU-001 (សុខ សាន្ត, 10A, 20, 0, 2 -> 95%)
    // STU-002 (ចាន់ មករា, 10A, 18, 2, 2 -> 85%)
    // STU-003 (រ័ត្ន ធីតា, 10B, 22, 0, 0 -> 100%)
    // STU-004 (ពេជ្រ សំណាង, 11A, 15, 5, 2 -> 75%)
    // STU-005 (លី ហួរ, 12A, 21, 1, 0 -> 98%)
    const presets: Record<
      string,
      { code: string; classTag: string; present: number; absent: number; leave: number; rate: number }
    > = {
      's-001': { code: 'STU-001', classTag: '10A', present: 20, absent: 0, leave: 2, rate: 95 },
      's-004': { code: 'STU-002', classTag: '10A', present: 18, absent: 2, leave: 2, rate: 85 },
      's-005': { code: 'STU-003', classTag: '10B', present: 22, absent: 0, leave: 0, rate: 100 },
      's-006': { code: 'STU-004', classTag: '11A', present: 15, absent: 5, leave: 2, rate: 75 },
      's-007': { code: 'STU-005', classTag: '12A', present: 21, absent: 1, leave: 0, rate: 98 },
      's-002': { code: 'STU-006', classTag: '12A', present: 20, absent: 1, leave: 1, rate: 91 },
      's-003': { code: 'STU-007', classTag: '12A', present: 22, absent: 0, leave: 0, rate: 100 },
      's-008': { code: 'STU-008', classTag: '12A', present: 19, absent: 2, leave: 1, rate: 86 }
    };

    return students.map((s, idx) => {
      const preset = presets[s.id] || {
        code: `STU-${String(idx + 1).padStart(3, '0')}`,
        classTag: s.className.replace('ថ្នាក់ទី ', ''),
        present: 20 + (idx % 3),
        absent: idx % 4 === 0 ? 2 : 0,
        leave: idx % 3 === 0 ? 1 : 0,
        rate: 92
      };

      const totalDays = preset.present + preset.absent + preset.leave;
      const calcRate = totalDays > 0 ? Math.round((preset.present / totalDays) * 100) : preset.rate;

      return {
        student: {
          ...s,
          studentCode: preset.code,
          className: preset.classTag
        },
        presentCount: preset.present,
        absentCount: preset.absent,
        permissionCount: preset.leave,
        lateCount: idx % 2 === 0 ? 1 : 0,
        totalDays: 22,
        ratePercentage: preset.rate || calcRate
      };
    });
  }, [students]);

  // Filtered dataset
  const filteredReports = useMemo(() => {
    return reportData.filter((r) => {
      const matchesSearch =
        r.student.fullNameKhmer.toLowerCase().includes(studentSearch.toLowerCase()) ||
        r.student.studentCode.toLowerCase().includes(studentSearch.toLowerCase()) ||
        r.student.fullNameEn.toLowerCase().includes(studentSearch.toLowerCase());

      const matchesClass =
        selectedClass === 'all' ||
        r.student.className.toLowerCase().includes(selectedClass.toLowerCase()) ||
        (selectedClass === '10A' && r.student.className.includes('10A')) ||
        (selectedClass === '10B' && r.student.className.includes('10B')) ||
        (selectedClass === '11A' && r.student.className.includes('11A')) ||
        (selectedClass === '12A' && r.student.className.includes('12A'));

      return matchesSearch && matchesClass;
    });
  }, [reportData, studentSearch, selectedClass]);

  const handleExportExcel = () => {
    exportReportsToExcel(filteredReports, {
      fromDate,
      toDate,
      className: selectedClass === 'all' ? 'គ្រប់ថ្នាក់ទាំងអស់' : `ថ្នាក់_${selectedClass}`
    });
  };

  const handleExportCSV = () => {
    exportReportsToCSV(filteredReports, {
      fromDate,
      toDate,
      className: selectedClass === 'all' ? 'គ្រប់ថ្នាក់ទាំងអស់' : `ថ្នាក់_${selectedClass}`
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Color generator for avatar initials matching the mockup
  const getAvatarBadgeClass = (index: number) => {
    const classes = [
      'bg-[#dde1ff] text-[#00288e]', // Primary tint
      'bg-[#86f2e4] text-[#006a61]', // Secondary tint
      'bg-[#ffdbce] text-[#611e00]', // Tertiary tint
      'bg-[#dde1ff] text-[#00288e]',
      'bg-[#86f2e4] text-[#006a61]'
    ];
    return classes[index % classes.length];
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1440px] mx-auto pb-16">
      {/* Page Header & Actions Bento */}
      <div className="bg-white dark:bg-[#121215] rounded-3xl p-6 sm:p-7 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 block mb-1">
            ANALYTICS & METRICS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            របាយការណ៍ និងស្ថិតិ
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            ទិដ្ឋភាពទូទៅនៃវត្តមានសិស្ស និងស្ថិតិប្រចាំខែ
          </p>
        </div>

        {/* Export and Print Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="p-2.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-2xl text-sm transition-colors cursor-pointer"
            title="បោះពុម្ពរបាយការណ៍ (Print)"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-2xl text-xs sm:text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shadow-xs cursor-pointer active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Export Excel</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs sm:text-sm font-bold transition-colors shadow-xs cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Bento Tile */}
      <div className="bg-white dark:bg-[#121215] p-5 sm:p-6 rounded-3xl shadow-xs border border-zinc-200 dark:border-zinc-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              ពីថ្ងៃ (FROM DATE)
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-3.5 py-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-xs sm:text-sm text-zinc-900 dark:text-white font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              ដល់ថ្ងៃ (TO DATE)
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3.5 py-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-xs sm:text-sm text-zinc-900 dark:text-white font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              ថ្នាក់រៀន (CLASS)
            </label>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-xs sm:text-sm text-zinc-900 dark:text-white font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none pr-8 cursor-pointer transition-all"
              >
                <option value="all">គ្រប់ថ្នាក់ទាំងអស់</option>
                <option value="10A">ថ្នាក់ទី 10A</option>
                <option value="10B">ថ្នាក់ទី 10B</option>
                <option value="11A">ថ្នាក់ទី 11A</option>
                <option value="12A">ថ្នាក់ទី 12A</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              ស្វែងរក (SEARCH)
            </label>
            <div className="relative">
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="ស្វែងរកឈ្មោះ ឬអត្តលេខ..."
                className="w-full pl-3.5 pr-10 py-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-xs sm:text-sm text-zinc-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none placeholder-zinc-400 transition-all"
              />
              <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stat Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: School Days */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-[#121215] p-6 rounded-3xl shadow-xs border border-zinc-200 dark:border-zinc-800 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
            <Calendar className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              ចំនួនថ្ងៃសិក្សាសរុប
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-0.5">
              22 <span className="text-xs font-normal text-zinc-400">ថ្ងៃ</span>
            </h3>
          </div>
        </motion.div>

        {/* Card 2: Attendance Rate */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-[#121215] p-6 rounded-3xl shadow-xs border border-zinc-200 dark:border-zinc-800 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              អត្រាវត្តមានមធ្យម
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-0.5 flex items-center gap-2">
              94.5%
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                +2.1%
              </span>
            </h3>
          </div>
        </motion.div>

        {/* Card 3: Total Absent Today */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-[#121215] p-6 rounded-3xl shadow-xs border border-zinc-200 dark:border-zinc-800 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center">
            <UserX className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              អវត្តមានសរុប (ថ្ងៃនេះ)
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-0.5">
              12 <span className="text-xs font-normal text-zinc-400">នាក់</span>
            </h3>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid: Table + Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-grow">
        {/* Left 2 Cols: Detailed Table Area */}
        <div className="xl:col-span-2 bg-white dark:bg-[#121215] rounded-3xl shadow-xs border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 block">
                STUDENT BREAKDOWN
              </span>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                បញ្ជីវត្តមានលម្អិត
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-400 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
              បង្ហាញ {filteredReports.length} នាក់
            </span>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-50/80 dark:bg-zinc-900/80 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 sticky top-0">
                  <th className="p-3.5">អត្តលេខ</th>
                  <th className="p-3.5">ឈ្មោះសិស្ស</th>
                  <th className="p-3.5">ថ្នាក់រៀន</th>
                  <th className="p-3.5 text-center">វត្តមាន</th>
                  <th className="p-3.5 text-center">អវត្តមាន</th>
                  <th className="p-3.5 text-center">ច្បាប់</th>
                  <th className="p-3.5 text-right">សរុប (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-zinc-800 dark:text-zinc-200">
                {filteredReports.map((row, idx) => {
                  const isHigh = row.ratePercentage >= 90;
                  const isLow = row.ratePercentage < 80;

                  return (
                    <tr
                      key={row.student.id}
                      onClick={() => onOpenStudentModal && onOpenStudentModal(row.student)}
                      className="hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                    >
                      <td className="p-3.5 font-mono text-xs text-zinc-400 dark:text-zinc-500">
                        {row.student.studentCode}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={row.student.avatarUrl}
                            alt={row.student.fullNameKhmer}
                            className="w-8 h-8 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700"
                            referrerPolicy="no-referrer"
                          />
                          <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                            {row.student.fullNameKhmer}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 font-medium text-xs">
                        <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 font-mono text-[11px]">
                          {row.student.className}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-bold text-emerald-500">
                        {row.presentCount}
                      </td>
                      <td className="p-3.5 text-center font-bold text-rose-500">
                        {row.absentCount}
                      </td>
                      <td className="p-3.5 text-center font-bold text-amber-500">
                        {row.permissionCount}
                      </td>
                      <td
                        className={`p-3.5 text-right font-bold font-mono ${
                          isHigh
                            ? 'text-emerald-500'
                            : isLow
                            ? 'text-rose-500'
                            : 'text-zinc-900 dark:text-white'
                        }`}
                      >
                        {row.ratePercentage}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Bento Charts Area */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          {/* Chart 1: Monthly Attendance Trend */}
          <div className="bg-white dark:bg-[#121215] rounded-3xl shadow-xs border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 block mb-1">
              TREND REPORT
            </span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-4">
              និន្នាការវត្តមានប្រចាំខែ
            </h3>

            {/* Custom Bar Chart Bento */}
            <div className="relative w-full h-48 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-end p-3 gap-2 sm:gap-3">
              {MONTHLY_TREND_DATA.map((item, i) => {
                const isCurrent = item.isCurrent;
                const heightPercent = `${item.rate}%`;

                return (
                  <div
                    key={item.monthKhmer}
                    onMouseEnter={() => setActiveMonthHover(i)}
                    onMouseLeave={() => setActiveMonthHover(null)}
                    className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                  >
                    {/* Tooltip on hover or always shown for current */}
                    <div
                      className={`absolute -top-8 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-md pointer-events-none transition-all ${
                        activeMonthHover === i || isCurrent ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                      }`}
                    >
                      {item.rate}%
                    </div>

                    <div
                      style={{ height: heightPercent }}
                      className={`w-full rounded-t-xl transition-all duration-300 ${
                        isCurrent
                          ? 'bg-indigo-600 dark:bg-indigo-500 shadow-sm'
                          : 'bg-zinc-300 dark:bg-zinc-700 opacity-75 group-hover:opacity-100 group-hover:bg-indigo-400'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Month labels */}
            <div className="flex justify-between mt-3 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 px-1">
              {MONTHLY_TREND_DATA.map((m) => (
                <span
                  key={m.monthKhmer}
                  className={m.isCurrent ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}
                >
                  {m.monthKhmer}
                </span>
              ))}
            </div>
          </div>

          {/* Chart 2: Today's Distribution Ratio */}
          <div className="bg-white dark:bg-[#121215] rounded-3xl shadow-xs border border-zinc-200 dark:border-zinc-800 p-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 block mb-1">
              TODAY'S DISTRIBUTION
            </span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-4">
              សមាមាត្រវត្តមានថ្ងៃនេះ
            </h3>

            <div className="flex items-center gap-5">
              {/* Donut Chart Visual */}
              <div className="relative w-24 h-24 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background ring */}
                  <path
                    className="text-zinc-100 dark:text-zinc-800"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Present segment (Emerald 85%) */}
                  <path
                    className="text-emerald-500"
                    strokeDasharray="85, 100"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Excused segment (Amber 8%) */}
                  <path
                    className="text-amber-500"
                    strokeDasharray="8, 100"
                    strokeDashoffset="-85"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Absent segment (Rose 7%) */}
                  <path
                    className="text-rose-500"
                    strokeDasharray="7, 100"
                    strokeDashoffset="-93"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-lg font-extrabold text-zinc-900 dark:text-white font-mono">
                    85%
                  </span>
                </div>
              </div>

              {/* Legend & Breakdown */}
              <div className="flex flex-col gap-2.5 flex-grow text-xs">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>វត្តមាន</span>
                  </div>
                  <span className="font-bold text-emerald-500 font-mono">450 នាក់</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>អវត្តមាន</span>
                  </div>
                  <span className="font-bold text-rose-500 font-mono">12 នាក់</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>ច្បាប់</span>
                  </div>
                  <span className="font-bold text-amber-500 font-mono">38 នាក់</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
