import { useState, useEffect } from 'react'
import { Tile, Tag, RadioButtonGroup, RadioButton, TextArea, NumberInput, Button, Stack } from '@carbon/react'
import { Save, Checkmark } from '@carbon/icons-react'
import type { AssessmentItem, Question, FreeTextQuestion, Alternative, Answer, AssignmentStatus, UUID } from '../../api'

interface AssignmentQuestionCardProps {
  item: AssessmentItem;
  question: Question | FreeTextQuestion | undefined;
  alternatives: Alternative[];
  answer: Answer | undefined;
  status: AssignmentStatus;
  canAnswer: boolean;
  canScore: boolean;
  busy: boolean;
  onSaveAnswer: (questionId: UUID, chosenLetter: string | null, answerText: string | null) => Promise<void>;
  onScoreAnswer: (questionId: UUID, score: number) => Promise<void>;
}

export const AssignmentQuestionCard = ({ item, question, alternatives, answer, status, canAnswer, canScore, busy, onSaveAnswer, onScoreAnswer }: AssignmentQuestionCardProps) => {
  const isMc = question?.type === 'MULTIPLE_CHOICE';
  const ftQuestion = question?.type === 'FREE_TEXT' ? (question as FreeTextQuestion) : undefined;

  const [chosenLetter, setChosenLetter] = useState<string>(answer?.chosenLetter ?? '');
  const [answerText, setAnswerText] = useState<string>(answer?.answerText ?? '');
  const [scoreDraft, setScoreDraft] = useState<number>(answer?.score ?? 0);
  const [savingItem, setSavingItem] = useState(false);

  useEffect(() => {
    setChosenLetter(answer?.chosenLetter ?? '');
    setAnswerText(answer?.answerText ?? '');
    setScoreDraft(answer?.score ?? 0);
  }, [answer]);

  const handleSelectMc = async (letter: string) => {
    setChosenLetter(letter);
    if (!canAnswer) return;
    setSavingItem(true);
    try {
      await onSaveAnswer(item.questionId, letter, null);
    } finally {
      setSavingItem(false);
    }
  }

  const handleSaveFt = async () => {
    if (!canAnswer) return;
    setSavingItem(true);
    try {
      await onSaveAnswer(item.questionId, null, answerText);
    } finally {
      setSavingItem(false);
    }
  }

  const handleSaveScore = async () => {
    if (!canScore) return;
    setSavingItem(true);
    try {
      await onScoreAnswer(item.questionId, scoreDraft);
    } finally {
      setSavingItem(false);
    }
  }

  const showCorrectness = status === 'SUBMITTED' || status === 'GRADED';
  const sortedAlts = [...alternatives].sort((a, b) => a.letter.localeCompare(b.letter));

  return (
    <Tile>
      <Stack gap={4}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <strong>Question #{item.position}</strong>
            <Tag type={isMc ? 'purple' : 'cyan'}>{isMc ? 'Multiple Choice' : 'Free Text'}</Tag>
            <Tag type="gray">{item.points} pts</Tag>
          </div>

          <div>
            {answer?.score !== null && answer?.score !== undefined ? (
              <Tag type="green">Score: {answer.score} / {item.points}</Tag>
            ) : answer ? (
              <Tag type="warm-gray">Pending Score</Tag>
            ) : (
              <Tag type="outline">Unanswered</Tag>
            )}
          </div>
        </div>

        <p style={{ fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
          {question ? question.statement : item.questionId}
        </p>

        {isMc ? (
          <RadioButtonGroup
            name={`question-${item.questionId}`}
            orientation="vertical"
            valueSelected={chosenLetter}
            onChange={(val) => {
              if (val !== undefined) void handleSelectMc(String(val));
            }}
            disabled={!canAnswer || busy || savingItem}
          >
            {sortedAlts.map((alt) => {
              const suffix = showCorrectness && alt.isCorrect ? ' (Correct Answer)' : '';
              return (
                <RadioButton
                  key={alt.letter}
                  id={`q-${item.questionId}-${alt.letter}`}
                  value={alt.letter}
                  labelText={`${alt.letter}) ${alt.text}${suffix}`}
                />
              );
            })}
          </RadioButtonGroup>
        ) : (
          <Stack gap={3}>
            <TextArea
              id={`ft-answer-${item.questionId}`}
              labelText="Student Answer"
              placeholder={canAnswer ? 'Write your response here...' : 'No response submitted.'}
              rows={4}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              disabled={!canAnswer || busy || savingItem}
            />

            {canAnswer && (
              <div>
                <Button
                  kind="tertiary"
                  size="sm"
                  renderIcon={Save}
                  disabled={busy || savingItem || !answerText.trim()}
                  onClick={handleSaveFt}
                >
                  {savingItem ? 'Saving...' : answer ? 'Update Answer' : 'Save Answer'}
                </Button>
              </div>
            )}
          </Stack>
        )}

        {!isMc && (canScore || status === 'GRADED') && ftQuestion?.expectedAnswer && (
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--cds-layer-02)', borderLeft: '3px solid var(--cds-border-interactive)' }}>
            <strong>Expected Answer / Rubric:</strong>
            <p style={{ marginTop: '0.25rem', whiteSpace: 'pre-wrap' }}>{ftQuestion.expectedAnswer}</p>
          </div>
        )}

        {!isMc && canScore && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--cds-border-subtle)' }}>
            <div style={{ width: '12rem' }}>
              <NumberInput
                id={`score-input-${item.questionId}`}
                label={`Score (0 – ${item.points})`}
                min={0}
                max={item.points}
                step={0.25}
                value={scoreDraft}
                onChange={(_e, data) => {
                  if (typeof data.value === 'number') setScoreDraft(data.value);
                }}
                disabled={busy || savingItem || !answer}
              />
            </div>
            <Button
              kind="primary"
              size="md"
              renderIcon={Checkmark}
              disabled={busy || savingItem || !answer}
              onClick={handleSaveScore}
            >
              {savingItem ? 'Saving...' : 'Assign Score'}
            </Button>
            {!answer && (
              <span style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
                Student did not submit an answer for this question.
              </span>
            )}
          </div>
        )}
      </Stack>
    </Tile>
  )
}
