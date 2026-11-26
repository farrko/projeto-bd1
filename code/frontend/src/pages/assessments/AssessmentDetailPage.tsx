import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router'
import { Button, Tile, Tag, MultiSelect, InlineLoading, InlineNotification, StructuredListWrapper, StructuredListHead, StructuredListRow, StructuredListCell, StructuredListBody, Stack } from '@carbon/react'
import { ArrowLeft, ArrowUp, ArrowDown, Save, UserFollow, ArrowRight } from '@carbon/icons-react'
import { getAssessment, getAssessmentItems, reorderAssessmentItems, getClassGroup, getAssignments, assignStudentsToAssessment, getQuestions, ApiError, type Assessment, type AssessmentItem, type ClassGroup, type Assignment, type Question, type UUID } from '../../api'
import { useUserMode } from '../../context/UserModeContext'

interface StudentSelectItem {
  id: UUID;
  label: string;
}

export const AssessmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mode, teachers, students } = useUserMode();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [classGroup, setClassGroup] = useState<ClassGroup | null>(null);
  const [items, setItems] = useState<AssessmentItem[]>([]);
  const [questionMap, setQuestionMap] = useState<Map<UUID, Question>>(new Map());
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [hasOrderChanges, setHasOrderChanges] = useState(false);
  const [selectedToAssign, setSelectedToAssign] = useState<StudentSelectItem[]>([]);
  const [multiSelectKey, setMultiSelectKey] = useState(0);

  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);
  const [assigningStudents, setAssigningStudents] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [assessmentData, itemsData, allAssignments, allQuestions] = await Promise.all([getAssessment(id), getAssessmentItems(id), getAssignments(), getQuestions()]);

      setAssessment(assessmentData);
      const sortedItems = [...itemsData].sort((a, b) => a.position - b.position);
      setItems(sortedItems);
      setHasOrderChanges(false);

      const qMap = new Map<UUID, Question>();
      allQuestions.forEach((q) => qMap.set(q.id, q));
      setQuestionMap(qMap);

      setAssignments(allAssignments.filter((asg) => asg.assessmentId === id));

      if (assessmentData.classGroupId) {
        const cg = await getClassGroup(assessmentData.classGroupId);
        setClassGroup(cg);
      } else {
        setClassGroup(null);
      }
    } catch (err) {
      setError(err instanceof ApiError ? `${err.code}: ${err.message}` : 'Failed to load assessment details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (mode === 'STUDENT') return;
    void loadData();
  }, [mode, loadData]);

  const studentNameMap = useMemo(() => {
    const map = new Map<UUID, string>();
    students.forEach((s) => map.set(s.id, `${s.name} (${s.enrollmentNumber})`));
    return map;
  }, [students]);

  const availableStudents = useMemo<StudentSelectItem[]>(() => {
    const assignedIds = new Set(assignments.map((a) => a.studentId));
    return students
      .filter((s) => !assignedIds.has(s.id))
      .map((s) => ({
        id: s.id,
        label: `${s.name} (${s.enrollmentNumber})`,
      }));
  }, [students, assignments]);

  const totalPoints = useMemo(() => items.reduce((acc, item) => acc + Number(item.points || 0), 0), [items]);

  if (mode === 'STUDENT') return <Navigate to="/assignments" replace />

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;

    setItems((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return next.map((item, idx) => ({ ...item, position: idx + 1 }));
    });

    setHasOrderChanges(true);
    setSuccessMsg(null);
  }

  const handleSaveOrder = async () => {
    if (!id || !hasOrderChanges) return;
    setSavingOrder(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const orderedIds = items.map((item) => item.questionId);
      await reorderAssessmentItems(id, orderedIds);
      const refreshedItems = await getAssessmentItems(id);
      setItems([...refreshedItems].sort((a, b) => a.position - b.position));
      setHasOrderChanges(false);
      setSuccessMsg('Question order updated successfully.');
    } catch (err) {
      setError(err instanceof ApiError ? `${err.code}: ${err.message}` : 'Failed to reorder assessment items.');
    } finally {
      setSavingOrder(false);
    }
  }

  const handleAssignStudents = async () => {
    if (!id || selectedToAssign.length === 0) return;
    setAssigningStudents(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const studentIds = selectedToAssign.map((s) => s.id);
      await assignStudentsToAssessment(id, studentIds);
      setSelectedToAssign([]);
      setMultiSelectKey((k) => k + 1);
      await loadData();
      setSuccessMsg(`Assigned ${studentIds.length} student(s) to assessment.`);
    } catch (err) {
      setError(err instanceof ApiError ? `${err.code}: ${err.message}` : 'Failed to assign students.');
    } finally {
      setAssigningStudents(false);
    }
  };

  const resolveQuestion = (item: AssessmentItem): Question | undefined => {
    if (typeof item.question === 'object' && item.question !== null) {
      return item.question;
    }

    return questionMap.get(item.questionId);
  }

  const authorName = teachers.find((t) => t.id === assessment?.teacherId)?.name ?? assessment?.teacherId ?? '';

  return (
    <Stack gap={6}>
      <div>
        <Button
          kind="ghost"
          size="sm"
          renderIcon={ArrowLeft}
          onClick={() => navigate('/assessments')}
        >
          Back to Assessments
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
        <InlineLoading description="Loading assessment details..." />
      ) : assessment ? (
        <>
          <Tile>
            <Stack gap={3}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <h3>{assessment.title}</h3>
                {classGroup ? (
                  <Tag type="blue">
                    Class: {classGroup.name} ({classGroup.year}/{classGroup.semester})
                  </Tag>
                ) : (
                  <Tag type="magenta">Extra Assessment (No Class Group)</Tag>
                )}
              </div>

              {assessment.description && <p>{assessment.description}</p>}

              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <span>
                  <strong>Teacher:</strong> {authorName}
                </span>
                <span>
                  <strong>Date:</strong> {assessment.assessmentDate}
                </span>
                <span>
                  <strong>Window:</strong> {assessment.startTime} – {assessment.endTime}
                </span>
                <span>
                  <strong>Total Points:</strong> {totalPoints}
                </span>
              </div>
            </Stack>
          </Tile>

          <Tile>
            <Stack gap={4}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h4>Assessment Items ({items.length})</h4>
                  <p style={{ color: 'var(--cds-text-secondary)' }}>
                    Reorder question sequence using the arrows and save changes.
                  </p>
                </div>

                <Button
                  kind="primary"
                  size="sm"
                  renderIcon={Save}
                  disabled={!hasOrderChanges || savingOrder}
                  onClick={handleSaveOrder}
                >
                  {savingOrder ? 'Saving Order...' : 'Save Order'}
                </Button>
              </div>

              {items.length === 0 ? (
                <p>No items configured for this assessment.</p>
              ) : (
                <StructuredListWrapper isCondensed>
                  <StructuredListHead>
                    <StructuredListRow head>
                      <StructuredListCell head>Pos</StructuredListCell>
                      <StructuredListCell head>Type</StructuredListCell>
                      <StructuredListCell head>Question Statement</StructuredListCell>
                      <StructuredListCell head>Points</StructuredListCell>
                      <StructuredListCell head>Order</StructuredListCell>
                    </StructuredListRow>
                  </StructuredListHead>
                  <StructuredListBody>
                    {items.map((item, idx) => {
                      const q = resolveQuestion(item);
                      const isMc = q?.type === 'MULTIPLE_CHOICE';

                      return (
                        <StructuredListRow key={item.questionId}>
                          <StructuredListCell>
                            <strong>#{item.position}</strong>
                          </StructuredListCell>
                          <StructuredListCell>
                            {q ? (
                              <Tag type={isMc ? 'purple' : 'cyan'}>
                                {isMc ? 'MC' : 'Free Text'}
                              </Tag>
                            ) : (
                              '—'
                            )}
                          </StructuredListCell>
                          <StructuredListCell>
                            {q ? q.statement : <code>{item.questionId}</code>}
                          </StructuredListCell>
                          <StructuredListCell>{item.points}</StructuredListCell>
                          <StructuredListCell>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                              <Button
                                kind="ghost"
                                size="sm"
                                hasIconOnly
                                renderIcon={ArrowUp}
                                iconDescription="Move up"
                                disabled={idx === 0 || savingOrder}
                                onClick={() => moveItem(idx, -1)}
                              />
                              <Button
                                kind="ghost"
                                size="sm"
                                hasIconOnly
                                renderIcon={ArrowDown}
                                iconDescription="Move down"
                                disabled={idx === items.length - 1 || savingOrder}
                                onClick={() => moveItem(idx, 1)}
                              />
                            </div>
                          </StructuredListCell>
                        </StructuredListRow>
                      );
                    })}
                  </StructuredListBody>
                </StructuredListWrapper>
              )}
            </Stack>
          </Tile>

          <Tile>
            <Stack gap={4}>
              <div>
                <h4>Assigned Students ({assignments.length})</h4>
                <p style={{ color: 'var(--cds-text-secondary)' }}>
                  {assessment.classGroupId
                    ? 'Assignments are automatically synchronized with class group enrollment via database triggers.'
                    : 'Extra assessment: manually assign individual students below.'}
                </p>
              </div>

              {assessment.classGroupId === null && (
                <div
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'flex-end',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <MultiSelect
                      key={multiSelectKey}
                      id="assign-extra-students"
                      titleText="Assign Students"
                      label={
                        availableStudents.length === 0
                          ? 'All students already assigned'
                          : 'Select students to assign...'
                      }
                      items={availableStudents}
                      itemToString={(item) => (item ? item.label : '')}
                      onChange={(data) =>
                        setSelectedToAssign(data.selectedItems ?? [])
                      }
                      disabled={
                        assigningStudents || availableStudents.length === 0
                      }
                    />
                  </div>
                  <Button
                    renderIcon={UserFollow}
                    disabled={
                      assigningStudents || selectedToAssign.length === 0
                    }
                    onClick={handleAssignStudents}
                  >
                    Assign ({selectedToAssign.length})
                  </Button>
                </div>
              )}

              {assignments.length === 0 ? (
                <p>No student assignments generated for this assessment yet.</p>
              ) : (
                <StructuredListWrapper isCondensed>
                  <StructuredListHead>
                    <StructuredListRow head>
                      <StructuredListCell head>Student</StructuredListCell>
                      <StructuredListCell head>Status</StructuredListCell>
                      <StructuredListCell head />
                    </StructuredListRow>
                  </StructuredListHead>
                  <StructuredListBody>
                    {assignments.map((asg) => (
                      <StructuredListRow
                        key={`${asg.assessmentId}-${asg.studentId}`}
                      >
                        <StructuredListCell>
                          {studentNameMap.get(asg.studentId) ?? asg.studentId}
                        </StructuredListCell>
                        <StructuredListCell>
                          <Tag
                            type={
                              asg.status === 'GRADED'
                                ? 'green'
                                : asg.status === 'SUBMITTED'
                                ? 'teal'
                                : asg.status === 'IN_PROGRESS'
                                ? 'blue'
                                : 'gray'
                            }
                          >
                            {asg.status}
                          </Tag>
                        </StructuredListCell>
                        <StructuredListCell>
                          <Button
                            kind="ghost"
                            size="sm"
                            renderIcon={ArrowRight}
                            onClick={() =>
                              navigate(
                                `/assignments/${asg.assessmentId}/${asg.studentId}`
                              )
                            }
                          >
                            Open Assignment
                          </Button>
                        </StructuredListCell>
                      </StructuredListRow>
                    ))}
                  </StructuredListBody>
                </StructuredListWrapper>
              )}
            </Stack>
          </Tile>
        </>
      ) : null}
    </Stack>
  )
}
