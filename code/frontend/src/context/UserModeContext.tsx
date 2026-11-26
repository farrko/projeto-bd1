import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { getTeachers, getStudents } from '../api';
import type { Teacher, Student, UUID } from '../api';

export type ViewMode = 'ALL' | 'TEACHER' | 'STUDENT';

export interface UserModeContextValue {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
  teachers: Teacher[];
  students: Student[];
  selectedTeacher: Teacher | null;
  selectedStudent: Student | null;
  selectTeacherById: (id: UUID | null) => void;
  selectStudentById: (id: UUID | null) => void;
  loadingUsers: boolean;
  usersError: string | null;
  refreshUsers: () => Promise<void>;
}

const STORAGE_KEY = 'app.userModeState';

interface StoredState {
  mode: ViewMode;
  teacherId: UUID | null;
  studentId: UUID | null;
}

const UserModeContext = createContext<UserModeContextValue | undefined>(undefined);

const readStoredState = (): StoredState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { mode: 'ALL', teacherId: null, studentId: null };

    const parsed = JSON.parse(raw) as Partial<StoredState>;
    const mode: ViewMode = parsed.mode === 'TEACHER' || parsed.mode === 'STUDENT' || parsed.mode === 'ALL' ? parsed.mode : 'ALL';

    return {
      mode,
      teacherId: parsed.teacherId ?? null,
      studentId: parsed.studentId ?? null,
    }
  } catch {
    return { mode: 'ALL', teacherId: null, studentId: null };
  }
}

export const UserModeProvider = ({ children }: { children: ReactNode }) => {
  const initial = useMemo(() => readStoredState(), []);

  const [mode, setModeState] = useState<ViewMode>(initial.mode);
  const [selectedTeacherId, setSelectedTeacherId] = useState<UUID | null>(initial.teacherId);
  const [selectedStudentId, setSelectedStudentId] = useState<UUID | null>(initial.studentId);

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  const refreshUsers = useCallback(async () => {
    setLoadingUsers(true);
    setUsersError(null);

    try {
      const [fetchedTeachers, fetchedStudents] = await Promise.all([getTeachers(), getStudents()]);
      setTeachers(fetchedTeachers);
      setStudents(fetchedStudents);

      setSelectedTeacherId((prev) => {
        if (prev && fetchedTeachers.some((t) => t.id === prev)) return prev;
        return fetchedTeachers[0]?.id ?? null;
      });

      setSelectedStudentId((prev) => {
        if (prev && fetchedStudents.some((s) => s.id === prev)) return prev;
        return fetchedStudents[0]?.id ?? null;
      });
    } catch (err) {
      setUsersError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    void refreshUsers();
  }, [refreshUsers]);

  useEffect(() => {
    const state: StoredState = {
      mode,
      teacherId: selectedTeacherId,
      studentId: selectedStudentId,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [mode, selectedTeacherId, selectedStudentId]);

  const setMode = useCallback((nextMode: ViewMode) => {
    setModeState(nextMode);
  }, []);

  const selectTeacherById = useCallback((id: UUID | null) => {
    setSelectedTeacherId(id);
  }, []);

  const selectStudentById = useCallback((id: UUID | null) => {
    setSelectedStudentId(id);
  }, []);

  const selectedTeacher = useMemo(() => {
    return teachers.find((t) => t.id === selectedTeacherId) ?? null
  }, [teachers, selectedTeacherId]);

  const selectedStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) ?? null
  }, [students, selectedStudentId]);

  const value = useMemo<UserModeContextValue>(() => ({ mode, setMode, teachers, students, selectedTeacher, selectedStudent, selectTeacherById, selectStudentById, loadingUsers, usersError, refreshUsers }),
    [mode, setMode, teachers, students, selectedTeacher, selectedStudent, selectTeacherById, selectStudentById, loadingUsers, usersError, refreshUsers]
  );

  return <UserModeContext.Provider value={value}>{children}</UserModeContext.Provider>;
}

export const useUserMode = (): UserModeContextValue => {
  const ctx = useContext(UserModeContext);

  if (!ctx) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }

  return ctx;
}
