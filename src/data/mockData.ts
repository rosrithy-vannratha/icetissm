import { Student, ClassRoom, Major, MonthlyTrendData, Generation, AcademicYear, YearLevel, Semester } from '../types';
import adminAvatarImg from '../assets/images/admin_avatar_1787026378402.jpg';

export const INITIAL_GENERATIONS: Generation[] = [
  {
    id: 'gen-01',
    nameKhmer: 'ជំនាន់ទី ១',
    nameEn: 'Generation 1',
    startYear: '2021',
    endYear: '2025',
    status: 'graduated',
    description: 'ជំនាន់ស្ថាបនិកដំបូងរបស់វិទ្យាស្ថានគរុកោសល្យភាសាចិន'
  },
  {
    id: 'gen-02',
    nameKhmer: 'ជំនាន់ទី ២',
    nameEn: 'Generation 2',
    startYear: '2022',
    endYear: '2026',
    status: 'active',
    description: 'ជំនាន់បញ្ចប់ការសិក្សាឆ្នាំ ២០២៦'
  },
  {
    id: 'gen-03',
    nameKhmer: 'ជំនាន់ទី ៣',
    nameEn: 'Generation 3',
    startYear: '2023',
    endYear: '2027',
    status: 'active',
    description: 'ជំនាន់បច្ចុប្បន្នកំពុងសិក្សាឆ្នាំទី ៤'
  },
  {
    id: 'gen-04',
    nameKhmer: 'ជំនាន់ទី ៤',
    nameEn: 'Generation 4',
    startYear: '2024',
    endYear: '2028',
    status: 'active',
    description: 'ជំនាន់សកម្មកំពុងសិក្សា'
  },
  {
    id: 'gen-05',
    nameKhmer: 'ជំនាន់ទី ៥',
    nameEn: 'Generation 5',
    startYear: '2025',
    endYear: '2029',
    status: 'upcoming',
    description: 'ជំនាន់ថ្មីដែលនឹងត្រូវចូលរៀនវគ្គបន្ទាប់'
  }
];

export const INITIAL_ACADEMIC_YEARS: AcademicYear[] = [
  {
    id: 'ay-2023',
    nameKhmer: '2023-2024',
    nameEn: 'Academic Year 2023-2024',
    startDate: '2023-10-01',
    endDate: '2024-07-31',
    isCurrent: false,
    description: 'ឆ្នាំសិក្សាកន្លងទៅ'
  },
  {
    id: 'ay-2024',
    nameKhmer: '2024-2025',
    nameEn: 'Academic Year 2024-2025',
    startDate: '2024-10-01',
    endDate: '2025-07-31',
    isCurrent: false,
    description: 'ឆ្នាំសិក្សាកន្លងទៅ'
  },
  {
    id: 'ay-2025',
    nameKhmer: '2025-2026',
    nameEn: 'Academic Year 2025-2026',
    startDate: '2025-10-01',
    endDate: '2026-07-31',
    isCurrent: false,
    description: 'ឆ្នាំសិក្សាកន្លងទៅ'
  },
  {
    id: 'ay-2026',
    nameKhmer: '2026-2027',
    nameEn: 'Academic Year 2026-2027',
    startDate: '2026-10-01',
    endDate: '2027-07-31',
    isCurrent: true,
    description: 'ឆ្នាំសិក្សាបច្ចុប្បន្នដែលកំពុងដំណើរការ'
  },
  {
    id: 'ay-2027',
    nameKhmer: '2027-2028',
    nameEn: 'Academic Year 2027-2028',
    startDate: '2027-10-01',
    endDate: '2028-07-31',
    isCurrent: false,
    description: 'ឆ្នាំសិក្សាគ្រោងទុកបន្ទាប់'
  }
];

