import { useState, useEffect, useCallback, useMemo } from 'react'
import { InlineNotification, Stack } from '@carbon/react'
import { getAssignments, getStudentAssignments, getAssessments, getTeacherAssessments, ApiError, type Assignment, type Assessment } from '../../api'
import { useUserMode } from '../../context/UserModeContext'
import { AssignmentsTable } from './AssignmentsTable'

export const AssignmentsPage = () => {
  const { mode, students, selectedTeacher, selectedStudent } = useUserMode();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (mode === 'STUDENT' && !selectedStudent) {
      setAssignments([]);
      setLoading(false);
      return;
    }
    if (mode === 'TEACHER' && !selectedTeacher) {
      setAssignments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (mode === 'STUDENT' && selectedStudent) {
        const [studentAssignments, allAssessments] = await Promise.all([getStudentAssignments(selectedStudent.id), getAssessments()]);
        setAssignments(studentAssignments);
        setAssessments(allAssessments);
      } else if (mode === 'TEACHER' && selectedTeacher) {
        const [allAssignments, teacherAssessments] = await Promise.all([getAssignments(), getTeacherAssessments(selectedTeacher.id)]);
        const ownedIds = new Set(teacherAssessments.map((a) => a.id));
        setAssignments(allAssignments.filter((asg) => ownedIds.has(asg.assessmentId)));
        setAssessments(teacherAssessments);
      } else {
        const [allAssignments, allAssessments] = await Promise.all([getAssignments(), getAssessments()]);
        setAssignments(allAssignments);
        setAssessments(allAssessments);
      }
    } catch (err) {
      setError(err instanceof ApiError ? `${err.code}: ${err.message}` : 'Failed to load assignments.');
    } finally {
      setLoading(false);
    }
  }, [mode, selectedTeacher, selectedStudent]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const assessmentTitleMap = useMemo(() => {
    const map = new Map<string, string>();
    assessments.forEach((a) => map.set(a.id, a.title));
    return map;
  }, [assessments]);

  const studentNameMap = useMemo(() => {
    const map = new Map<string, string>();
    students.forEach((s) => map.set(s.id, `${s.name} (${s.enrollmentNumber})`));
    return map;
  }, [students]);

  const subtitle =
    mode === 'STUDENT' && selectedStudent
      ? `Showing assignments for ${selectedStudent.name}.`
      : mode === 'TEACHER' && selectedTeacher
      ? `Showing student assignments for ${selectedTeacher.name}'s assessments.`
      : 'Showing all assignments across the system.';

  return (
    <Stack gap={6}>
      <div>
        <h2>Assignments</h2>
        <p style={{ color: 'var(--cds-text-secondary)' }}>{subtitle}</p>
      </div>

      {error && (
        <InlineNotification
          kind="error"
          title="Error loading assignments"
          subtitle={error}
          onCloseButtonClick={() => setError(null)}
        />
      )}

      <AssignmentsTable
        assignments={assignments}
        assessmentTitleMap={assessmentTitleMap}
        studentNameMap={studentNameMap}
        mode={mode}
        loading={loading}
      />
    </Stack>
  )
}