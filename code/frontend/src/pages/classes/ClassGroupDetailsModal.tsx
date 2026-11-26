import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { ComposedModal, ModalHeader, ModalBody, ModalFooter, Tabs, TabList, Tab, TabPanels, TabPanel, MultiSelect, Button, InlineLoading, InlineNotification, StructuredListWrapper, StructuredListHead, StructuredListRow, StructuredListCell, StructuredListBody, Stack } from '@carbon/react'
import { UserFollow, TrashCan, ArrowRight } from '@carbon/icons-react'
import { getClassGroup, getClassGroupStudents, getClassGroupAssessments, enrollStudents, unenrollStudent, ApiError, type ClassGroup, type Student, type Assessment, type UUID } from '../../api'
import { useUserMode } from '../../context/UserModeContext'

interface StudentSelectItem {
  id: UUID;
  label: string;
}

interface ClassGroupDetailsModalProps {
  open: boolean;
  classGroup: ClassGroup | null;
  onClose: () => void;
}

export const ClassGroupDetailsModal = ({ open, classGroup, onClose }: ClassGroupDetailsModalProps) => {
  const navigate = useNavigate();
  const { students: allStudents } = useUserMode();

  const [freshClassGroup, setFreshClassGroup] = useState<ClassGroup | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<Student[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedToEnroll, setSelectedToEnroll] = useState<StudentSelectItem[]>([]);
  const [multiSelectKey, setMultiSelectKey] = useState(0);

  const [loading, setLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadClassData = async (classId: UUID) => {
    setLoading(true);
    setError(null);

    try {
      const [groupData, studentsData, assessmentsData] = await Promise.all([getClassGroup(classId), getClassGroupStudents(classId), getClassGroupAssessments(classId)]);
      setFreshClassGroup(groupData);
      setEnrolledStudents(studentsData);
      setAssessments(assessmentsData);
    } catch (err) {
      setError(err instanceof ApiError ? `${err.code}: ${err.message}` : 'Failed to load class group details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open || !classGroup) return;

    setSelectedToEnroll([]);
    setMultiSelectKey((k) => k + 1);
    void loadClassData(classGroup.id);
  }, [open, classGroup]);

  const availableStudentItems = useMemo<StudentSelectItem[]>(() => {
    const enrolledIds = new Set(enrolledStudents.map((s) => s.id));
    return allStudents
      .filter((s) => !enrolledIds.has(s.id))
      .map((s) => ({
        id: s.id,
        label: `${s.name} (${s.enrollmentNumber})`,
      }));
  }, [allStudents, enrolledStudents]);

  const handleEnroll = async () => {
    if (!classGroup || selectedToEnroll.length === 0) return;

    setMutating(true);
    setError(null);
    try {
      const ids = selectedToEnroll.map((item) => item.id);
      await enrollStudents(classGroup.id, ids);
      setSelectedToEnroll([]);
      setMultiSelectKey((k) => k + 1);
      await loadClassData(classGroup.id);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? `${err.code}: ${err.message}`
          : 'Failed to enroll students.'
      );
    } finally {
      setMutating(false);
    }
  }

  const handleUnenroll = async (studentId: UUID) => {
    if (!classGroup) return;

    setMutating(true);
    setError(null);
    try {
      await unenrollStudent(classGroup.id, studentId);
      await loadClassData(classGroup.id);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? `${err.code}: ${err.message}`
          : 'Failed to unenroll student.'
      );
    } finally {
      setMutating(false);
    }
  }

  const handleOpenAssessment = (assessmentId: UUID) => {
    onClose();
    navigate(`/assessments/${assessmentId}`);
  }

  const activeGroup = freshClassGroup ?? classGroup;

  return (
    <ComposedModal open={open} onClose={onClose} size="lg">
      <ModalHeader
        label={
          activeGroup
            ? `${activeGroup.year} / Semester ${activeGroup.semester}`
            : 'Class Group'
        }
        title={activeGroup?.name ?? ''}
      />
      <ModalBody>
        <Stack gap={5}>
          {error && (
            <InlineNotification
              kind="error"
              title="Operation Error"
              subtitle={error}
              onCloseButtonClick={() => setError(null)}
            />
          )}

          {loading ? (
            <InlineLoading description="Loading roster and assessments..." />
          ) : (
            <Tabs>
              <TabList aria-label="Class group sections">
                <Tab>Enrolled Students ({enrolledStudents.length})</Tab>
                <Tab>Class Assessments ({assessments.length})</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Stack gap={5} style={{ paddingTop: '1rem' }}>
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
                          id="enroll-students-multiselect"
                          titleText="Enroll Students"
                          label={
                            availableStudentItems.length === 0
                              ? 'All students already enrolled'
                              : 'Select students to enroll...'
                          }
                          items={availableStudentItems}
                          itemToString={(item) => (item ? item.label : '')}
                          onChange={(data) =>
                            setSelectedToEnroll(data.selectedItems ?? [])
                          }
                          disabled={
                            mutating || availableStudentItems.length === 0
                          }
                        />
                      </div>
                      <Button
                        renderIcon={UserFollow}
                        onClick={handleEnroll}
                        disabled={mutating || selectedToEnroll.length === 0}
                      >
                        Enroll ({selectedToEnroll.length})
                      </Button>
                    </div>

                    {enrolledStudents.length === 0 ? (
                      <p>No students enrolled in this class group yet.</p>
                    ) : (
                      <StructuredListWrapper isCondensed>
                        <StructuredListHead>
                          <StructuredListRow head>
                            <StructuredListCell head>Name</StructuredListCell>
                            <StructuredListCell head>Enrollment</StructuredListCell>
                            <StructuredListCell head>Email</StructuredListCell>
                            <StructuredListCell head />
                          </StructuredListRow>
                        </StructuredListHead>
                        <StructuredListBody>
                          {enrolledStudents.map((s) => (
                            <StructuredListRow key={s.id}>
                              <StructuredListCell>{s.name}</StructuredListCell>
                              <StructuredListCell>
                                {s.enrollmentNumber}
                              </StructuredListCell>
                              <StructuredListCell>{s.email}</StructuredListCell>
                              <StructuredListCell>
                                <Button
                                  kind="danger--ghost"
                                  size="sm"
                                  hasIconOnly
                                  renderIcon={TrashCan}
                                  iconDescription="Unenroll student"
                                  disabled={mutating}
                                  onClick={() => handleUnenroll(s.id)}
                                />
                              </StructuredListCell>
                            </StructuredListRow>
                          ))}
                        </StructuredListBody>
                      </StructuredListWrapper>
                    )}
                  </Stack>
                </TabPanel>

                <TabPanel>
                  <div style={{ paddingTop: '1rem' }}>
                    {assessments.length === 0 ? (
                      <p>No assessments assigned to this class group.</p>
                    ) : (
                      <StructuredListWrapper isCondensed>
                        <StructuredListHead>
                          <StructuredListRow head>
                            <StructuredListCell head>Title</StructuredListCell>
                            <StructuredListCell head>Date</StructuredListCell>
                            <StructuredListCell head>Time Window</StructuredListCell>
                            <StructuredListCell head />
                          </StructuredListRow>
                        </StructuredListHead>
                        <StructuredListBody>
                          {assessments.map((a) => (
                            <StructuredListRow key={a.id}>
                              <StructuredListCell>{a.title}</StructuredListCell>
                              <StructuredListCell>{a.assessmentDate}</StructuredListCell>
                              <StructuredListCell>
                                {a.startTime} - {a.endTime}
                              </StructuredListCell>
                              <StructuredListCell>
                                <Button
                                  kind="ghost"
                                  size="sm"
                                  renderIcon={ArrowRight}
                                  onClick={() => handleOpenAssessment(a.id)}
                                >
                                  Open
                                </Button>
                              </StructuredListCell>
                            </StructuredListRow>
                          ))}
                        </StructuredListBody>
                      </StructuredListWrapper>
                    )}
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ComposedModal>
  )
}
