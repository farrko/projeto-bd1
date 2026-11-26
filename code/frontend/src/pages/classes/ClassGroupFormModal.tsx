import { useState, useEffect } from 'react'
import { ComposedModal, ModalHeader, ModalBody, ModalFooter, TextInput, NumberInput, RadioButtonGroup, RadioButton, Button, InlineNotification, Stack } from '@carbon/react'
import { createClassGroup, updateClassGroup, ApiError, type ClassGroup } from '../../api'

interface ClassGroupFormModalProps {
  open: boolean;
  classGroup: ClassGroup | null;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export const ClassGroupFormModal = ({ open, classGroup, onClose, onSuccess }: ClassGroupFormModalProps) => {
  const isEdit = classGroup !== null;

  const [name, setName] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [semester, setSemester] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setErrorMessage(null);

    if (classGroup) {
      setName(classGroup.name);
      setYear(classGroup.year);
      setSemester(classGroup.semester);
    } else {
      setName('');
      setYear(new Date().getFullYear());
      setSemester(1);
    }
  }, [open, classGroup]);

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Class group name is required.');
      return;
    }

    if (!year || Number.isNaN(year)) {
      setErrorMessage('Valid academic year is required.');
      return;
    }

    setSubmitting(true);

    try {
      if (isEdit && classGroup) {
        const updates: Partial<ClassGroup> = {};

        if (name.trim() !== classGroup.name) updates.name = name.trim();
        if (year !== classGroup.year) updates.year = year;
        if (semester !== classGroup.semester) updates.semester = semester;

        await updateClassGroup(classGroup.id, updates);
      } else {
        await createClassGroup({
          name: name.trim(),
          year,
          semester,
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
    <ComposedModal open={open} onClose={onClose} size="sm">
      <ModalHeader
        label="Academic Term"
        title={isEdit ? 'Edit Class Group' : 'New Class Group'}
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
            id="class-group-name"
            labelText="Class Group Name"
            placeholder="e.g. Banco de Dados I - Turma A"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
          />

          <NumberInput
            id="class-group-year"
            label="Year"
            min={2000}
            max={2100}
            step={1}
            value={year}
            onChange={(_e, data) => {
              if (typeof data.value === 'number') {
                setYear(data.value);
              }
            }}
            disabled={submitting}
          />

          <RadioButtonGroup
            name="class-group-semester"
            legendText="Semester"
            valueSelected={String(semester)}
            onChange={(val) => setSemester(val === '2' ? 2 : 1)}
            disabled={submitting}
          >
            <RadioButton id="semester-1" labelText="1st Semester" value="1" />
            <RadioButton id="semester-2" labelText="2nd Semester" value="2" />
          </RadioButtonGroup>
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