export const INITIAL_YEAR_LEVELS: YearLevel[] = [
  {
    id: 'yl-01',
    nameKhmer: 'ឆ្នាំទី ១',
    nameEn: 'Year 1 (Freshman)',
    levelNumber: 1,
    description: 'កម្រិតឆ្នាំដំបូង និងមូលដ្ឋានគ្រឹះភាសាចិន'
  },
  {
    id: 'yl-02',
    nameKhmer: 'ឆ្នាំទី ២',
    nameEn: 'Year 2 (Sophomore)',
    levelNumber: 2,
    description: 'កម្រិតមធ្យម និងភាសាវិទ្យាចិន'
  },
  {
    id: 'yl-03',
    nameKhmer: 'ឆ្នាំទី ៣',
    nameEn: 'Year 3 (Junior)',
    levelNumber: 3,
    description: 'កម្រិតខ្ពស់ និងជំនាញគរុកោសល្យបង្រៀនជាក់ស្តែង'
  },
  {
    id: 'yl-04',
    nameKhmer: 'ឆ្នាំទី ៤',
    nameEn: 'Year 4 (Senior)',
    levelNumber: 4,
    description: 'កម្រិតបញ្ចប់ការសិក្សា ចុះកម្មសិក្សា និងសារណា'
  }
];

export const INITIAL_SEMESTERS: Semester[] = [
  {
    id: 'sem-01',
    nameKhmer: 'ឆមាសទី ១',
    nameEn: 'Semester 1',
    semesterNumber: 1,
    isCurrent: true,
    description: 'ឆមាសទី ១ ប្រចាំឆ្នាំសិក្សា'
  },
  {
    id: 'sem-02',
    nameKhmer: 'ឆមាសទី ២',
    nameEn: 'Semester 2',
    semesterNumber: 2,
    isCurrent: false,
    description: 'ឆមាសទី ២ ប្រចាំឆ្នាំសិក្សា'
  },
  {
    id: 'sem-03',
    nameKhmer: 'ឆមាសវិស្សមកាល / វគ្គខ្លី',
    nameEn: 'Summer / Intensive Term',
    semesterNumber: 3,
    isCurrent: false,
    description: 'វគ្គសិក្សាពង្រឹងសមត្ថភាព ឬវគ្គបំប៉នពិសេស'
  }
];

export const INITIAL_MAJORS: Major[] = [
  {
    id: 'm-01',
    code: 'CP-01',
    nameKhmer: 'គរុកោសល្យភាសាចិន',
    nameChinese: '国际中文教育',
    nameEn: 'Chinese Pedagogy & Education',
    degreeLevel: 'បរិញ្ញាបត្រ (Bachelor)',
    durationYears: 4,
    description: 'បណ្តុះបណ្តាលគរុនិស្សិតឱ្យក្លាយជាគ្រូបង្រៀនភាសាចិនកម្រិតឧត្តមសិក្សា និងមធ្យមសិក្សាប្រកបដោយវិជ្ជាជីវៈខ្ពស់។'
  },
  {
    id: 'm-02',
    code: 'CL-02',
    nameKhmer: 'អក្សរសាស្ត្រចិន',
    nameChinese: '汉语言文学',
    nameEn: 'Chinese Language & Literature',
    degreeLevel: 'បរិញ្ញាបត្រ (Bachelor)',
    durationYears: 4,
    description: 'សិក្សាស៊ីជម្រៅអំពីភាសាវិទ្យាចិន អក្សរសិល្ប៍ វប្បធម៌ និងប្រវត្តិសាស្ត្រចិនបុរាណនិងទំនើប។'
  },
  {
    id: 'm-03',
    code: 'TI-03',
    nameKhmer: 'បកប្រែភាសាចិន',
    nameChinese: '汉英/柬翻译',
    nameEn: 'Chinese Translation & Interpretation',
    degreeLevel: 'បរិញ្ញាបត្រ (Bachelor)',
    durationYears: 4,
    description: 'បណ្តុះបណ្តាលជំនាញបកប្រែផ្ទាល់មាត់ និងការបកប្រែឯកសារផ្លូវការ ពាណិជ្ជកម្ម និងការទូត។'
  },
  {
    id: 'm-04',
    code: 'BC-04',
    nameKhmer: 'ភាសាចិនពាណិជ្ជកម្ម',
    nameChinese: '商务汉语',
    nameEn: 'Business Chinese',
    degreeLevel: 'បរិញ្ញាបត្រ (Bachelor)',
    durationYears: 4,
    description: 'ផ្តោតលើការប្រាស្រ័យទាក់ទងធុរកិច្ច សេដ្ឋកិច្ច ការចរចាពាណិជ្ជកម្មអន្តរជាតិ និងទីផ្សារ។'
  },
  {
    id: 'm-05',
    code: 'TC-05',
    nameKhmer: 'ភាសាចិនទេសចរណ៍ និងបដិសណ្ឋារកិច្ច',
    nameChinese: '旅游与酒店汉语',
    nameEn: 'Tourism & Hospitality Chinese',
    degreeLevel: 'បរិញ្ញាបត្ររង (Associate)',
    durationYears: 2,
    description: 'ជំនាញភាសាចិនសម្រាប់វិស័យទេសចរណ៍ មគ្គុទ្ទេសក៍ទេសចរណ៍ និងការគ្រប់គ្រងសណ្ឋាគារ។'
  }
];

