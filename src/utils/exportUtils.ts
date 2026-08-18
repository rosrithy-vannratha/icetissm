import * as XLSX from 'xlsx';
import { Student, StudentReportSummary } from '../types';

export function exportReportsToExcel(
  reports: StudentReportSummary[],
  filters: { fromDate: string; toDate: string; className: string }
) {
  const data = reports.map((r, idx) => ({
    'ល.រ': idx + 1,
    '១. អត្តលេខ': r.student.studentCode,
    '២. ឈ្មោះខ្មែរ': r.student.fullNameKhmer,
    '៣. ឈ្មោះឡាតាំង': r.student.fullNameEn,
    '៤. ឈ្មោះចិន': r.student.chineseName || '',
    '៥. ភេទ': r.student.gender === 'M' ? 'ប្រុស' : 'ស្រី',
    '៦. ថ្ងៃខែកំណើត': r.student.dob || '',
    '៧. ជំនាញ': r.student.major || '',
    '៨. ជំនាន់': r.student.generation || '',
    '៩. ឆ្នាំ': r.student.yearLevel || '',
    '១០. ឆមាស': r.student.semester || '',
    '១១. វេនសិក្សា': r.student.shift || '',
    'វត្តមាន (ថ្ងៃ)': r.presentCount,
    'ឥតច្បាប់ (ថ្ងៃ)': r.absentCount,
    'មានច្បាប់ (ថ្ងៃ)': r.permissionCount,
    'យឺត (ថ្ងៃ)': r.lateCount,
    'សរុបថ្ងៃ': r.totalDays,
    'អត្រាវត្តមាន': `${r.ratePercentage}%`
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 6 },  // No
    { wch: 14 }, // Code
    { wch: 18 }, // Name KH
    { wch: 18 }, // Name EN
    { wch: 12 }, // Chinese Name
    { wch: 8 },  // Gender
    { wch: 14 }, // DOB
    { wch: 22 }, // Major
    { wch: 12 }, // Gen
    { wch: 10 }, // Year
    { wch: 12 }, // Semester
    { wch: 12 }, // Shift
    { wch: 12 }, // Present
    { wch: 12 }, // Absent
    { wch: 12 }, // Excused
    { wch: 10 }, // Late
    { wch: 10 }, // Total
    { wch: 12 }, // Rate
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'របាយការណ៍សិស្ស_ICETI');

  const filename = `របាយការណ៍សិស្ស_${filters.className.replace(/\s+/g, '_')}_${filters.fromDate}_to_${filters.toDate}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

export function exportReportsToCSV(
  reports: StudentReportSummary[],
  filters: { fromDate: string; toDate: string; className: string }
) {
  const headers = [
    'ល.រ,១.អត្តលេខ,២.ឈ្មោះខ្មែរ,៣.ឈ្មោះឡាតាំង,៤.ឈ្មោះចិន,៥.ភេទ,៦.ថ្ងៃកំណើត,៧.ជំនាញ,៨.ជំនាន់,៩.ឆ្នាំ,១០.ឆមាស,១១.វេន,វត្តមាន,ឥតច្បាប់,មានច្បាប់,យឺត,សរុប,អត្រា%'
  ];
  const rows = reports.map((r, idx) => [
    idx + 1,
    `"${r.student.studentCode}"`,
    `"${r.student.fullNameKhmer}"`,
    `"${r.student.fullNameEn}"`,
    `"${r.student.chineseName || ''}"`,
    `"${r.student.gender === 'M' ? 'ប្រុស' : 'ស្រី'}"`,
    `"${r.student.dob || ''}"`,
    `"${r.student.major || ''}"`,
    `"${r.student.generation || ''}"`,
    `"${r.student.yearLevel || ''}"`,
    `"${r.student.semester || ''}"`,
    `"${r.student.shift || ''}"`,
    r.presentCount,
    r.absentCount,
    r.permissionCount,
    r.lateCount,
    r.totalDays,
    `"${r.ratePercentage}%"`
  ].join(','));

  const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `របាយការណ៍សិស្ស_${filters.className.replace(/\s+/g, '_')}_${filters.fromDate}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export Single-Day Attendance Sheet to Excel
 */
export function exportDailyAttendanceToExcel(
  students: Student[],
  attendanceMap: Record<string, { status: string; note?: string }>,
  meta: { date: string; className: string; teacherName?: string }
) {
  const statusLabel = (st?: string) => {
    if (st === 'present') return 'វត្តមាន';
    if (st === 'absent') return 'ឥតច្បាប់';
    if (st === 'permission') return 'មានច្បាប់';
    if (st === 'late') return 'យឺត';
    return 'វត្តមាន';
  };

  const data = students.map((s, idx) => ({
    'ល.រ': idx + 1,
    '១. អត្តលេខ': s.studentCode,
    '២. ឈ្មោះខ្មែរ': s.fullNameKhmer,
    '៣. ឈ្មោះឡាតាំង': s.fullNameEn,
    '៤. ឈ្មោះចិន': s.chineseName || '',
    '៥. ភេទ': s.gender === 'M' ? 'ប្រុស' : 'ស្រី',
    '៦. ថ្ងៃខែកំណើត': s.dob || '',
    '៧. ជំនាញ': s.major || '',
    '៨. ជំនាន់': s.generation || '',
    '៩. ឆ្នាំ': s.yearLevel || '',
    '១០. ឆមាស': s.semester || '',
    '១១. វេនសិក្សា': s.shift || '',
    'ស្ថានភាពវត្តមាន': statusLabel(attendanceMap[s.id]?.status),
    'កំណត់ចំណាំ': attendanceMap[s.id]?.note || '',
    'កាលបរិច្ឆេទ': meta.date,
    'ថ្នាក់រៀន': meta.className
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 18 },
    { wch: 18 },
    { wch: 12 },
    { wch: 8 },
    { wch: 14 },
    { wch: 22 },
    { wch: 12 },
    { wch: 10 },
    { wch: 12 },
    { wch: 12 },
    { wch: 16 },
    { wch: 24 },
    { wch: 14 },
    { wch: 20 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'វត្តមានប្រចាំថ្ងៃ');
  const filename = `បញ្ជីវត្តមាន_${meta.className.replace(/\s+/g, '_')}_${meta.date}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

/**
 * Export Monthly Matrix Attendance Sheet to Excel
 */
export function exportMonthlyAttendanceToExcel(
  students: Student[],
  monthData: {
    year: number;
    month: number;
    daysInMonth: number;
    className: string;
    getStudentStatus: (studentId: string, day: number) => { status: string; note?: string };
    getStudentStats: (studentId: string) => { present: number; absent: number; permission: number; late: number; rate: number };
  }
) {
  const data = students.map((s, idx) => {
    const stats = monthData.getStudentStats(s.id);
    const row: Record<string, any> = {
      'ល.រ': idx + 1,
      'អត្តលេខ': s.studentCode,
      'ឈ្មោះខ្មែរ': s.fullNameKhmer,
      'ឈ្មោះចិន': s.chineseName || '',
      'ភេទ': s.gender === 'M' ? 'ប្រុស' : 'ស្រី',
      'ជំនាញ': s.major || '',
      'ថ្នាក់': monthData.className
    };

    // Add days 1..daysInMonth
    for (let day = 1; day <= monthData.daysInMonth; day++) {
      const st = monthData.getStudentStatus(s.id, day).status;
      const mark = st === 'present' ? '✓' : st === 'absent' ? '✗' : st === 'permission' ? 'P' : st === 'late' ? 'L' : '✓';
      row[`ថ្ងៃ ${day}`] = mark;
    }

    row['វត្តមាន (ថ្ងៃ)'] = stats.present;
    row['ឥតច្បាប់ (ថ្ងៃ)'] = stats.absent;
    row['មានច្បាប់ (ថ្ងៃ)'] = stats.permission;
    row['យឺត (ថ្ងៃ)'] = stats.late;
    row['អត្រាវត្តមាន %'] = `${stats.rate}%`;

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `ខែ_${monthData.month}_${monthData.year}`);
  const filename = `វត្តមានប្រចាំខែ_${monthData.month}_${monthData.year}_${monthData.className.replace(/\s+/g, '_')}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

/**
 * Downloads a pre-formatted Excel template for importing students with all 11 core attributes.
 */
export function downloadStudentTemplate() {
  const sampleData = [
    {
      '១. អត្តលេខ': 'ICETI-202601',
      '២. ឈ្មោះខ្មែរ': 'សុខ សាន្ត',
      '៣. ឈ្មោះឡាតាំង': 'Sok Sant',
      '៤. ឈ្មោះចិន': '孙小圣',
      '៥. ភេទ': 'ប្រុស',
      '៦. ថ្ងៃខែកំណើត': '2004-05-15',
      '៧. ជំនាញ': 'គរុកោសល្យភាសាចិន',
      '៨. ជំនាន់': 'ជំនាន់ទី ៣',
      '៩. ឆ្នាំ': 'ឆ្នាំទី ៤',
      '១០. ឆមាស': 'ឆមាសទី ១',
      '១១. វេនសិក្សា': 'វេនព្រឹក',
      'ទូរស័ព្ទសិស្ស': '012 345 678',
      'ឈ្មោះអាណាព្យាបាល': 'សុខ គង់',
      'ទូរស័ព្ទអាណាព្យាបាល': '098 765 432',
      'អាសយដ្ឋាន': 'ខណ្ឌទួលគោក រាជធានីភ្នំពេញ'
    },
    {
      '១. អត្តលេខ': 'ICETI-202602',
      '២. ឈ្មោះខ្មែរ': 'ចាន់ មករា',
      '៣. ឈ្មោះឡាតាំង': 'Chan Makara',
      '៤. ឈ្មោះចិន': '陈马克',
      '៥. ភេទ': 'ស្រី',
      '៦. ថ្ងៃខែកំណើត': '2005-01-20',
      '៧. ជំនាញ': 'បកប្រែភាសាចិន',
      '៨. ជំនាន់': 'ជំនាន់ទី ៣',
      '៩. ឆ្នាំ': 'ឆ្នាំទី ៤',
      '១០. ឆមាស': 'ឆមាសទី ១',
      '១១. វេនសិក្សា': 'វេនរសៀល',
      'ទូរស័ព្ទសិស្ស': '089 987 654',
      'ឈ្មោះអាណាព្យាបាល': 'ចាន់ វាសនា',
      'ទូរស័ព្ទអាណាព្យាបាល': '097 555 666',
      'អាសយដ្ឋាន': 'ខណ្ឌសែនសុខ រាជធានីភ្នំពេញ'
    },
    {
      '១. អត្តលេខ': 'ICETI-202603',
      '២. ឈ្មោះខ្មែរ': 'លី ម៉ីលីង',
      '៣. ឈ្មោះឡាតាំង': 'Ly Meiling',
      '៤. ឈ្មោះចិន': '李美玲',
      '៥. ភេទ': 'ស្រី',
      '៦. ថ្ងៃខែកំណើត': '2004-11-12',
      '៧. ជំនាញ': 'ពាណិជ្ជកម្មចិន',
      '៨. ជំនាន់': 'ជំនាន់ទី ៣',
      '៩. ឆ្នាំ': 'ឆ្នាំទី ៤',
      '១០. ឆមាស': 'ឆមាសទី ១',
      '១១. វេនសិក្សា': 'វេនយប់',
      'ទូរស័ព្ទសិស្ស': '096 112 233',
      'ឈ្មោះអាណាព្យាបាល': 'លី ហេង',
      'ទូរស័ព្ទអាណាព្យាបាល': '011 223 344',
      'អាសយដ្ឋាន': 'ខណ្ឌដូនពេញ រាជធានីភ្នំពេញ'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  worksheet['!cols'] = [
    { wch: 16 }, // ID
    { wch: 18 }, // KH Name
    { wch: 18 }, // EN Name
    { wch: 14 }, // Chinese Name
    { wch: 10 }, // Gender
    { wch: 14 }, // DOB
    { wch: 22 }, // Major
    { wch: 14 }, // Gen
    { wch: 12 }, // Year
    { wch: 12 }, // Semester
    { wch: 14 }, // Shift
    { wch: 16 }, // Phone
    { wch: 18 }, // Parent Name
    { wch: 18 }, // Parent Phone
    { wch: 30 }, // Address
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'គំរូបញ្ជីសិស្ស_ICETI');
  XLSX.writeFile(workbook, 'គំរូឯកសារExcel_បញ្ជីរាយនាមសិស្ស_ICETI.xlsx');
}

/**
 * Format Excel raw date (serial number or string) into YYYY-MM-DD
 */
function parseExcelDate(raw: any): string {
  if (!raw) return '2004-05-15';
  if (typeof raw === 'number') {
    // Convert Excel serial date
    const date = new Date(Math.round((raw - 25569) * 86400 * 1000));
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  }
  const str = String(raw).trim();
  // Handle DD/MM/YYYY or DD-MM-YYYY
  const parts = str.split(/[/.-]/);
  if (parts.length === 3) {
    if (parts[2].length === 4) {
      // DD-MM-YYYY
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    } else if (parts[0].length === 4) {
      // YYYY-MM-DD
      const year = parts[0];
      const month = parts[1].padStart(2, '0');
      const day = parts[2].padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
  return str || '2004-05-15';
}

/**
 * Normalizes gender value to 'M' or 'F'
 */
function normalizeGender(val: any): 'M' | 'F' {
  if (!val) return 'M';
  const s = String(val).trim().toLowerCase();
  if (s === 'ស្រី' || s === 'f' || s === 'female' || s === 'girl' || s === 'woman' || s === '2' || s === '女') {
    return 'F';
  }
  return 'M';
}

/**
 * Parses uploaded Excel / CSV file into an array of Student objects
 */
export async function parseStudentsExcelFile(
  file: File,
  defaultClassId: string = 'c-12a',
  defaultClassName: string = 'ថ្នាក់គរុកោសល្យ ក'
): Promise<{ students: Omit<Student, 'id'>[]; errors: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        const workbook = XLSX.read(buffer, { type: 'binary', cellDates: false });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          return resolve({ students: [], errors: ['ពុំមានទិន្នន័យនៅក្នុងឯកសារ Excel នេះទេ។'] });
        }

        const worksheet = workbook.Sheets[sheetName];
        const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (rows.length === 0) {
          return resolve({ students: [], errors: ['ឯកសារ Excel មិនមានជួរដេកទិន្នន័យឡើយ។'] });
        }

        const students: Omit<Student, 'id'>[] = [];
        const errors: string[] = [];

        rows.forEach((row, index) => {
          const rowNum = index + 2; // header is row 1
          
          // Match key helpers (case-insensitive & whitespace trimmed)
          const findVal = (...keys: string[]): string => {
            for (const key of keys) {
              const matchedKey = Object.keys(row).find((k) =>
                k.trim().toLowerCase().includes(key.toLowerCase())
              );
              if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== '') {
                return String(row[matchedKey]).trim();
              }
            }
            return '';
          };

          // 1. Student Code / ID
          const studentCode =
            findVal('១. អត្តលេខ', 'អត្តលេខ', 'studentcode', 'student id', 'code', 'អត្តសញ្ញាណ') ||
            `ICETI-2026${String(index + 10).padStart(2, '0')}`;

          // 2. Khmer Name
          const fullNameKhmer =
            findVal('២. ឈ្មោះខ្មែរ', 'ឈ្មោះខ្មែរ', 'fullnamekhmer', 'ឈ្មោះសិស្ស', 'ឈ្មោះ', 'khmer name', 'name kh') ||
            findVal('name', 'fullname');

          // 3. English/Latin Name
          const fullNameEn =
            findVal('៣. ឈ្មោះឡាតាំង', 'ឈ្មោះឡាតាំង', 'fullnameen', 'latin name', 'english name', 'name en') ||
            fullNameKhmer;

          // 4. Chinese Name
          const chineseName =
            findVal('៤. ឈ្មោះចិន', 'ឈ្មោះចិន', 'chinesename', 'chinese name', '中文', '中文姓名', 'អក្សរចិន') || '';

          // 5. Gender
          const rawGender =
            findVal('៥. ភេទ', 'ភេទ', 'gender', 'sex');
          const gender = normalizeGender(rawGender);

          // 6. DOB
          const rawDob =
            findVal('៦. ថ្ងៃខែកំណើត', 'ថ្ងៃខែកំណើត', 'ថ្ងៃកំណើត', 'dob', 'birth date', 'date of birth', 'កំណើត');
          const dob = parseExcelDate(rawDob);

          // 7. Major
          const major =
            findVal('៧. ជំនាញ', 'ជំនាញ', 'major', 'department', 'ឯកទេស') || 'គរុកោសល្យភាសាចិន';

          // 8. Generation
          const generation =
            findVal('៨. ជំនាន់', 'ជំនាន់', 'generation', 'gen', 'batch') || 'ជំនាន់ទី ៣';

          // 9. Year Level
          const yearLevel =
            findVal('៩. ឆ្នាំ', 'ឆ្នាំ', 'yearlevel', 'year', 'ឆ្នាំទី') || 'ឆ្នាំទី ៤';

          // 10. Semester
          const semester =
            findVal('១០. ឆមាស', 'ឆមាស', 'semester', 'term', 'ឆមាសទី') || 'ឆមាសទី ១';

          // 11. Shift
          const shift =
            findVal('១១. វេនសិក្សា', 'វេនសិក្សា', 'វេន', 'shift', 'study shift', 'session') || 'វេនព្រឹក';

          // Supplemental fields
          const phone = findVal('ទូរស័ព្ទសិស្ស', 'ទូរស័ព្ទ', 'phone', 'mobile', 'tel');
          const parentName = findVal('ឈ្មោះអាណាព្យាបាល', 'អាណាព្យាបាល', 'parent', 'guardian');
          const parentPhone = findVal('ទូរស័ព្ទអាណាព្យាបាល', 'parent phone', 'parentphone');
          const address = findVal('អាសយដ្ឋាន', 'address', 'ទីលំនៅ');

          // Validation
          if (!fullNameKhmer) {
            errors.push(`ជួរទី ${rowNum}: ខ្វះឈ្មោះខ្មែរ (Khmer Name)`);
            return;
          }

          const avatarSeed = fullNameEn || fullNameKhmer || studentCode;
          const avatarUrl = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(avatarSeed)}&backgroundColor=e0e7ff,fbcfe8,c7d2fe`;
          const initialKhmer = fullNameKhmer.charAt(0) || 'ស';

          students.push({
            studentCode,
            fullNameKhmer,
            fullNameEn,
            chineseName,
            gender,
            dob,
            major,
            generation,
            yearLevel,
            semester,
            shift,
            classId: defaultClassId,
            className: defaultClassName,
            avatarUrl,
            initialKhmer,
            phone,
            parentName,
            parentPhone,
            address
          });
        });

        resolve({ students, errors });
      } catch (err: any) {
        reject(new Error(`មិនអាចអានឯកសារ Excel បានទេ: ${err.message || 'Unknown error'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('មានបញ្ហាក្នុងការអានឯកសារ។'));
    };

    reader.readAsBinaryString(file);
  });
}

