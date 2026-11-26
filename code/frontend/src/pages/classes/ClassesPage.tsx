import { useState, useEffect, useCallback } from 'react'
import { Navigate } from 'react-router'
import { InlineNotification, Stack } from '@carbon/react'
import { getClassGroups, ApiError, type ClassGroup } from '../../api'
import { useUserMode } from '../../context/UserModeContext'
import { ClassGroupsTable } from './ClassGroupsTable'
import { ClassGroupFormModal } from './ClassGroupFormModal'
import { ClassGroupDetailsModal } from './ClassGroupDetailsModal'

export const ClassesPage = () => {
  const { mode } = useUserMode();

  const [classGroups, setClassGroups] = useState<ClassGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formState, setFormState] = useState<{ open: boolean; classGroup: ClassGroup | null; }>({ open: false, classGroup: null });
  const [inspectedGroup, setInspectedGroup] = useState<ClassGroup | null>(null);

  const fetchClassGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClassGroups();
      setClassGroups(data);
    } catch (err) {
      setError(err instanceof ApiError ? `${err.code}: ${err.message}` : 'Failed to load class groups.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mode === 'STUDENT') return;
    void fetchClassGroups();
  }, [mode, fetchClassGroups]);

  if (mode === 'STUDENT') return <Navigate to="/assignments" replace />

  return (
    <Stack gap={6}>
      <div>
        <h2>Class Groups</h2>
        <p style={{ color: 'var(--cds-text-secondary)' }}>
          Manage academic cohorts, student enrollments, and class-bound assessments.
        </p>
      </div>

      {error && (
        <InlineNotification
          kind="error"
          title="Error loading class groups"
          subtitle={error}
          onCloseButtonClick={() => setError(null)}
        />
      )}

      <ClassGroupsTable
        classGroups={classGroups}
        loading={loading}
        onAdd={() => setFormState({ open: true, classGroup: null })}
        onEdit={(cg) => setFormState({ open: true, classGroup: cg })}
        onManageRoster={(cg) => setInspectedGroup(cg)}
      />

      <ClassGroupFormModal
        open={formState.open}
        classGroup={formState.classGroup}
        onClose={() => setFormState((prev) => ({ ...prev, open: false }))}
        onSuccess={fetchClassGroups}
      />

      <ClassGroupDetailsModal
        open={inspectedGroup !== null}
        classGroup={inspectedGroup}
        onClose={() => setInspectedGroup(null)}
      />
    </Stack>
  )
}