export const INITIAL_CLASSES: ClassRoom[] = [
  {
    id: 'c-12a',
    nameKhmer: 'ថ្នាក់គរុកោសល្យ ក',
    grade: 'ឆ្នាំទី ៤',
    roomNumber: 'ICETI-301',
    teacherName: 'សាស្ត្រាចារ្យ សុខ វិបុល',
    totalStudents: 28,
    academicYear: '2026-2027'
  },
  {
    id: 'c-12b',
    nameKhmer: 'ថ្នាក់គរុកោសល្យ ខ',
    grade: 'ឆ្នាំទី ៤',
    roomNumber: 'ICETI-302',
    teacherName: 'សាស្ត្រាចារ្យ កែវ មុនី',
    totalStudents: 26,
    academicYear: '2026-2027'
  },
  {
    id: 'c-11a',
    nameKhmer: 'ថ្នាក់បកប្រែភាសាចិន ក',
    grade: 'ឆ្នាំទី ៣',
    roomNumber: 'ICETI-201',
    teacherName: 'សាស្ត្រាចារ្យ ហេង សំណាង',
    totalStudents: 30,
    academicYear: '2026-2027'
  },
  {
    id: 'c-11b',
    nameKhmer: 'ថ្នាក់បកប្រែភាសាចិន ខ',
    grade: 'ឆ្នាំទី ៣',
    roomNumber: 'ICETI-202',
    teacherName: 'សាស្ត្រាចារ្យ ចាន់ សុភា',
    totalStudents: 29,
    academicYear: '2026-2027'
  },
  {
    id: 'c-10a',
    nameKhmer: 'ថ្នាក់ពាណិជ្ជកម្មចិន ក',
    grade: 'ឆ្នាំទី ២',
    roomNumber: 'ICETI-101',
    teacherName: 'សាស្ត្រាចារ្យ គង់ សុជាតិ',
    totalStudents: 32,
    academicYear: '2026-2027'
  },
  {
    id: 'c-10b',
    nameKhmer: 'ថ្នាក់ភាសាចិនទូទៅ ក',
    grade: 'ឆ្នាំទី ១',
    roomNumber: 'ICETI-102',
    teacherName: 'សាស្ត្រាចារ្យ នួន សុផល',
    totalStudents: 31,
    academicYear: '2026-2027'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's-001',
    studentCode: 'ICETI-202601',
    fullNameKhmer: 'សុខ សាន្ត',
    fullNameEn: 'Sok Sant',
    chineseName: '孙小圣',
    gender: 'M',
    dob: '2004-04-12',
    major: 'គរុកោសល្យភាសាចិន',
    generation: 'ជំនាន់ទី ៣',
    yearLevel: 'ឆ្នាំទី ៤',
    semester: 'ឆមាសទី ១',
    shift: 'វេនព្រឹក',
    classId: 'c-12a',
    className: 'ថ្នាក់គរុកោសល្យ ក',
    initialKhmer: 'សុ',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKSsA5RfBKHnd9fKbBm7I7cwsmKGuy3n2lfoV7MnsdJuU_AgMa6wXcyB636GbFe3lJq7WedxR-G6gUFNhu4jfgE-Y_YbpQ31smyMc3DtSDPDs_LOxtOP7qiFxIxrCT9k8SoEjk45VRvG4lKu7XrYkAD3TBLBdwJNsPaYGhNgIPCyZxfABQDvacandQsEesgX9AuhzMLD9EPaAfWHlucdWOIYUftZAStrNAWY-eaAFnSm8mErVLf5Jq',
    phone: '012 345 678',
    parentName: 'សុខ គង់',
    parentPhone: '098 765 432',
    address: 'ខណ្ឌទួលគោក រាជធានីភ្នំពេញ'
  },
  {
    id: 's-002',
    studentCode: 'ICETI-202602',
    fullNameKhmer: 'ចាន់ សុផល',
    fullNameEn: 'Chan Sophal',
    chineseName: '曾素芳',
    gender: 'F',
    dob: '2004-08-20',
    major: 'គរុកោសល្យភាសាចិន',
    generation: 'ជំនាន់ទី ៣',
    yearLevel: 'ឆ្នាំទី ៤',
    semester: 'ឆមាសទី ១',
    shift: 'វេនព្រឹក',
    classId: 'c-12a',
    className: 'ថ្នាក់គរុកោសល្យ ក',
    initialKhmer: 'ច',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAigosMiuQAcOQlde05ZDHKu45HlEzY54FcwzwPGNaWP5pKYG6sH23tLJdSsCJrTyEgY8k96uVjfknEOv10-Z3WS134pOfiF1Z1DcoKaU3yX04qiU2jf6WRAAirQcVLurZjWjnR4jzezL3Ydu-NJZXcPlpghd88R5UJzmbYJBHDVmvblLxTVMAZR2kyf0o_uzBXxloZl37-Fn_luvPhHaTScFrVvZdIp8VDUxsHbma5b8jq1MyK2eEc',
    phone: '015 889 900',
    parentName: 'ចាន់ វណ្ណា',
    parentPhone: '011 223 344',
    address: 'ខណ្ឌដូនពេញ រាជធានីភ្នំពេញ'
  },
  {
    id: 's-003',
    studentCode: 'ICETI-202603',
    fullNameKhmer: 'រិទ្ធី មុនី',
    fullNameEn: 'Rithy Mony',
    chineseName: '李文杰',
    gender: 'M',
    dob: '2004-01-15',
    major: 'គរុកោសល្យភាសាចិន',
    generation: 'ជំនាន់ទី ៣',
    yearLevel: 'ឆ្នាំទី ៤',
    semester: 'ឆមាសទី ១',
    shift: 'វេនព្រឹក',
    classId: 'c-12a',
    className: 'ថ្នាក់គរុកោសល្យ ក',
    initialKhmer: 'រ',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhzwsDfn_2SjCZqqSdEMDTdu3Kb88lRIejZJic6rQbKd7LufJJPUqMhGpGJRfVms2GB84TsqCVFUN-ZhHwwRyjiQ5AybuHzNsMBTXO1ha59tBxDzCzJhhoV9ajwBWeCkIYRPBn96ijCGb5s7rWw56SUvHBjD33gz-pxwbZ63Ahg_hkSJXbjv6ZSWtjKU_upX0q5p9WdhFXhPIZ0EW4OMBoA0qElKYxAe8F8Kc9MRsp7LHyWj5GHG05',
    phone: '097 555 4321',
    parentName: 'រិទ្ធី វឌ្ឍនៈ',
    parentPhone: '088 999 1122',
    address: 'ខណ្ឌចំការមន រាជធានីភ្នំពេញ'
  },
  {
    id: 's-004',
    studentCode: 'ICETI-202604',
    fullNameKhmer: 'ចាន់ មករា',
    fullNameEn: 'Chan Makara',
    chineseName: '曾子豪',
    gender: 'M',
    dob: '2005-01-01',
    major: 'ពាណិជ្ជកម្មចិន',
    generation: 'ជំនាន់ទី ៤',
    yearLevel: 'ឆ្នាំទី ២',
    semester: 'ឆមាសទី ២',
    shift: 'វេនរសៀល',
    classId: 'c-10a',
    className: 'ថ្នាក់ពាណិជ្ជកម្មចិន ក',
    initialKhmer: 'ច',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhzwsDfn_2SjCZqqSdEMDTdu3Kb88lRIejZJic6rQbKd7LufJJPUqMhGpGJRfVms2GB84TsqCVFUN-ZhHwwRyjiQ5AybuHzNsMBTXO1ha59tBxDzCzJhhoV9ajwBWeCkIYRPBn96ijCGb5s7rWw56SUvHBjD33gz-pxwbZ63Ahg_hkSJXbjv6ZSWtjKU_upX0q5p9WdhFXhPIZ0EW4OMBoA0qElKYxAe8F8Kc9MRsp7LHyWj5GHG05',
    phone: '070 123 456',
    parentName: 'ចាន់ សុខុម',
    parentPhone: '092 334 455',
    address: 'ខណ្ឌសែនសុខ រាជធានីភ្នំពេញ'
  },
  {
    id: 's-005',
    studentCode: 'ICETI-202605',
    fullNameKhmer: 'រ័ត្ន ធីតា',
    fullNameEn: 'Rath Thida',
    chineseName: '罗心怡',
    gender: 'F',
    dob: '2006-05-18',
    major: 'ភាសាចិនទូទៅ',
    generation: 'ជំនាន់ទី ៥',
    yearLevel: 'ឆ្នាំទី ១',
    semester: 'ឆមាសទី ១',
    shift: 'វេនយប់',
    classId: 'c-10b',
    className: 'ថ្នាក់ភាសាចិនទូទៅ ក',
    initialKhmer: 'រ',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAigosMiuQAcOQlde05ZDHKu45HlEzY54FcwzwPGNaWP5pKYG6sH23tLJdSsCJrTyEgY8k96uVjfknEOv10-Z3WS134pOfiF1Z1DcoKaU3yX04qiU2jf6WRAAirQcVLurZjWjnR4jzezL3Ydu-NJZXcPlpghd88R5UJzmbYJBHDVmvblLxTVMAZR2kyf0o_uzBXxloZl37-Fn_luvPhHaTScFrVvZdIp8VDUxsHbma5b8jq1MyK2eEc',
    phone: '085 444 333',
    parentName: 'រ័ត្ន វិបុល',
    parentPhone: '077 888 999',
    address: 'ខណ្ឌឫស្សីកែវ រាជធានីភ្នំពេញ'
  },
  {
    id: 's-006',
    studentCode: 'ICETI-202606',
    fullNameKhmer: 'ពេជ្រ សំណាង',
    fullNameEn: 'Pich Samnang',
    chineseName: '毕金福',
    gender: 'M',
    dob: '2004-09-10',
    major: 'បកប្រែភាសាចិន',
    generation: 'ជំនាន់ទី ៣',
    yearLevel: 'ឆ្នាំទី ៣',
    semester: 'ឆមាសទី ១',
    shift: 'វេនព្រឹក',
    classId: 'c-11a',
    className: 'ថ្នាក់បកប្រែភាសាចិន ក',
    initialKhmer: 'ព',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKSsA5RfBKHnd9fKbBm7I7cwsmKGuy3n2lfoV7MnsdJuU_AgMa6wXcyB636GbFe3lJq7WedxR-G6gUFNhu4jfgE-Y_YbpQ31smyMc3DtSDPDs_LOxtOP7qiFxIxrCT9k8SoEjk45VRvG4lKu7XrYkAD3TBLBdwJNsPaYGhNgIPCyZxfABQDvacandQsEesgX9AuhzMLD9EPaAfWHlucdWOIYUftZAStrNAWY-eaAFnSm8mErVLf5Jq',
    phone: '096 112 2334',
    parentName: 'ពេជ្រ ផល្លា',
    parentPhone: '012 998 877',
    address: 'ខណ្ឌមានជ័យ រាជធានីភ្នំពេញ'
  },
  {
    id: 's-007',
    studentCode: 'ICETI-202607',
    fullNameKhmer: 'លី ហួរ',
    fullNameEn: 'Ly Hour',
    chineseName: '李浩华',
    gender: 'M',
    dob: '2004-11-25',
    major: 'គរុកោសល្យភាសាចិន',
    generation: 'ជំនាន់ទី ៣',
    yearLevel: 'ឆ្នាំទី ៤',
    semester: 'ឆមាសទី ១',
    shift: 'វេនព្រឹក',
    classId: 'c-12a',
    className: 'ថ្នាក់គរុកោសល្យ ក',
    initialKhmer: 'ល',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhzwsDfn_2SjCZqqSdEMDTdu3Kb88lRIejZJic6rQbKd7LufJJPUqMhGpGJRfVms2GB84TsqCVFUN-ZhHwwRyjiQ5AybuHzNsMBTXO1ha59tBxDzCzJhhoV9ajwBWeCkIYRPBn96ijCGb5s7rWw56SUvHBjD33gz-pxwbZ63Ahg_hkSJXbjv6ZSWtjKU_upX0q5p9WdhFXhPIZ0EW4OMBoA0qElKYxAe8F8Kc9MRsp7LHyWj5GHG05',
    phone: '069 333 222',
    parentName: 'លី ឈុន',
    parentPhone: '093 111 444',
    address: 'ខណ្ឌច្បារអំពៅ រាជធានីភ្នំពេញ'
  },
  {
    id: 's-008',
    studentCode: 'ICETI-202608',
    fullNameKhmer: 'ម៉េង ស្រីពៅ',
    fullNameEn: 'Meng Sreypov',
    chineseName: '孟美玉',
    gender: 'F',
    dob: '2004-03-05',
    major: 'គរុកោសល្យភាសាចិន',
    generation: 'ជំនាន់ទី ៣',
    yearLevel: 'ឆ្នាំទី ៤',
    semester: 'ឆមាសទី ១',
    shift: 'វេនព្រឹក',
    classId: 'c-12a',
    className: 'ថ្នាក់គរុកោសល្យ ក',
    initialKhmer: 'ម',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAigosMiuQAcOQlde05ZDHKu45HlEzY54FcwzwPGNaWP5pKYG6sH23tLJdSsCJrTyEgY8k96uVjfknEOv10-Z3WS134pOfiF1Z1DcoKaU3yX04qiU2jf6WRAAirQcVLurZjWjnR4jzezL3Ydu-NJZXcPlpghd88R5UJzmbYJBHDVmvblLxTVMAZR2kyf0o_uzBXxloZl37-Fn_luvPhHaTScFrVvZdIp8VDUxsHbma5b8jq1MyK2eEc',
    phone: '089 777 666',
    parentName: 'ម៉េង សុខា',
    parentPhone: '078 222 333',
    address: 'ខណ្ឌពោធិ៍សែនជ័យ រាជធានីភ្នំពេញ'
  }
];

