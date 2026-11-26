import { useState, useEffect, useCallback, useMemo } from 'react'
import { Navigate } from 'react-router'
import { InlineNotification, Stack } from '@carbon/react'
import { getAssessments, getTeacherAssessments, getClassGroups, ApiError, type Assessment, type ClassGroup } from '../../api'
import { useUserMode } from '../../context/UserModeContext'
import { AssessmentsTable } from './AssessmentsTable'
import { AssessmentFormModal } from './AssessmentFormModal'

export const AssessmentsPage = () => {
  const { mode, teachers, selectedTeacher } = useUserMode();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [classGroups, setClassGroups] = useState<ClassGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formState, setFormState] = useState<{ open: boolean; assessment: Assessment | null; }>({ open: false, assessment: null });

  const fetchData = useCallback(async () => {
    if (mode === 'STUDENT') return;
    if (mode === 'TEACHER' && !selectedTeacher) {
      setAssessments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [fetchedAssessments, fetchedClasses] = await Promise.all([
        mode === 'TEACHER' && selectedTeacher ? getTeacherAssessments(selectedTeacher.id) : getAssessments(),
        getClassGroups(),
      ]);
      setAssessments(fetchedAssessments);
      setClassGroups(fetchedClasses);
    } catch (err) {
      setError(err instanceof ApiError ? `${err.code}: ${err.message}` : 'Failed to load assessments.');
    } finally {
      setLoading(false);
    }
  }, [mode, selectedTeacher]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const teacherNameMap = useMemo(() => {
    const map = new Map<string, string>();
    teachers.forEach((t) => map.set(t.id, t.name));
    return map;
  }, [teachers]);

  const classNameMap = useMemo(() => {
    const map = new Map<string, string>();
    classGroups.forEach((cg) => map.set(cg.id, `${cg.name} (${cg.year}/${cg.semester})`));
    return map;
  }, [classGroups]);

  if (mode === 'STUDENT') return <Navigate to="/assignments" replace />

  return (
    <Stack gap={6}>
      <div>
        <h2>Assessments</h2>
        <p style={{ color: 'var(--cds-text-secondary)' }}>
          {mode === 'TEACHER' && selectedTeacher
            ? `Showing evaluations created by ${selectedTeacher.name}.`
            : 'Showing all evaluations across all teachers and class groups.'}
        </p>
      </div>

      {error && (
        <InlineNotification
          kind="error"
          title="Error loading assessments"
          subtitle={error}
          onCloseButtonClick={() => setError(null)}
        />
      )}

      <AssessmentsTable
        assessments={assessments}
        teacherNameMap={teacherNameMap}
        classNameMap={classNameMap}
        loading={loading}
        onAdd={() => setFormState({ open: true, assessment: null })}
        onEdit={(a) => setFormState({ open: true, assessment: a })}
      />

      <AssessmentFormModal
        open={formState.open}
        assessment={formState.assessment}
        classGroups={classGroups}
        onClose={() => setFormState((prev) => ({ ...prev, open: false }))}
        onSuccess={fetchData}
      />
    </Stack>
  )
}
