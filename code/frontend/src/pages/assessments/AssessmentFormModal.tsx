import { useState, useEffect } from 'react'
import { ComposedModal, ModalHeader, ModalBody, ModalFooter, TextInput, TextArea, Dropdown, Button, InlineNotification, Stack } from '@carbon/react'
import { createAssessment, updateAssessment, ApiError, type Assessment, type ClassGroup, type Teacher, type UUID } from '../../api'
import { useUserMode } from '../../context/UserModeContext'

interface DropdownItem {
  id: string;
  label: string;
}

interface AssessmentFormModalProps {
  open: boolean;
  assessment: Assessment | null;
  classGroups: ClassGroup[];
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

const EXTRA_CLASS_ID = '__EXTRA__';

const normalizeTime = (raw: string): string => {
  const trimmed = raw.trim();
  if (/^\d{2}:\d{2}$/.test(trimmed)) return `${trimmed}:00`;
  return trimmed;
};

export const AssessmentFormModal = ({ open, assessment, classGroups, onClose, onSuccess }: AssessmentFormModalProps) => {
  const { mode, teachers, selectedTeacher } = useUserMode();
  const isEdit = assessment !== null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assessmentDate, setAssessmentDate] = useState('');
  const [startTime, setStartTime] = useState('08:00:00');
  const [endTime, setEndTime] = useState('10:00:00');
  const [teacherId, setTeacherId] = useState<UUID>('');
  const [classSelectionId, setClassSelectionId] = useState<string>(EXTRA_CLASS_ID);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setErrorMessage(null);

    if (assessment) {
      setTitle(assessment.title);
      setDescription(assessment.description ?? '');
      setAssessmentDate(assessment.assessmentDate);
      setStartTime(assessment.startTime);
      setEndTime(assessment.endTime);
      setTeacherId(assessment.teacherId);
      setClassSelectionId(assessment.classGroupId ?? EXTRA_CLASS_ID);
    } else {
      setTitle('');
      setDescription('');
      setAssessmentDate(new Date().toISOString().slice(0, 10));
      setStartTime('08:00:00');
      setEndTime('10:00:00');
      setTeacherId(mode === 'TEACHER' && selectedTeacher ? selectedTeacher.id : teachers[0]?.id ?? '');
      setClassSelectionId(EXTRA_CLASS_ID);
    }
  }, [open, assessment, mode, selectedTeacher, teachers]);

  const teacherItems: DropdownItem[] = teachers.map((t: Teacher) => ({
    id: t.id,
    label: `${t.name} (${t.staffNumber})`,
  }));

  const classItems: DropdownItem[] = [
    { id: EXTRA_CLASS_ID, label: 'None (Extra / Individual Assessment)' },
    ...classGroups.map((cg) => ({
      id: cg.id,
      label: `${cg.name} (${cg.year}/${cg.semester})`,
    })),
  ];

  const selectedTeacherItem = teacherItems.find((item) => item.id === teacherId) ?? null;

  const selectedClassItem = classItems.find((item) => item.id === classSelectionId) ?? classItems[0];

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Assessment title is required.');
      return;
    }

    if (!assessmentDate.trim()) {
      setErrorMessage('Assessment date is required (YYYY-MM-DD).');
      return;
    }

    if (!startTime.trim() || !endTime.trim()) {
      setErrorMessage('Start and end times are required (HH:MM:SS).');
      return;
    }

    if (!teacherId) {
      setErrorMessage('A teacher author must be selected.');
      return;
    }

    const normalizedDesc = description.trim() || null;
    const normalizedStart = normalizeTime(startTime);
    const normalizedEnd = normalizeTime(endTime);
    const resolvedClassGroupId = classSelectionId === EXTRA_CLASS_ID ? null : classSelectionId;

    setSubmitting(true);
    try {
      if (isEdit && assessment) {
        const updates: Partial<Assessment> = {};

        if (title.trim() !== assessment.title) updates.title = title.trim();
        if (normalizedDesc !== (assessment.description ?? null)) updates.description = normalizedDesc;
        if (assessmentDate.trim() !== assessment.assessmentDate) updates.assessmentDate = assessmentDate.trim();
        if (normalizedStart !== assessment.startTime) updates.startTime = normalizedStart;
        if (normalizedEnd !== assessment.endTime) updates.endTime = normalizedEnd;
        if (teacherId !== assessment.teacherId) updates.teacherId = teacherId;
        if (resolvedClassGroupId !== assessment.classGroupId) updates.classGroupId = resolvedClassGroupId;

        await updateAssessment(assessment.id, updates);
      } else {
        await createAssessment({
          title: title.trim(),
          description: normalizedDesc,
          assessmentDate: assessmentDate.trim(),
          startTime: normalizedStart,
          endTime: normalizedEnd,
          teacherId,
          classGroupId: resolvedClassGroupId,
        });
      }

      await onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(`${err.code}: ${err.message}`);
      } else {
        setErrorMessage(err instanceof Error ? err.message : 'Operation failed.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ComposedModal open={open} onClose={onClose} size="md">
      <ModalHeader
        label="Evaluation"
        title={isEdit ? 'Edit Assessment' : 'New Assessment'}
      />
      <ModalBody>
        <Stack gap={5}>
          {errorMessage && (
            <InlineNotification
              kind="error"
              title="Request Failed"
              subtitle={errorMessage}
              onCloseButtonClick={() => setErrorMessage(null)}
            />
          )}

          <TextInput
            id="assessment-title"
            labelText="Title"
            placeholder="e.g. Prova 1 - Modelagem Relacional"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
          />

          <TextArea
            id="assessment-description"
            labelText="Description (Optional)"
            placeholder="Instructions or topics covered..."
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
          />

          <Dropdown
            id="assessment-teacher"
            titleText="Teacher"
            label="Select teacher"
            items={teacherItems}
            selectedItem={selectedTeacherItem}
            itemToString={(item) => (item ? item.label : '')}
            onChange={(data) => setTeacherId(data.selectedItem?.id ?? '')}
            disabled={submitting || mode === 'TEACHER'}
          />

          <Dropdown
            id="assessment-class-group"
            titleText="Target Class Group"
            helperText="Class-bound assessments auto-assign all enrolled students via trigger. Extra assessments allow manual student assignment."
            label="Select class group"
            items={classItems}
            selectedItem={selectedClassItem}
            itemToString={(item) => (item ? item.label : '')}
            onChange={(data) =>
              setClassSelectionId(data.selectedItem?.id ?? EXTRA_CLASS_ID)
            }
            disabled={submitting}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '0.75rem',
            }}
          >
            <TextInput
              id="assessment-date"
              type="date"
              labelText="Date"
              value={assessmentDate}
              onChange={(e) => setAssessmentDate(e.target.value)}
              disabled={submitting}
            />

            <TextInput
              id="assessment-start-time"
              type="time"
              step={1}
              labelText="Start Time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              disabled={submitting}
            />

            <TextInput
              id="assessment-end-time"
              type="time"
              step={1}
              labelText="End Time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              disabled={submitting}
            />
          </div>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button kind="primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create'}
        </Button>
      </ModalFooter>
    </ComposedModal>
  )
}