export const MONTHLY_TREND_DATA: MonthlyTrendData[] = [
  { monthKhmer: 'មិថុនា', monthEn: 'June', rate: 80 },
  { monthKhmer: 'កក្កដា', monthEn: 'July', rate: 85 },
  { monthKhmer: 'សីហា', monthEn: 'August', rate: 90 },
  { monthKhmer: 'កញ្ញា', monthEn: 'September', rate: 95 },
  { monthKhmer: 'តុលា', monthEn: 'October', rate: 94.5, isCurrent: true }
];

export const APP_ASSETS = {
  schoolLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDohiErnHT0yGZhd4RVEmL703m_U0ZCGs72VIxStO1t7j6VRwgRv6mlaQ9obiUgzXl6_tL24Fdhcb-uRDGjj97kVovLHEvQ-Fp6JdDfCivOlm-z5wNPhCgPLCp2yjxm_-gjYLEfBjAq-RxMo1205xn9e37jHGRPDL3g_elhg2KZypr3YvHTytIgDPvWoZ2yS6KXMM_cZy8pQW8gOMchG8vQyVmzCPqcCHRVbvCvNwK4WQupTaMzhQaW',
  loginLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnEll9VUYMOXaHRhe3-M9XiGit_l5NjBLNXs7CJTk85DnFTgf8KLDz6prHKz83DmdZ16AY8qEkklh40lFVOq--8xXtXGqJzBUMpNWU-T9ghyY0_FevwGXAypt-D3jL6Ehwo-SNZdODgxA1gCtRE6HKKzgUTDiMMEACD7gri3o2YTSh8yUZwXnNNwQvlR51M6Vxp5n7f5AIadFa-Til3l4qlJ8uw4MVDRTwKL3si0XAXLPtXYTqouNd',
  userAvatar: adminAvatarImg,
  adminAvatar: adminAvatarImg,
  teacherAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvwhneuUuQDDmGkgTOQ-E7eAAAGJ4RaQQF18Xfd_-l-WLLNMa_gxa3kQZ4QR2XoefKCPOWlLctSlxnjP07a6XVbgxCD93hbxm5WQBYyEYeytyEE082wvAlMioUz1Edlv6tC1nNOyCZAgeW3NGLyxC5ynnev07ruAL4GEdbLHuPJj9tr9fUc1hipl9z9q0ihJLUMs3fmV15aHCtuYZQ0Z-jQHdYL2onl7Xp2jEeiN3oa8ns3Q6BIrm4'
};
