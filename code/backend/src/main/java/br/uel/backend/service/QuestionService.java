package br.uel.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import br.uel.backend.dao.AlternativeDao;
import br.uel.backend.dao.question.FreeTextQuestionDao;
import br.uel.backend.dao.question.MultipleChoiceQuestionDao;
import br.uel.backend.model.Alternative;
import br.uel.backend.model.question.FreeTextQuestion;
import br.uel.backend.model.question.MultipleChoiceQuestion;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class QuestionService {
  private MultipleChoiceQuestionDao multipleChoiceQuestionDao;
  private FreeTextQuestionDao freeTextQuestionDao;
  private AlternativeDao alternativeDao;

  public Optional<MultipleChoiceQuestion> getMultipleChoiceQuestionById(UUID id) {
    return multipleChoiceQuestionDao.findById(id);
  }

  public List<MultipleChoiceQuestion> getAllMultipleChoiceQuestions() {
    return multipleChoiceQuestionDao.findAll();
  }

  public Optional<FreeTextQuestion> getFreeTextQuestionById(UUID id) {
    return freeTextQuestionDao.findById(id);
  }

  public List<FreeTextQuestion> getAllFreeTextQuestions() {
    return freeTextQuestionDao.findAll();
  }

  public List<Alternative> getAlternativesFromQuestion(MultipleChoiceQuestion question) {
    return alternativeDao.findAllFromQuestion(question.getId());
  }

  public List<Alternative> getAlternativesFromQuestion(UUID questionId) {
    return alternativeDao.findAllFromQuestion(questionId);
  }

  public MultipleChoiceQuestion saveMultipleChoiceQuestion(MultipleChoiceQuestion question) {
    validateMultipleChoiceQuestion(question);
    return multipleChoiceQuestionDao.save(question);
  }

  public FreeTextQuestion saveFreeTextQuestion(FreeTextQuestion question) {
    validateFreeTextQuestion(question);
    return freeTextQuestionDao.save(question);
  }

  public Alternative saveAlternative(Alternative alternative) {
    validateAlternative(alternative);
    return alternativeDao.save(alternative);
  }

  private void validateMultipleChoiceQuestion(MultipleChoiceQuestion question) {
    question.validateId();
    question.validateTeacherId();
    question.validateStatement();
    question.validateType();
    question.validateCreatedAt();
  }

  private void validateFreeTextQuestion(FreeTextQuestion question) {
    question.validateId();
    question.validateTeacherId();
    question.validateStatement();
    question.validateType();
    question.validateCreatedAt();
    question.validateExpectedAnswer();
  }

  private void validateAlternative(Alternative alternative) {
    alternative.validateQuestionId();
    alternative.validateLetter();
    alternative.validateText();
    alternative.validateIsCorrect();
  }
}
