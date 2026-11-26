export type UUID = string;

export type Role = 'STUDENT' | 'TEACHER';
export type QuestionType = 'MULTIPLE_CHOICE' | 'FREE_TEXT';
export type AssignmentStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED';

export interface UserAccount {
  id: UUID;
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface Teacher extends UserAccount {
  role: 'TEACHER';
  staffNumber: string;
}

export interface Student extends UserAccount {
  role: 'STUDENT';
  enrollmentNumber: string;
}

export interface ClassGroup {
  id: UUID;
  name: string;
  year: number;
  semester: 1 | 2;
}

export interface Assessment {
  id: UUID;
  title: string;
  description: string | null;
  assessmentDate: string;
  startTime: string;
  endTime: string;
  teacherId: UUID;
  classGroupId: UUID | null;
}

export interface Question {
  id: UUID;
  statement: string;
  type: QuestionType;
  teacherId: UUID;
  createdAt: string;
}

export interface FreeTextQuestion extends Question {
  type: 'FREE_TEXT';
  expectedAnswer: string | null;
}

export interface MultipleChoiceQuestion extends Question {
  type: 'MULTIPLE_CHOICE';
}

export interface Alternative {
  questionId: UUID;
  letter: string;
  text: string;
  isCorrect: boolean;
}

export interface AssessmentItem {
  questionId: UUID;
  points: number;
  position: number;
  question: Question | UUID;
}

export interface Assignment {
  assessmentId: UUID;
  studentId: UUID;
  status: AssignmentStatus;
  startedAt: string | null;
  submittedAt: string | null;
}

export interface AssignmentWithScore extends Assignment {
  totalScore: number;
  pendingCount: number;
}

export interface Answer {
  assessmentId: UUID;
  studentId: UUID;
  questionId: UUID;
  chosenLetter: string | null;
  answerText: string | null;
  score: number | null;
}

export interface McqCreateRequest {
  question: {
    statement: string;
    teacherId: UUID;
    type: 'MULTIPLE_CHOICE';
  };

  alternatives: Array<{ letter: string, text: string, isCorrect: boolean }>;
}

export interface AnswerCreateRequest {
  questionId: UUID;
  chosenLetter: string | null;
  answerText: string | null;
}

export interface ReorderAssessmentItemsRequest {
  questionIds: UUID[];
}

export interface ScoreAnswerRequest {
  score: number;
}

export interface AssessmentAverageReport {
  assessmentId: UUID;
  title: string;
  classGroup: string;
  assessmentDate: string;
  gradedCount: number;
  averageScore: number;
  maxScore: number;
  averagePercent: number;
  lowestScore: number;
  highestScore: number;
}

export interface ScoreDistributionBand {
  scoreRange: string;
  studentCount: number;
}

export interface StudentVsClassAverageReport {
  assessmentDate: string;
  title: string;
  studentScore: number;
  classAverage: number;
  difference: number;
}

export interface MostMissedQuestionReport {
  errorRank: number;
  questionId: UUID;
  statement: string;
  answerCount: number;
  wrongCount: number;
  errorPercent: number;
}

export interface AssessmentAveragesParams {
  startDate?: string;
  endDate?: string;
  minGraded?: number;
}

export interface MostMissedQuestionsParams {
  startDate?: string;
  endDate?: string;
  minAnswers?: number;
  top?: number;
  search?: string;
}

export class ApiError extends Error {
  public code: string;
  public details: Record<string, unknown>;
  public status: number;

  constructor(code: string, message: string, details: Record<string, unknown> = {}, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    this.status = status;
  }
}