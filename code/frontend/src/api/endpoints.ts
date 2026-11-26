import { api } from './client'

import type {
  Teacher,
  Student,
  ClassGroup,
  Assessment,
  AssessmentItem,
  FreeTextQuestion,
  MultipleChoiceQuestion,
  Alternative,
  Question,
  Assignment,
  AssignmentWithScore,
  Answer,
  McqCreateRequest,
  AnswerCreateRequest,
  ReorderAssessmentItemsRequest,
  ScoreAnswerRequest,
  AssessmentAverageReport,
  ScoreDistributionBand,
  StudentVsClassAverageReport,
  MostMissedQuestionReport,
  AssessmentAveragesParams,
  MostMissedQuestionsParams,
} from './types';

// Teachers
export const getTeachers = () => api.get<Teacher[]>('/users/teachers');
export const getTeacher = (id: string) => api.get<Teacher>(`/users/teachers/${id}`);
export const getTeacherAssessments = (id: string) => api.get<Assessment[]>(`/users/teachers/${id}/assessments`);
export const createTeacher = (teacher: Omit<Teacher, 'id'>) => api.post<Teacher>('/users/teachers', teacher);
export const updateTeacher = (id: string, updates: Partial<Teacher>) => api.patch<Teacher>(`/users/teachers/${id}`, updates);

// Students
export const getStudents = () => api.get<Student[]>('/users/students');
export const getStudent = (id: string) => api.get<Student>(`/users/students/${id}`);
export const getStudentAssignments = (id: string) => api.get<Assignment[]>(`/users/students/${id}/assignments`);
export const createStudent = (student: Omit<Student, 'id'>) => api.post<Student>('/users/students', student);
export const updateStudent = (id: string, updates: Partial<Student>) => api.patch<Student>(`/users/students/${id}`, updates);

// Class Groups
export const getClassGroups = () => api.get<ClassGroup[]>('/classes');
export const getClassGroup = (id: string) => api.get<ClassGroup>(`/classes/${id}`);
export const getClassGroupStudents = (id: string) => api.get<Student[]>(`/classes/${id}/students`);
export const getClassGroupAssessments = (id: string) => api.get<Assessment[]>(`/classes/${id}/assessments`);
export const createClassGroup = (classGroup: Omit<ClassGroup, 'id'>) => api.post<ClassGroup>('/classes', classGroup);
export const updateClassGroup = (id: string, updates: Partial<ClassGroup>) => api.patch<ClassGroup>(`/classes/${id}`, updates);
export const enrollStudents = (classId: string, studentIds: string[]) => api.post<{ studentId: string; classGroupId: string }[]>(`/classes/${classId}/students`, { studentIds });
export const unenrollStudent = (classId: string, studentId: string) => api.delete<void>(`/classes/${classId}/students/${studentId}`);

// Assessments
export const getAssessments = () => api.get<Assessment[]>('/assessments');
export const getAssessment = (id: string) => api.get<Assessment>(`/assessments/${id}`);
export const getAssessmentItems = (id: string) => api.get<AssessmentItem[]>(`/assessments/${id}/items`);
export const createAssessment = (assessment: Omit<Assessment, 'id'>) => api.post<Assessment>('/assessments', assessment);
export const updateAssessment = (id: string, updates: Partial<Assessment>) => api.patch<Assessment>(`/assessments/${id}`, updates);
export const reorderAssessmentItems = (id: string, questionIds: string[]) => api.patch<AssessmentItem[]>(`/assessments/${id}/items/reorder`, { questionIds } as ReorderAssessmentItemsRequest);

// Questions
export const getQuestions = () => api.get<Question[]>('/questions');
export const getFreeTextQuestions = () => api.get<FreeTextQuestion[]>('/questions/ft');
export const getMultipleChoiceQuestions = () => api.get<MultipleChoiceQuestion[]>('/questions/mc');
export const getQuestionAlternatives = (questionId: string) => api.get<Alternative[]>(`/questions/mc/${questionId}/alternatives`);
export const createFreeTextQuestion = (question: Omit<FreeTextQuestion, 'id' | 'createdAt' | 'type'>) => api.post<FreeTextQuestion>('/questions/ft', { ...question, type: 'FREE_TEXT' });
export const updateFreeTextQuestion = (id: string, updates: Partial<FreeTextQuestion>) => api.patch<FreeTextQuestion>(`/questions/ft/${id}`, updates);
export const createMcqWithAlternatives = (request: McqCreateRequest) => api.post<MultipleChoiceQuestion>('/questions/mc', request);
export const updateMcq = (id: string, updates: Partial<MultipleChoiceQuestion>) => api.patch<MultipleChoiceQuestion>(`/questions/mc/${id}`, updates);
export const changeCorrectAlternative = (id: string, letter: string) => api.patch<void>(`/questions/mc/${id}/correct-alternative`, { letter });

// Assignments
export const getAssignments = () => api.get<Assignment[]>('/assignments');
export const getAssignment = (assessmentId: string, studentId: string) => api.get<Assignment>(`/assignments/${assessmentId}/${studentId}`);
export const getAssignmentScore = (assessmentId: string, studentId: string) => api.get<AssignmentWithScore>(`/assignments/${assessmentId}/${studentId}/score`);
export const startAssignment = (assessmentId: string, studentId: string) => api.patch<Assignment>(`/assignments/${assessmentId}/${studentId}/start`, {});
export const submitAssignment = (assessmentId: string, studentId: string) => api.patch<Assignment>(`/assignments/${assessmentId}/${studentId}/submit`, {});
export const gradeAssignment = (assessmentId: string, studentId: string) => api.patch<Assignment>(`/assignments/${assessmentId}/${studentId}/grade`, {});
export const assignStudentsToAssessment = (assessmentId: string, studentIds: string[]) => api.post<Assignment[]>(`/assignments/${assessmentId}/students`, studentIds);

// Answers
export const getAnswers = (assessmentId: string, studentId: string) => api.get<Answer[]>(`/assignments/${assessmentId}/${studentId}/answers`);
export const getAnswer = (assessmentId: string, studentId: string, questionId: string) => api.get<Answer>(`/assignments/${assessmentId}/${studentId}/answers/${questionId}`);
export const createAnswer = (assessmentId: string, studentId: string, request: AnswerCreateRequest) => api.post<Answer>(`/assignments/${assessmentId}/${studentId}/answers`, request);
export const updateAnswer = (assessmentId: string, studentId: string, questionId: string, request: AnswerCreateRequest) => api.patch<Answer>(`/assignments/${assessmentId}/${studentId}/answers/${questionId}`, request);
export const scoreAnswer = (assessmentId: string, studentId: string, questionId: string, score: number) => api.patch<Answer>(`/assignments/${assessmentId}/${studentId}/answers/${questionId}/score`, { score } as ScoreAnswerRequest);

const  buildQueryString = (params?: object): string => {
  if (!params) return '';

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) searchParams.set(key, String(value));
  }
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

// Reports
export const getAssessmentAverages = (params?: AssessmentAveragesParams) => api.get<AssessmentAverageReport[]>(`/reports/assessment-averages${buildQueryString(params)}`);
export const getScoreDistribution = (assessmentId: string) => api.get<ScoreDistributionBand[]>(`/reports/assessments/${assessmentId}/score-distribution`);
export const getStudentVsClassAverage = (studentId: string) => api.get<StudentVsClassAverageReport[]>(`/reports/students/${studentId}/vs-class-average`);
export const getMostMissedQuestions = (params?: MostMissedQuestionsParams) => api.get<MostMissedQuestionReport[]>(`/reports/questions/most-missed${buildQueryString(params)}`);