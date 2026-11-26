import { useState } from 'react'
import { Navigate } from 'react-router'
import { Tabs, TabList, Tab, TabPanels, TabPanel, InlineNotification, Stack } from '@carbon/react'
import { useUserMode } from '../../context/UserModeContext'
import type { Teacher, Student, Role } from '../../api'
import { UsersTable } from './UsersTable'
import { UserFormModal } from './UserFormModal'
import { UserActivityModal } from './UserActivityModal'

type UserRecord = Teacher | Student;

export const UsersPage = () => {
  const { mode, teachers, students, loadingUsers, usersError, refreshUsers } = useUserMode();

  const [formState, setFormState] = useState<{ open: boolean; role: Role; user: UserRecord | null; }>({ open: false, role: 'TEACHER', user: null });
  const [inspectedUser, setInspectedUser] = useState<UserRecord | null>(null);

  if (mode !== 'ALL') {
    return <Navigate to="/assignments" replace />
  }

  const openCreateModal = (role: Role) => {
    setFormState({ open: true, role, user: null });
  }

  const openEditModal = (user: UserRecord) => {
    setFormState({ open: true, role: user.role, user });
  }

  const closeFormModal = () => {
    setFormState((prev) => ({ ...prev, open: false }));
  }

  return (
    <Stack gap={6}>
      <div>
        <h2>Users Directory</h2>
        <p style={{ color: 'var(--cds-text-secondary)' }}>
          Manage teachers and students across the system.
        </p>
      </div>

      {usersError && (
        <InlineNotification
          kind="error"
          title="Error loading users"
          subtitle={usersError}
          hideCloseButton
        />
      )}

      <Tabs>
        <TabList aria-label="User roles">
          <Tab>Teachers ({teachers.length})</Tab>
          <Tab>Students ({students.length})</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <UsersTable
              role="TEACHER"
              users={teachers}
              loading={loadingUsers}
              onAdd={() => openCreateModal('TEACHER')}
              onEdit={openEditModal}
              onInspect={setInspectedUser}
            />
          </TabPanel>
          <TabPanel>
            <UsersTable
              role="STUDENT"
              users={students}
              loading={loadingUsers}
              onAdd={() => openCreateModal('STUDENT')}
              onEdit={openEditModal}
              onInspect={setInspectedUser}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <UserFormModal
        open={formState.open}
        role={formState.role}
        user={formState.user}
        onClose={closeFormModal}
        onSuccess={refreshUsers}
      />

      <UserActivityModal
        open={inspectedUser !== null}
        user={inspectedUser}
        onClose={() => setInspectedUser(null)}
      />
    </Stack>
  )
}
