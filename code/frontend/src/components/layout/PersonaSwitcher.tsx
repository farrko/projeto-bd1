import { useMemo } from 'react'
import { ContentSwitcher, Switch, Dropdown, InlineLoading } from '@carbon/react'
import { UserAvatar, Education, Group } from '@carbon/icons-react'
import { useUserMode, type ViewMode } from '../../context/UserModeContext'
import type { Teacher, Student } from '../../api'

interface UserDropdownItem {
  id: string;
  label: string;
}

const MODE_OPTIONS: Array<{ name: ViewMode; text: string }> = [
  { name: 'ALL', text: 'All' },
  { name: 'TEACHER', text: 'Teacher' },
  { name: 'STUDENT', text: 'Student' },
];

export const PersonaSwitcher = () => {
  const { mode, setMode, teachers, students, selectedTeacher, selectedStudent, selectTeacherById, selectStudentById, loadingUsers } = useUserMode();

  const selectedModeIndex = useMemo(() =>
    Math.max(0, MODE_OPTIONS.findIndex((opt) => opt.name === mode)),
    [mode]
  );

  const userItems = useMemo<UserDropdownItem[]>(() => {
    if (mode === 'TEACHER') {
      return teachers.map((t: Teacher) => ({
        id: t.id,
        label: `${t.name} (${t.staffNumber})`,
      }));
    }

    if (mode === 'STUDENT') {
      return students.map((s: Student) => ({
        id: s.id,
        label: `${s.name} (${s.enrollmentNumber})`,
      }));
    }

    return [];
  }, [mode, teachers, students]);

  const activeDropdownItem = useMemo<UserDropdownItem | null>(() => {
    if (mode === 'TEACHER' && selectedTeacher) {
      return {
        id: selectedTeacher.id,
        label: `${selectedTeacher.name} (${selectedTeacher.staffNumber})`,
      };
    }

    if (mode === 'STUDENT' && selectedStudent) {
      return {
        id: selectedStudent.id,
        label: `${selectedStudent.name} (${selectedStudent.enrollmentNumber})`,
      };
    }

    return null;
  }, [mode, selectedTeacher, selectedStudent]);

  const handleModeChange = (data: { name?: string | number }) => {
    if (data.name === 'ALL' || data.name === 'TEACHER' || data.name === 'STUDENT') {
      setMode(data.name);
    }
  }

  const handleUserChange = (data: { selectedItem: UserDropdownItem | null }) => {
    const id = data.selectedItem?.id ?? null;

    if (mode === 'TEACHER') {
      selectTeacherById(id);
    } else if (mode === 'STUDENT') {
      selectStudentById(id);
    }
  }

  const renderModeIcon = () => {
    if (mode === 'TEACHER') return <Education size={16} />;
    if (mode === 'STUDENT') return <UserAvatar size={16} />;
    return <Group size={16} />
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingRight: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', color: 'var(--cds-icon-on-color, #fff)' }}>
        {renderModeIcon()}
      </div>

      <div style={{ width: '15rem' }}>
        <ContentSwitcher size="sm" selectedIndex={selectedModeIndex} onChange={handleModeChange}>
          {
            MODE_OPTIONS.map((opt) => (<Switch key={opt.name} name={opt.name} text={opt.text} />))
          }
        </ContentSwitcher>
      </div>

      {mode !== 'ALL' && (
        <div style={{ width: '16rem' }}>
          {loadingUsers ? (
            <InlineLoading description="Loading users..." />
          ) : (
            <Dropdown
              id="persona-user-selector"
              size="sm"
              titleText=""
              hideLabel
              label={mode === 'TEACHER' ? 'Select teacher' : 'Select student'}
              items={userItems}
              selectedItem={activeDropdownItem}
              itemToString={(item) => (item ? item.label : '')}
              onChange={handleUserChange}
              disabled={userItems.length === 0}
            />
          )}
        </div>
      )}
    </div>
  )
}
