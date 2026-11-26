import { useState, useEffect, useCallback, useMemo } from 'react'
import { Navigate } from 'react-router'
import { ContentSwitcher, Switch, InlineNotification, Stack } from '@carbon/react';
import { getQuestions, getMultipleChoiceQuestions, getFreeTextQuestions, ApiError, type Question, type FreeTextQuestion, type MultipleChoiceQuestion } from '../../api'
import { useUserMode } from '../../context/UserModeContext'
import { QuestionsTable, type QuestionFilterType } from './QuestionsTable'
import { FreeTextFormModal } from './FreeTextFormModal'
import { McQuestionModal } from './McQuestionModal'

type AnyQuestion = Question | FreeTextQuestion | MultipleChoiceQuestion;

const FILTER_OPTIONS: Array<{ name: QuestionFilterType; text: string }> = [
  { name: 'ALL', text: 'All Questions' },
  { name: 'MULTIPLE_CHOICE', text: 'Multiple Choice' },
  { name: 'FREE_TEXT', text: 'Free Text' },
];

export const QuestionsPage = () => {
  const { mode, teachers, selectedTeacher } = useUserMode();

  const [filterType, setFilterType] = useState<QuestionFilterType>('ALL');
  const [questions, setQuestions] = useState<AnyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [ftModalState, setFtModalState] = useState<{ open: boolean; question: FreeTextQuestion | null; }>({ open: false, question: null });
  const [mcModalState, setMcModalState] = useState<{ open: boolean; question: MultipleChoiceQuestion | null; }>({ open: false, question: null });

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data: AnyQuestion[];
      if (filterType === 'MULTIPLE_CHOICE') {
        data = await getMultipleChoiceQuestions();
      } else if (filterType === 'FREE_TEXT') {
        data = await getFreeTextQuestions();
      } else {
        data = await getQuestions();
      }

      setQuestions(data);
    } catch (err) {
      setError(err instanceof ApiError ? `${err.code}: ${err.message}` : 'Failed to load questions.');
    } finally {
      setLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    if (mode === 'STUDENT') return;
    void fetchQuestions();
  }, [mode, fetchQuestions]);

  const teacherNameMap = useMemo(() => {
    const map = new Map<string, string>();
    teachers.forEach((t) => map.set(t.id, t.name));
    return map;
  }, [teachers]);

  const visibleQuestions = useMemo(() => {
    if (mode === 'TEACHER' && selectedTeacher) {
      return questions.filter((q) => q.teacherId === selectedTeacher.id);
    }

    return questions;
  }, [questions, mode, selectedTeacher]);

  if (mode === 'STUDENT') {
    return <Navigate to="/assignments" replace />
  }

  const handleEdit = (q: AnyQuestion) => {
    if (q.type === 'MULTIPLE_CHOICE') {
      setMcModalState({ open: true, question: q as MultipleChoiceQuestion });
    } else {
      setFtModalState({ open: true, question: q as FreeTextQuestion });
    }
  }

  return (
    <Stack gap={6}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2>Question Bank</h2>
          <p style={{ color: 'var(--cds-text-secondary)' }}>
            {mode === 'TEACHER' && selectedTeacher
              ? `Showing questions authored by ${selectedTeacher.name}.`
              : 'Showing all questions across the repository.'}
          </p>
        </div>

        <div style={{ width: '24rem' }}>
          <ContentSwitcher
            selectedIndex={FILTER_OPTIONS.findIndex((o) => o.name === filterType)}
            onChange={(data) => {
              if (
                data.name === 'ALL' ||
                data.name === 'MULTIPLE_CHOICE' ||
                data.name === 'FREE_TEXT'
              ) {
                setFilterType(data.name);
              }
            }}
          >
            {FILTER_OPTIONS.map((opt) => (
              <Switch key={opt.name} name={opt.name} text={opt.text} />
            ))}
          </ContentSwitcher>
        </div>
      </div>

      {error && (
        <InlineNotification
          kind="error"
          title="Error loading questions"
          subtitle={error}
          onCloseButtonClick={() => setError(null)}
        />
      )}

      <QuestionsTable
        questions={visibleQuestions}
        filterType={filterType}
        teacherNameMap={teacherNameMap}
        loading={loading}
        onAddMc={() => setMcModalState({ open: true, question: null })}
        onAddFt={() => setFtModalState({ open: true, question: null })}
        onEdit={handleEdit}
      />

      <FreeTextFormModal
        open={ftModalState.open}
        question={ftModalState.question}
        onClose={() => setFtModalState((prev) => ({ ...prev, open: false }))}
        onSuccess={fetchQuestions}
      />

      <McQuestionModal
        open={mcModalState.open}
        question={mcModalState.question}
        onClose={() => setMcModalState((prev) => ({ ...prev, open: false }))}
        onSuccess={fetchQuestions}
      />
    </Stack>
  )
}
