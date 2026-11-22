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

  public Optional<FreeTextQuestion> getFreeTextQuestionById(UUID id) {
    return freeTextQuestionDao.findById(id);
  }

  public List<Alternative> getAlternativesFromQuestion(MultipleChoiceQuestion question) {
    return alternativeDao.findAllFromQuestion(question.getId());
  }

  public List<Alternative> getAlternativesFromQuestion(UUID questionId) {
    return alternativeDao.findAllFromQuestion(questionId);
  }
}
