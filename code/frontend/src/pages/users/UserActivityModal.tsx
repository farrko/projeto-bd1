import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { ComposedModal, ModalHeader, ModalBody, ModalFooter, Button, InlineLoading, InlineNotification, StructuredListWrapper, StructuredListHead, StructuredListRow, StructuredListCell, StructuredListBody, Tag, Stack } from '@carbon/react'
import { ArrowRight } from '@carbon/icons-react'
import { getTeacher, getStudent, getTeacherAssessments, getStudentAssignments, ApiError, type Teacher, type Student, type Assessment, type Assignment, type AssignmentStatus } from '../../api'

type UserRecord = Teacher | Student;

interface UserActivityModalProps {
  open: boolean;
  user: UserRecord | null;
  onClose: () => void;
}

const STATUS_TAG_TYPE: Record<AssignmentStatus, 'gray' | 'blue' | 'teal' | 'green'> = {
  ASSIGNED: 'gray',
  IN_PROGRESS: 'blue',
  SUBMITTED: 'teal',
  GRADED: 'green',
};

export const UserActivityModal = ({ open, user, onClose }: UserActivityModalProps) => {
  const navigate = useNavigate();

  const [freshUser, setFreshUser] = useState<UserRecord | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !user) return;

    let cancelled = false;
    const loadDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        if (user.role === 'TEACHER') {
          const [teacherData, teacherAssessments] = await Promise.all([getTeacher(user.id), getTeacherAssessments(user.id)]);

          if (!cancelled) {
            setFreshUser(teacherData);
            setAssessments(teacherAssessments);
            setAssignments([]);
          }
        } else {
          const [studentData, studentAssignments] = await Promise.all([getStudent(user.id), getStudentAssignments(user.id)]);

          if (!cancelled) {
            setFreshUser(studentData);
            setAssignments(studentAssignments);
            setAssessments([]);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? `${err.code}: ${err.message}` : 'Failed to load user details.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadDetails();
    return () => {
      cancelled = true;
    }
  }, [open, user]);

  const activeUser = freshUser ?? user;
  const isTeacher = activeUser?.role === 'TEACHER';

  const handleGoToRoute = (path: string) => {
    onClose();
    navigate(path);
  }

  return (
    <ComposedModal open={open} onClose={onClose} size="md">
      <ModalHeader
        label={isTeacher ? 'Teacher Details' : 'Student Details'}
        title={activeUser?.name ?? ''}
      />
      <ModalBody>
        {loading ? (
          <InlineLoading description="Loading profile and activity..." />
        ) : error ? (
          <InlineNotification
            kind="error"
            title="Load Error"
            subtitle={error}
            hideCloseButton
          />
        ) : activeUser ? (
          <Stack gap={5}>
            <div>
              <p>
                <strong>ID:</strong> <code>{activeUser.id}</code>
              </p>
              <p>
                <strong>Email:</strong> {activeUser.email}
              </p>
              <p>
                <strong>{isTeacher ? 'Staff Number' : 'Enrollment Number'}:</strong>{' '}
                {activeUser.role === 'TEACHER'
                  ? activeUser.staffNumber
                  : activeUser.enrollmentNumber}
              </p>
            </div>

            {isTeacher ? (
              <div>
                <h5 style={{ marginBottom: '0.5rem' }}>
                  Created Assessments ({assessments.length})
                </h5>
                {assessments.length === 0 ? (
                  <p>No assessments created by this teacher.</p>
                ) : (
                  <StructuredListWrapper isCondensed>
                    <StructuredListHead>
                      <StructuredListRow head>
                        <StructuredListCell head>Title</StructuredListCell>
                        <StructuredListCell head>Date</StructuredListCell>
                        <StructuredListCell head>Window</StructuredListCell>
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
                              onClick={() => handleGoToRoute(`/assessments/${a.id}`)}
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
            ) : (
              <div>
                <h5 style={{ marginBottom: '0.5rem' }}>
                  Assignments ({assignments.length})
                </h5>
                {assignments.length === 0 ? (
                  <p>No assignments found for this student.</p>
                ) : (
                  <StructuredListWrapper isCondensed>
                    <StructuredListHead>
                      <StructuredListRow head>
                        <StructuredListCell head>Assessment ID</StructuredListCell>
                        <StructuredListCell head>Status</StructuredListCell>
                        <StructuredListCell head />
                      </StructuredListRow>
                    </StructuredListHead>
                    <StructuredListBody>
                      {assignments.map((asg) => (
                        <StructuredListRow key={`${asg.assessmentId}-${asg.studentId}`}>
                          <StructuredListCell>
                            <code>{asg.assessmentId}</code>
                          </StructuredListCell>
                          <StructuredListCell>
                            <Tag type={STATUS_TAG_TYPE[asg.status]}>{asg.status}</Tag>
                          </StructuredListCell>
                          <StructuredListCell>
                            <Button
                              kind="ghost"
                              size="sm"
                              renderIcon={ArrowRight}
                              onClick={() =>
                                handleGoToRoute(
                                  `/assignments/${asg.assessmentId}/${asg.studentId}`
                                )
                              }
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
            )}
          </Stack>
        ) : null}
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ComposedModal>
  )
}