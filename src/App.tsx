/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole, Student, ClassRoom, Major, AttendanceStatus } from './types';
import { INITIAL_STUDENTS, INITIAL_CLASSES, INITIAL_MAJORS, APP_ASSETS } from './data/mockData';
import { Sidebar, NavTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { AttendanceView } from './components/AttendanceView';
import { ReportsView } from './components/ReportsView';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { ClassesView } from './components/ClassesView';
import { MajorsView } from './components/MajorsView';
import { LoginScreen } from './components/LoginScreen';
import { StudentProfileModal } from './components/StudentProfileModal';
import { AddStudentModal } from './components/AddStudentModal';
import { ImportStudentsModal } from './components/ImportStudentsModal';
import { SettingsModal } from './components/SettingsModal';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Authentication State - Default to Login Screen on initial entry
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const savedAuth = localStorage.getItem('smart_school_auth_logged_in');
      return savedAuth === 'true';
    } catch {
      return false;
    }
  });
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const savedRole = localStorage.getItem('smart_school_auth_role') as UserRole;
      return savedRole || 'admin';
    } catch {
      return 'admin';
    }
  });
  const [userName, setUserName] = useState<string>(() => {
    try {
      const savedName = localStorage.getItem('smart_school_auth_user');
      return savedName || 'អ្នកគ្រប់គ្រង (Admin)';
    } catch {
      return 'អ្នកគ្រប់គ្រង (Admin)';
    }
  });
  const [adminAvatar, setAdminAvatar] = useState<string>(() => {
    try {
      const savedAvatar = localStorage.getItem('smart_school_admin_avatar');
      return savedAvatar || APP_ASSETS.adminAvatar;
    } catch {
      return APP_ASSETS.adminAvatar;
    }
  });

  const handleUpdateAdminAvatar = (url: string) => {
    setAdminAvatar(url);
    try {
      localStorage.setItem('smart_school_admin_avatar', url);
    } catch {
      // safe fallback
    }
  };

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('attendance');

  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Global search
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState<boolean>(false);
  const [isImportExcelOpen, setIsImportExcelOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Data state with localStorage persistence
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('smart_school_students');
      if (saved) {
        const parsed: Student[] = JSON.parse(saved);
        // Ensure all 11 fields exist by merging with INITIAL_STUDENTS defaults
        return parsed.map((s) => {
          const matchInitial = INITIAL_STUDENTS.find((init) => init.id === s.id);
          return {
            ...matchInitial,
            ...s,
            chineseName: s.chineseName || matchInitial?.chineseName || '',
            major: s.major || matchInitial?.major || 'គរុកោសល្យភាសាចិន',
            generation: s.generation || matchInitial?.generation || 'ជំនាន់ទី ៣',
            yearLevel: s.yearLevel || matchInitial?.yearLevel || 'ឆ្នាំទី ៤',
            semester: s.semester || matchInitial?.semester || 'ឆមាសទី ១',
            shift: s.shift || matchInitial?.shift || 'វេនព្រឹក',
            dob: s.dob || matchInitial?.dob || '2004-05-15'
          };
        });
      }
      return INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [classes, setClasses] = useState<ClassRoom[]>(() => {
    try {
      const saved = localStorage.getItem('smart_school_classes');
      return saved ? JSON.parse(saved) : INITIAL_CLASSES;
    } catch {
      return INITIAL_CLASSES;
    }
  });

  const [majors, setMajors] = useState<Major[]>(() => {
    try {
      const saved = localStorage.getItem('smart_school_majors');
      return saved ? JSON.parse(saved) : INITIAL_MAJORS;
    } catch {
      return INITIAL_MAJORS;
    }
  });

  const [savedAttendances, setSavedAttendances] = useState<
    Record<string, Record<string, { status: AttendanceStatus; note?: string }>>
  >(() => {
    try {
      const saved = localStorage.getItem('smart_school_attendance');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Dark mode class sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist students
  useEffect(() => {
    try {
      localStorage.setItem('smart_school_students', JSON.stringify(students));
    } catch {
      // safe fallback
    }
  }, [students]);

  // Persist classes
  useEffect(() => {
    try {
      localStorage.setItem('smart_school_classes', JSON.stringify(classes));
    } catch {
      // safe fallback
    }
  }, [classes]);

  // Persist majors
  useEffect(() => {
    try {
      localStorage.setItem('smart_school_majors', JSON.stringify(majors));
    } catch {
      // safe fallback
    }
  }, [majors]);

  // Persist attendances
  useEffect(() => {
    try {
      localStorage.setItem('smart_school_attendance', JSON.stringify(savedAttendances));
    } catch {
      // safe fallback
    }
  }, [savedAttendances]);

  const handleLogin = (role: UserRole, name: string) => {
    setUserRole(role);
    setUserName(name);
    setIsLoggedIn(true);
    try {
      localStorage.setItem('smart_school_auth_logged_in', 'true');
      localStorage.setItem('smart_school_auth_role', role);
      localStorage.setItem('smart_school_auth_user', name);
    } catch {
      // safe fallback
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem('smart_school_auth_logged_in');
      localStorage.removeItem('smart_school_auth_role');
      localStorage.removeItem('smart_school_auth_user');
    } catch {
      // safe fallback
    }
  };

  const handleSaveAttendance = (
    classId: string,
    date: string,
    records: Record<string, { status: AttendanceStatus; note?: string }>
  ) => {
    const key = `${classId}_${date}`;
    setSavedAttendances((prev) => ({
      ...prev,
      [key]: records
    }));
  };

  const handleAddClass = (newClassData: Omit<ClassRoom, 'id'>) => {
    const newClass: ClassRoom = {
      ...newClassData,
      id: `c-${Date.now()}`
    };
    setClasses((prev) => [...prev, newClass]);
  };

  const handleUpdateClass = (updatedClass: ClassRoom) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === updatedClass.id ? updatedClass : c))
    );
    // If class name changed, also update students who have that class
    setStudents((prev) =>
      prev.map((s) => {
        if (s.classId === updatedClass.id) {
          return { ...s, className: updatedClass.nameKhmer };
        }
        return s;
      })
    );
  };

  const handleDeleteClass = (classId: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== classId));
  };

  const handleAddMajor = (newMajorData: Omit<Major, 'id'>) => {
    const newMajor: Major = {
      ...newMajorData,
      id: `m-${Date.now()}`
    };
    setMajors((prev) => [...prev, newMajor]);
  };

  const handleUpdateMajor = (updatedMajor: Major) => {
    const oldMajor = majors.find((m) => m.id === updatedMajor.id);
    setMajors((prev) =>
      prev.map((m) => (m.id === updatedMajor.id ? updatedMajor : m))
    );
    // If major name changed, also update students with old major name
    if (oldMajor && oldMajor.nameKhmer !== updatedMajor.nameKhmer) {
      setStudents((prev) =>
        prev.map((s) => {
          if (s.major === oldMajor.nameKhmer || s.major === oldMajor.code) {
            return { ...s, major: updatedMajor.nameKhmer };
          }
          return s;
        })
      );
    }
  };

  const handleDeleteMajor = (majorId: string) => {
    setMajors((prev) => prev.filter((m) => m.id !== majorId));
  };

  const handleAddStudent = (newStudentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...newStudentData,
      id: `s-${Date.now()}`
    };
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (selectedStudentForModal?.id === id) {
      setSelectedStudentForModal(null);
    }
  };

  const handleDeleteMultipleStudents = (ids: string[]) => {
    const idSet = new Set(ids);
    setStudents((prev) => prev.filter((s) => !idSet.has(s.id)));
    if (selectedStudentForModal && idSet.has(selectedStudentForModal.id)) {
      setSelectedStudentForModal(null);
    }
  };

  const handleDeleteAllStudents = () => {
    setStudents([]);
    setSelectedStudentForModal(null);
  };

  const handleResetSampleData = () => {
    setStudents(INITIAL_STUDENTS);
    setClasses(INITIAL_CLASSES);
    setMajors(INITIAL_MAJORS);
  };

  const handleImportStudents = (
    importedStudents: Omit<Student, 'id'>[],
    mode: 'append' | 'replace'
  ) => {
    setStudents((prev) => {
      if (mode === 'replace') {
        const studentMap = new Map<string, Student>();
        // Key by studentCode
        prev.forEach((s) => studentMap.set(s.studentCode.trim().toLowerCase(), s));

        importedStudents.forEach((newS, idx) => {
          const key = newS.studentCode.trim().toLowerCase();
          const existing = studentMap.get(key);
          const fullStudent: Student = {
            ...newS,
            id: existing ? existing.id : `s-imp-${Date.now()}-${idx}`
          };
          studentMap.set(key, fullStudent);
        });
        return Array.from(studentMap.values());
      } else {
        const newEntries: Student[] = importedStudents.map((newS, idx) => ({
          ...newS,
          id: `s-imp-${Date.now()}-${idx}`
        }));
        return [...newEntries, ...prev];
      }
    });
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 min-h-screen flex transition-colors duration-200 selection:bg-indigo-500 selection:text-white antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        userRole={userRole}
        userName={userName}
        adminAvatar={adminAvatar}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-[260px] flex flex-col min-h-screen">
        {/* Top Navbar */}
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          userRole={userRole}
          userName={userName}
          adminAvatar={adminAvatar}
          onUpdateAdminAvatar={handleUpdateAdminAvatar}
          onLogout={handleLogout}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onSelectTab={setCurrentTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* View Content Router */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1600px] w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {currentTab === 'attendance' && (
                <AttendanceView
                  students={students}
                  classes={classes}
                  onSaveAttendance={handleSaveAttendance}
                  savedAttendances={savedAttendances}
                  onOpenStudentModal={setSelectedStudentForModal}
                />
              )}

              {currentTab === 'reports' && (
                <ReportsView
                  students={students}
                  classes={classes}
                  onOpenStudentModal={setSelectedStudentForModal}
                />
              )}

              {currentTab === 'dashboard' && (
                <DashboardView
                  students={students}
                  classes={classes}
                  userRole={userRole}
                  userName={userName}
                  onNavigate={setCurrentTab}
                  onOpenAddStudent={() => setIsAddStudentOpen(true)}
                  onOpenImportExcel={() => setIsImportExcelOpen(true)}
                />
              )}

              {currentTab === 'students' && (
                <StudentsView
                  students={students}
                  classes={classes}
                  majors={majors}
                  onOpenStudentModal={setSelectedStudentForModal}
                  onOpenAddStudent={() => setIsAddStudentOpen(true)}
                  onOpenImportExcel={() => setIsImportExcelOpen(true)}
                  onDeleteStudent={handleDeleteStudent}
                  onDeleteMultipleStudents={handleDeleteMultipleStudents}
                  onDeleteAllStudents={handleDeleteAllStudents}
                />
              )}

              {currentTab === 'classes' && (
                <ClassesView
                  classes={classes}
                  students={students}
                  onSelectClassToRecord={(classId) => {
                    setCurrentTab('attendance');
                  }}
                  onAddClass={handleAddClass}
                  onUpdateClass={handleUpdateClass}
                  onDeleteClass={handleDeleteClass}
                />
              )}

              {currentTab === 'majors' && (
                <MajorsView
                  majors={majors}
                  students={students}
                  onAddMajor={handleAddMajor}
                  onUpdateMajor={handleUpdateMajor}
                  onDeleteMajor={handleDeleteMajor}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Modals */}
      <StudentProfileModal
        student={selectedStudentForModal}
        onClose={() => setSelectedStudentForModal(null)}
        onDeleteStudent={handleDeleteStudent}
      />

      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        classes={classes}
        majors={majors}
        onAddStudent={handleAddStudent}
      />

      <ImportStudentsModal
        isOpen={isImportExcelOpen}
        onClose={() => setIsImportExcelOpen(false)}
        classes={classes}
        onImportStudents={handleImportStudents}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        adminAvatar={adminAvatar}
        onUpdateAdminAvatar={handleUpdateAdminAvatar}
        onDeleteAllStudents={handleDeleteAllStudents}
        onResetSampleData={handleResetSampleData}
      />
    </div>
  );
}
