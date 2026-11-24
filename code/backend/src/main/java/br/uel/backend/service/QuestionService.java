package br.uel.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import br.uel.backend.dao.AlternativeDao;
import br.uel.backend.dao.question.FreeTextQuestionDao;
import br.uel.backend.dao.question.MultipleChoiceQuestionDao;
import br.uel.backend.dto.QuestionDTO;
import br.uel.backend.model.Alternative;
import br.uel.backend.model.question.FreeTextQuestion;
import br.uel.backend.model.question.MultipleChoiceQuestion;
import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

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

  public List<QuestionDTO> getAllQuestions() {
    List<MultipleChoiceQuestion> mcQuestions = multipleChoiceQuestionDao.findAll();
    List<FreeTextQuestion> ftQuestions = freeTextQuestionDao.findAll();
    List<QuestionDTO> result = new java.util.ArrayList<>();

    for (MultipleChoiceQuestion mcq : mcQuestions) {
      List<Alternative> alts = alternativeDao.findAllFromQuestion(mcq.getId());
      result.add(QuestionDTO.fromMultipleChoice(mcq, alts));
    }

    for (FreeTextQuestion ftq : ftQuestions) {
      result.add(QuestionDTO.fromFreeText(ftq));
    }

    return result;
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

  @Transactional
  public MultipleChoiceQuestion saveMultipleChoiceQuestionWithAlternatives(MultipleChoiceQuestion question, List<Alternative> alternatives) {
    validateMultipleChoiceQuestion(question);
    if (alternatives == null || alternatives.size() < 2) {
      throw new IllegalArgumentException("Multiple choice question must have at least 2 alternatives");
    }
    long correctCount = alternatives.stream().filter(a -> Boolean.TRUE.equals(a.getIsCorrect())).count();
    if (correctCount != 1) {
      throw new IllegalArgumentException("Multiple choice question must have exactly 1 correct alternative");
    }

    MultipleChoiceQuestion savedQuestion = multipleChoiceQuestionDao.save(question);
    UUID questionId = savedQuestion.getId();

    for (Alternative alt : alternatives) {
      alt.setQuestionId(questionId);
      validateAlternative(alt);
      alternativeDao.save(alt);
    }

    return savedQuestion;
  }

  public FreeTextQuestion saveFreeTextQuestion(FreeTextQuestion question) {
    validateFreeTextQuestion(question);
    return freeTextQuestionDao.save(question);
  }

  public Alternative saveAlternative(Alternative alternative) {
    validateAlternative(alternative);
    return alternativeDao.save(alternative);
  }

  @Transactional
  public void changeCorrectAlternative(UUID questionId, String newCorrectLetter) {
    List<Alternative> alternatives = alternativeDao.findAllFromQuestion(questionId);
    if (alternatives.isEmpty()) {
      throw new IllegalArgumentException("Question has no alternatives");
    }

    Alternative newCorrect = alternatives.stream()
      .filter(a -> a.getLetter().equals(newCorrectLetter))
      .findFirst()
      .orElseThrow(() -> new IllegalArgumentException("Alternative with letter " + newCorrectLetter + " not found"));

    // Set all to incorrect first, then set new correct
    for (Alternative alt : alternatives) {
      alt.setIsCorrect(false);
      alternativeDao.save(alt);
    }

    newCorrect.setIsCorrect(true);
    alternativeDao.save(newCorrect);
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
