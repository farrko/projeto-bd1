import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Button, Tile, Tag, ProgressIndicator, ProgressStep, InlineLoading, InlineNotification, Stack } from '@carbon/react'
import { ArrowLeft, Play, SendAlt, CheckmarkOutline } from '@carbon/icons-react'
import { getAssignment, getAssignmentScore, getAssessment, getAssessmentItems, getQuestions, getFreeTextQuestions, getQuestionAlternatives, getAnswers, createAnswer, updateAnswer, scoreAnswer, startAssignment, submitAssignment, gradeAssignment, ApiError, type Assignment, type AssignmentWithScore, type AssignmentStatus, type Assessment, type AssessmentItem, type Question, type FreeTextQuestion, type Alternative, type Answer, type UUID } from '../../api'
import { useUserMode } from '../../context/UserModeContext'
import { AssignmentQuestionCard } from './AssignmentQuestionCard'

const LIFECYCLE_STEPS: AssignmentStatus[] = ['ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'GRADED'];

export const AssignmentDetailPage = () => {
  const { assessmentId, studentId } = useParams<{ assessmentId: string; studentId: string }>();
  const navigate = useNavigate();
  const { mode, students, teachers } = useUserMode();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [scoreSummary, setScoreSummary] = useState<AssignmentWithScore | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [items, setItems] = useState<AssessmentItem[]>([]);
  const [questionMap, setQuestionMap] = useState<Map<UUID, Question>>(new Map());
  const [alternativesMap, setAlternativesMap] = useState<Map<UUID, Alternative[]>>(new Map());
  const [answersMap, setAnswersMap] = useState<Map<UUID, Answer>>(new Map());

  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!assessmentId || !studentId) return;
    setLoading(true);
    setError(null);
    try {
      const [asgData, assessmentData, itemsData, baseQuestions, ftQuestions, answersData] = await Promise.all([
        getAssignment(assessmentId, studentId),
        getAssessment(assessmentId),
        getAssessmentItems(assessmentId),
        getQuestions(),
        getFreeTextQuestions(),
        getAnswers(assessmentId, studentId),
      ]);

      setAssignment(asgData);
      setAssessment(assessmentData);

      const sortedItems = [...itemsData].sort((a, b) => a.position - b.position);
      setItems(sortedItems);

      const qMap = new Map<UUID, Question | FreeTextQuestion>();
      baseQuestions.forEach((q) => qMap.set(q.id, q));
      ftQuestions.forEach((ft) => qMap.set(ft.id, ft));
      setQuestionMap(qMap);

      const aMap = new Map<UUID, Answer>();
      answersData.forEach((ans) => aMap.set(ans.questionId, ans));
      setAnswersMap(aMap);

      const mcQuestionIds = sortedItems
        .map((item) => item.questionId)
        .filter((qId) => qMap.get(qId)?.type === 'MULTIPLE_CHOICE');

      const altEntries = await Promise.all(
        mcQuestionIds.map(async (qId) => [qId, await getQuestionAlternatives(qId)] as const)
      );
      setAlternativesMap(new Map(altEntries));

      try {
        const scoreData = await getAssignmentScore(assessmentId, studentId);
        setScoreSummary(scoreData);
      } catch {
        setScoreSummary(null);
      }
    } catch (err) {
      setError(err instanceof ApiError ? `${err.code}: ${err.message}` : 'Failed to load assignment.');
    } finally {
      setLoading(false);
    }
  }, [assessmentId, studentId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const refreshAnswersAndScore = async () => {
    if (!assessmentId || !studentId) return;
    const [answersData, scoreData] = await Promise.all([
      getAnswers(assessmentId, studentId),
      getAssignmentScore(assessmentId, studentId).catch(() => null),
    ]);
    const aMap = new Map<UUID, Answer>();
    answersData.forEach((ans) => aMap.set(ans.questionId, ans));
    setAnswersMap(aMap);
    setScoreSummary(scoreData);
  }

  const handleStart = async () => {
    if (!assessmentId || !studentId) return;
    setTransitioning(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await startAssignment(assessmentId, studentId);
      await loadData();
      setSuccessMsg('Assignment started. You can now answer the questions.');
    } catch (err) {
      setError(err instanceof ApiError ? `${err.code}: ${err.message}` : 'Failed to start assignment.');
    } finally {
      setTransitioning(false);
    }
  }

  const handleSubmit = async () => {
    if (!assessmentId || !studentId) return;
    setTransitioning(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await submitAssignment(assessmentId, studentId);
      await loadData();
      setSuccessMsg('Assignment submitted. Multiple-choice answers have been auto-scored.');
    } catch (err) {
      setError(err instanceof ApiError ? `${err.code}: ${err.message}` : 'Failed to submit assignment.');
    } finally {
      setTransitioning(false);
    }
  }

  const handleGrade = async () => {
    if (!assessmentId || !studentId) return;
    setTransitioning(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await gradeAssignment(assessmentId, studentId);
      await loadData();
      setSuccessMsg('Assignment finalized as GRADED.');
    } catch (err) {
      setError(err instanceof ApiError ? `${err.code}: ${err.message}` : 'Failed to finalize grading.');
    } finally {
      setTransitioning(false);
    }
  }

  const handleSaveAnswer = async (questionId: UUID, chosenLetter: string | null, answerText: string | null) => {
    if (!assessmentId || !studentId) return;
    setError(null);
    setSuccessMsg(null);
    try {
      const existing = answersMap.get(questionId);
      const payload = { questionId, chosenLetter, answerText };
      if (existing) {
        await updateAnswer(assessmentId, studentId, questionId, payload);
      } else {
        await createAnswer(assessmentId, studentId, payload);
      }
      await refreshAnswersAndScore();
    } catch (err) {
      setError(err instanceof ApiError ? `${err.code}: ${err.message}` : 'Failed to save answer.');
    }
  }

  const handleScoreAnswer = async (questionId: UUID, score: number) => {
    if (!assessmentId || !studentId) return;
    setError(null);
    setSuccessMsg(null);
    try {
      await scoreAnswer(assessmentId, studentId, questionId, score);
      await refreshAnswersAndScore();
      setSuccessMsg('Score updated.');
    } catch (err) {
      setError(err instanceof ApiError ? `${err.code}: ${err.message}` : 'Failed to score answer.');
    }
  }

  const totalPoints = useMemo(() => items.reduce((acc, item) => acc + Number(item.points || 0), 0), [items]);

  const student = students.find((s) => s.id === studentId);
  const teacher = teachers.find((t) => t.id === assessment?.teacherId);

  const currentStepIndex = assignment ? LIFECYCLE_STEPS.indexOf(assignment.status) : 0;

  const canAnswer = assignment?.status === 'IN_PROGRESS' && (mode === 'STUDENT' || mode === 'ALL');
  const canScore = assignment?.status === 'SUBMITTED' && (mode === 'TEACHER' || mode === 'ALL');
  const canStart = assignment?.status === 'ASSIGNED' && (mode === 'STUDENT' || mode === 'ALL');
  const canSubmit = assignment?.status === 'IN_PROGRESS' && (mode === 'STUDENT' || mode === 'ALL');
  const canFinalizeGrade = assignment?.status === 'SUBMITTED' && (mode === 'TEACHER' || mode === 'ALL');

  return (
    <Stack gap={6}>
      <div>
        <Button
          kind="ghost"
          size="sm"
          renderIcon={ArrowLeft}
          onClick={() => navigate('/assignments')}
        >
          Back to Assignments
        </Button>
      </div>

      {error && (
        <InlineNotification
          kind="error"
          title="Error"
          subtitle={error}
          onCloseButtonClick={() => setError(null)}
        />
      )}

      {successMsg && (
        <InlineNotification
          kind="success"
          title="Success"
          subtitle={successMsg}
          onCloseButtonClick={() => setSuccessMsg(null)}
        />
      )}

      {loading ? (
        <InlineLoading description="Loading assignment..." />
      ) : assignment && assessment ? (
        <>
          <Tile>
            <Stack gap={4}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3>{assessment.title}</h3>
                  <p style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
                    Student: <strong>{student ? `${student.name} (${student.enrollmentNumber})` : studentId}</strong>
                    {' · '}
                    Teacher: <strong>{teacher ? teacher.name : assessment.teacherId}</strong>
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {canStart && (
                    <Button renderIcon={Play} disabled={transitioning} onClick={handleStart}>
                      {transitioning ? 'Starting...' : 'Start Assignment'}
                    </Button>
                  )}

                  {canSubmit && (
                    <Button renderIcon={SendAlt} disabled={transitioning} onClick={handleSubmit}>
                      {transitioning ? 'Submitting...' : 'Submit Assignment'}
                    </Button>
                  )}

                  {canFinalizeGrade && (
                    <Button
                      renderIcon={CheckmarkOutline}
                      disabled={transitioning || (scoreSummary !== null && scoreSummary.pendingCount > 0)}
                      onClick={handleGrade}
                    >
                      {transitioning ? 'Finalizing...' : 'Finalize Grade'}
                    </Button>
                  )}
                </div>
              </div>

              <ProgressIndicator currentIndex={currentStepIndex} spaceEqually>
                <ProgressStep label="Assigned" description="Ready to start" />
                <ProgressStep label="In Progress" description={assignment.startedAt ? new Date(assignment.startedAt).toLocaleTimeString() : 'Answering'} />
                <ProgressStep label="Submitted" description={assignment.submittedAt ? new Date(assignment.submittedAt).toLocaleTimeString() : 'Awaiting grade'} />
                <ProgressStep label="Graded" description="Completed" />
              </ProgressIndicator>

              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--cds-border-subtle)' }}>
                <span>
                  <strong>Date:</strong> {assessment.assessmentDate} ({assessment.startTime} – {assessment.endTime})
                </span>
                <span>
                  <strong>Total Score:</strong> {scoreSummary ? scoreSummary.totalScore : 0} / {totalPoints}
                </span>
                {scoreSummary && scoreSummary.pendingCount > 0 && (
                  <Tag type="warm-gray">{scoreSummary.pendingCount} item(s) pending score</Tag>
                )}
              </div>
            </Stack>
          </Tile>

          {assignment.status === 'ASSIGNED' ? (
            <Tile>
              <p>
                This assignment has not been started yet. Click <strong>Start Assignment</strong> to unlock the questions and record your start timestamp.
              </p>
            </Tile>
          ) : (
            <Stack gap={4}>
              {items.map((item) => (
                <AssignmentQuestionCard
                  key={item.questionId}
                  item={item}
                  question={questionMap.get(item.questionId)}
                  alternatives={alternativesMap.get(item.questionId) ?? []}
                  answer={answersMap.get(item.questionId)}
                  status={assignment.status}
                  canAnswer={canAnswer}
                  canScore={canScore}
                  busy={transitioning}
                  onSaveAnswer={handleSaveAnswer}
                  onScoreAnswer={handleScoreAnswer}
                />
              ))}
            </Stack>
          )}
        </>
      ) : null}
    </Stack>
  )
}
