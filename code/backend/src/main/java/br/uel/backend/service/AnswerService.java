package br.uel.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import br.uel.backend.dao.AnswerDao;
import br.uel.backend.dao.AssessmentDao;
import br.uel.backend.dao.QuestionDao;
import br.uel.backend.dao.user.StudentDao;
import br.uel.backend.model.Answer;
import br.uel.backend.model.Assessment;
import br.uel.backend.model.Question;
import br.uel.backend.model.user.Student;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AnswerService {
  private AnswerDao answerDao;
  private AssessmentDao assessmentDao;
  private StudentDao studentDao;
  private QuestionDao questionDao;

  public Optional<Answer> getAnswerById(UUID assessmentId, UUID studentId, UUID questionId) {
    return answerDao.findById(assessmentId, studentId, questionId);
  }

  public List<Answer> getAllAnswers() {
    return answerDao.findAll();
  }

  public List<Answer> getAllAnswersWithAssessment(Assessment assessment) {
    return answerDao.findAllWithAssessment(assessment.getId());
  }

  public List<Answer> getAllAnswersWithAssessment(UUID assessmentId) {
    return answerDao.findAllWithAssessment(assessmentId);
  }

  public List<Answer> getAllAnswersWithStudent(Student student) {
    return answerDao.findAllWithStudent(student.getId());
  }

  public List<Answer> getAllAnswersWithStudent(UUID studentId) {
    return answerDao.findAllWithStudent(studentId);
  }

  public List<Answer> getAllAnswersWithQuestion(Question question) {
    return answerDao.findAllWithQuestion(question.getId());
  }

  public List<Answer> getAllAnswersWithQuestion(UUID questionId) {
    return answerDao.findAllWithQuestion(questionId);
  }

  public List<Answer> getAllAnswersWithAssessmentAndStudent(Assessment assessment, Student student) {
    return answerDao.findAllWithAssessmentAndStudent(assessment.getId(), student.getId());
  }

  public List<Answer> getAllAnswersWithAssessmentAndStudent(UUID assessmentId, UUID studentId) {
    return answerDao.findAllWithAssessmentAndStudent(assessmentId, studentId);
  }

  public List<Answer> getAllAnswersWithAssessmentAndQuestion(Assessment assessment, Question question) {
    return answerDao.findAllWithAssessmentAndQuestion(assessment.getId(), question.getId());
  }

  public List<Answer> getAllAnswersWithAssessmentAndQuestion(UUID assessmentId, UUID questionId) {
    return answerDao.findAllWithAssessmentAndQuestion(assessmentId, questionId);
  }

  public List<Answer> getAllAnswersWithStudentAndQuestion(Student student, Question question) {
    return answerDao.findAllWithStudentAndQuestion(student.getId(), question.getId());
  }

  public List<Answer> getAllAnswersWithStudentAndQuestion(UUID studentId, UUID questionId) {
    return answerDao.findAllWithStudentAndQuestion(studentId, questionId);
  }

  public Assessment getAnswerAssessment(Answer answer) {
    return assessmentDao.findById(answer.getAssessmentId()).get();
  }

  public Student getAnswerStudent(Answer answer) {
    return studentDao.findById(answer.getStudentId()).get();
  }

  public Question getAnswerQuestion(Answer answer) {
    return questionDao.findById(answer.getQuestionId()).get();
  }

  // .save: cria uma nova entry
  public Answer save(Answer answer) {
    return answerDao.save(answer);
  }

  // .update: atualiza uma entry existente (separação necessária por conta de trigger BEFORE INSERT)
  public Answer update(Answer answer) {
    return answerDao.update(answer);
  }
}
