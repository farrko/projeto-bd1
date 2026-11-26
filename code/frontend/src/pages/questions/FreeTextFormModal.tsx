import { useState, useEffect } from 'react'
import { ComposedModal, ModalHeader, ModalBody, ModalFooter, TextArea, Dropdown, Button, InlineNotification, Stack } from '@carbon/react'
import { createFreeTextQuestion, updateFreeTextQuestion, ApiError, type FreeTextQuestion, type Teacher, type UUID } from '../../api'
import { useUserMode } from '../../context/UserModeContext'

interface TeacherDropdownItem {
  id: UUID;
  label: string;
}

interface FreeTextFormModalProps {
  open: boolean;
  question: FreeTextQuestion | null;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export const FreeTextFormModal = ({ open, question, onClose, onSuccess }: FreeTextFormModalProps) => {
  const { mode, teachers, selectedTeacher } = useUserMode();
  const isEdit = question !== null;

  const [statement, setStatement] = useState('');
  const [expectedAnswer, setExpectedAnswer] = useState('');
  const [teacherId, setTeacherId] = useState<UUID>('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setErrorMessage(null);
    if (question) {
      setStatement(question.statement);
      setExpectedAnswer(question.expectedAnswer ?? '');
      setTeacherId(question.teacherId);
    } else {
      setStatement('');
      setExpectedAnswer('');
      setTeacherId(mode === 'TEACHER' && selectedTeacher ? selectedTeacher.id : teachers[0]?.id ?? '');
    }
  }, [open, question, mode, selectedTeacher, teachers]);

  const teacherItems: TeacherDropdownItem[] = teachers.map((t: Teacher) => ({
    id: t.id,
    label: `${t.name} (${t.staffNumber})`,
  }));

  const selectedTeacherItem = teacherItems.find((item) => item.id === teacherId) ?? null;

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!statement.trim()) {
      setErrorMessage('Question statement is required.');
      return;
    }

    if (!teacherId) {
      setErrorMessage('A teacher author must be selected.');
      return;
    }

    setSubmitting(true);
    try {
      const normalizedExpected = expectedAnswer.trim() || null;

      if (isEdit && question) {
        const updates: Partial<FreeTextQuestion> = {};

        if (statement.trim() !== question.statement) updates.statement = statement.trim();

        if (normalizedExpected !== (question.expectedAnswer ?? null)) updates.expectedAnswer = normalizedExpected;

        if (teacherId !== question.teacherId) updates.teacherId = teacherId;

        await updateFreeTextQuestion(question.id, updates);
      } else {
        await createFreeTextQuestion({
          statement: statement.trim(),
          expectedAnswer: normalizedExpected,
          teacherId,
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
  };

  return (
    <ComposedModal open={open} onClose={onClose} size="md">
      <ModalHeader
        label="Free-Text Question"
        title={isEdit ? 'Edit Free-Text Question' : 'New Free-Text Question'}
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

          <Dropdown
            id="ft-question-teacher"
            titleText="Author (Teacher)"
            label="Select teacher"
            items={teacherItems}
            selectedItem={selectedTeacherItem}
            itemToString={(item) => (item ? item.label : '')}
            onChange={(data) => setTeacherId(data.selectedItem?.id ?? '')}
            disabled={submitting || mode === 'TEACHER'}
          />

          <TextArea
            id="ft-question-statement"
            labelText="Question Statement"
            placeholder="Write the open-ended question prompt..."
            rows={4}
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            disabled={submitting}
          />

          <TextArea
            id="ft-question-expected"
            labelText="Expected Answer / Grading Rubric (Optional)"
            placeholder="Reference answer to guide manual grading..."
            rows={3}
            value={expectedAnswer}
            onChange={(e) => setExpectedAnswer(e.target.value)}
            disabled={submitting}
          />
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