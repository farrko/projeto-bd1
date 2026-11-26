import { useState, useEffect } from 'react'
import { ComposedModal, ModalHeader, ModalBody, ModalFooter, TextArea, TextInput, Dropdown, RadioButton, Button, InlineLoading, InlineNotification, Stack } from '@carbon/react'
import { Add, TrashCan } from '@carbon/icons-react'
import { getQuestionAlternatives, createMcqWithAlternatives, updateMcq, changeCorrectAlternative, ApiError, type MultipleChoiceQuestion, type Teacher, type UUID } from '../../api'
import { useUserMode } from '../../context/UserModeContext'

interface TeacherDropdownItem {
  id: UUID;
  label: string;
}

interface AlternativeDraft {
  letter: string;
  text: string;
  isCorrect: boolean;
}

interface McQuestionModalProps {
  open: boolean;
  question: MultipleChoiceQuestion | null;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

const DEFAULT_ALTERNATIVES: AlternativeDraft[] = [
  { letter: 'A', text: '', isCorrect: true },
  { letter: 'B', text: '', isCorrect: false },
];

const nextLetterForIndex = (index: number): string => String.fromCharCode(65 + Math.min(index, 25));

export const McQuestionModal = ({ open, question, onClose, onSuccess }: McQuestionModalProps) => {
  const { mode, teachers, selectedTeacher } = useUserMode();
  const isEdit = question !== null;

  const [statement, setStatement] = useState('');
  const [teacherId, setTeacherId] = useState<UUID>('');
  const [alternatives, setAlternatives] = useState<AlternativeDraft[]>(DEFAULT_ALTERNATIVES);
  const [initialCorrectLetter, setInitialCorrectLetter] = useState<string>('');

  const [loadingAlternatives, setLoadingAlternatives] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setErrorMessage(null);

    if (!question) {
      setStatement('');
      setTeacherId(mode === 'TEACHER' && selectedTeacher ? selectedTeacher.id : teachers[0]?.id ?? '');
      setAlternatives([
        { letter: 'A', text: '', isCorrect: true },
        { letter: 'B', text: '', isCorrect: false },
      ]);
      setInitialCorrectLetter('');
      return;
    }

    setStatement(question.statement);
    setTeacherId(question.teacherId);

    let cancelled = false;
    const loadAlternatives = async () => {
      setLoadingAlternatives(true);
      try {
        const fetched = await getQuestionAlternatives(question.id);
        if (cancelled) return;
        const sorted = [...fetched].sort((a, b) => a.letter.localeCompare(b.letter));
        setAlternatives(
          sorted.map((alt) => ({
            letter: alt.letter,
            text: alt.text,
            isCorrect: alt.isCorrect,
          }))
        );
        const correct = sorted.find((alt) => alt.isCorrect);
        setInitialCorrectLetter(correct?.letter ?? '');
      } catch (err) {
        if (!cancelled) {
          setErrorMessage(err instanceof ApiError ? `${err.code}: ${err.message}` : 'Failed to load alternatives.');
        }
      } finally {
        if (!cancelled) setLoadingAlternatives(false);
      }
    };

    void loadAlternatives();
    return () => {
      cancelled = true;
    }
  }, [open, question, mode, selectedTeacher, teachers]);

  const teacherItems: TeacherDropdownItem[] = teachers.map((t: Teacher) => ({
    id: t.id,
    label: `${t.name} (${t.staffNumber})`,
  }));

  const selectedTeacherItem = teacherItems.find((item) => item.id === teacherId) ?? null;

  const handleAddAlternative = () => {
    if (alternatives.length >= 26) return;
    setAlternatives((prev) => [
      ...prev,
      {
        letter: nextLetterForIndex(prev.length),
        text: '',
        isCorrect: false,
      },
    ]);
  }

  const handleRemoveAlternative = (index: number) => {
    if (alternatives.length <= 2) return;
    setAlternatives((prev) => {
      const filtered = prev.filter((_, idx) => idx !== index);

      if (!filtered.some((a) => a.isCorrect) && filtered.length > 0) {
        filtered[0] = { ...filtered[0], isCorrect: true };
      }

      return filtered;
    });
  }

  const handleLetterChange = (index: number, raw: string) => {
    const clean = raw.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 1);
    setAlternatives((prev) =>
      prev.map((alt, idx) => (idx === index ? { ...alt, letter: clean } : alt))
    );
  }

  const handleTextChange = (index: number, text: string) => {
    setAlternatives((prev) =>
      prev.map((alt, idx) => (idx === index ? { ...alt, text } : alt))
    );
  }

  const handleSelectCorrect = (index: number) => {
    setAlternatives((prev) =>
      prev.map((alt, idx) => ({ ...alt, isCorrect: idx === index }))
    );
  }

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

    const correctAlt = alternatives.find((a) => a.isCorrect);
    if (!correctAlt) {
      setErrorMessage('Exactly one alternative must be marked as correct.');
      return;
    }

    if (!isEdit) {
      if (alternatives.length < 2) {
        setErrorMessage('At least 2 alternatives are required.');
        return;
      }
      const letters = new Set<string>();
      for (const alt of alternatives) {
        if (!/^[A-Z]$/.test(alt.letter)) {
          setErrorMessage('All alternative letters must be a single uppercase A-Z character.');
          return;
        }

        if (letters.has(alt.letter)) {
          setErrorMessage(`Duplicate alternative letter "${alt.letter}".`);
          return;
        }

        letters.add(alt.letter);
        if (!alt.text.trim()) {
          setErrorMessage(`Alternative ${alt.letter} cannot have empty text.`);
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      if (isEdit && question) {
        const updates: Partial<MultipleChoiceQuestion> = {};
        if (statement.trim() !== question.statement) {
          updates.statement = statement.trim();
        }

        if (teacherId !== question.teacherId) {
          updates.teacherId = teacherId;
        }

        if (Object.keys(updates).length > 0) {
          await updateMcq(question.id, updates);
        }

        if (correctAlt.letter !== initialCorrectLetter) {
          await changeCorrectAlternative(question.id, correctAlt.letter);
        }
      } else {
        await createMcqWithAlternatives({
          question: {
            statement: statement.trim(),
            teacherId,
            type: 'MULTIPLE_CHOICE',
          },
          alternatives: alternatives.map((a) => ({
            letter: a.letter,
            text: a.text.trim(),
            isCorrect: a.isCorrect,
          })),
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
    <ComposedModal open={open} onClose={onClose} size="lg">
      <ModalHeader
        label="Multiple-Choice Question"
        title={isEdit ? 'Edit Multiple-Choice Question' : 'New Multiple-Choice Question'}
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
            id="mc-question-teacher"
            titleText="Author (Teacher)"
            label="Select teacher"
            items={teacherItems}
            selectedItem={selectedTeacherItem}
            itemToString={(item) => (item ? item.label : '')}
            onChange={(data) => setTeacherId(data.selectedItem?.id ?? '')}
            disabled={submitting || mode === 'TEACHER'}
          />

          <TextArea
            id="mc-question-statement"
            labelText="Question Statement"
            placeholder="Write the multiple-choice question prompt..."
            rows={3}
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            disabled={submitting}
          />

          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem',
              }}
            >
              <strong>
                Alternatives (select the correct answer)
              </strong>
              {!isEdit && (
                <Button
                  kind="tertiary"
                  size="sm"
                  renderIcon={Add}
                  onClick={handleAddAlternative}
                  disabled={submitting || alternatives.length >= 26}
                >
                  Add Alternative
                </Button>
              )}
            </div>

            {loadingAlternatives ? (
              <InlineLoading description="Loading alternatives..." />
            ) : (
              <Stack gap={3}>
                {alternatives.map((alt, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <RadioButton
                      id={`mc-correct-${idx}`}
                      name="mc-correct-alternative"
                      labelText=""
                      checked={alt.isCorrect}
                      onChange={() => handleSelectCorrect(idx)}
                      disabled={submitting}
                    />

                    <div style={{ width: '4.5rem' }}>
                      <TextInput
                        id={`mc-letter-${idx}`}
                        labelText=""
                        hideLabel
                        placeholder="A"
                        value={alt.letter}
                        onChange={(e) => handleLetterChange(idx, e.target.value)}
                        disabled={submitting || isEdit}
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <TextInput
                        id={`mc-text-${idx}`}
                        labelText=""
                        hideLabel
                        placeholder={`Option ${alt.letter || idx + 1} text...`}
                        value={alt.text}
                        onChange={(e) => handleTextChange(idx, e.target.value)}
                        disabled={submitting || isEdit}
                      />
                    </div>

                    {!isEdit && (
                      <Button
                        kind="danger--ghost"
                        size="sm"
                        hasIconOnly
                        renderIcon={TrashCan}
                        iconDescription="Remove alternative"
                        onClick={() => handleRemoveAlternative(idx)}
                        disabled={submitting || alternatives.length <= 2}
                      />
                    )}
                  </div>
                ))}
              </Stack>
            )}
          </div>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          kind="primary"
          onClick={handleSubmit}
          disabled={submitting || loadingAlternatives}
        >
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create'}
        </Button>
      </ModalFooter>
    </ComposedModal>
  )
}
