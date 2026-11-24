package br.uel.backend.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import br.uel.backend.dto.McqCreateRequest;
import br.uel.backend.dto.QuestionDTO;
import br.uel.backend.model.Alternative;
import br.uel.backend.model.question.FreeTextQuestion;
import br.uel.backend.model.question.MultipleChoiceQuestion;
import br.uel.backend.service.QuestionService;
import lombok.AllArgsConstructor;
import java.util.Map;

@RestController
@AllArgsConstructor
public class QuestionController {
  private QuestionService questionService;

  // Base endpoint for all questions
  @GetMapping({ "/api/questions", "/api/questions/" })
  public ResponseEntity<List<QuestionDTO>> all() {
    List<QuestionDTO> questions = questionService.getAllQuestions();
    if (questions == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    return ResponseEntity.status(HttpStatus.OK).body(questions);
  }

  // Free Text Questions
  @GetMapping({ "/api/questions/ft", "/api/questions/ft/" })
  public ResponseEntity<List<FreeTextQuestion>> getAllFreeTextQuestions() {
    List<FreeTextQuestion> questions = questionService.getAllFreeTextQuestions();
    if (questions == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    return ResponseEntity.status(HttpStatus.OK).body(questions);
  }

  @PostMapping({ "/api/questions/ft", "/api/questions/ft/" })
  public ResponseEntity<FreeTextQuestion> createFreeTextQuestion(@RequestBody FreeTextQuestion question) {
    FreeTextQuestion created = questionService.saveFreeTextQuestion(question);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @PatchMapping({ "/api/questions/ft/{id}", "/api/questions/ft/{id}/" })
  public ResponseEntity<FreeTextQuestion> updateFreeTextQuestion(@PathVariable UUID id, @RequestBody FreeTextQuestion updates) {
    Optional<FreeTextQuestion> existing = questionService.getFreeTextQuestionById(id);
    if (existing.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    FreeTextQuestion question = existing.get();
    if (updates.getStatement() != null) question.setStatement(updates.getStatement());
    if (updates.getExpectedAnswer() != null) question.setExpectedAnswer(updates.getExpectedAnswer());
    if (updates.getTeacherId() != null) question.setTeacherId(updates.getTeacherId());

    FreeTextQuestion updated = questionService.saveFreeTextQuestion(question);
    return ResponseEntity.status(HttpStatus.OK).body(updated);
  }

  // Multiple Choice Questions
  @GetMapping({ "/api/questions/mc", "/api/questions/mc/" })
  public ResponseEntity<List<MultipleChoiceQuestion>> getAllMultipleChoiceQuestions() {
    List<MultipleChoiceQuestion> questions = questionService.getAllMultipleChoiceQuestions();
    if (questions == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    return ResponseEntity.status(HttpStatus.OK).body(questions);
  }

  @PostMapping({ "/api/questions/mc", "/api/questions/mc/" })
  public ResponseEntity<MultipleChoiceQuestion> createMultipleChoiceQuestion(@RequestBody McqCreateRequest request) {
    MultipleChoiceQuestion created = questionService.saveMultipleChoiceQuestionWithAlternatives(
      request.question(), request.alternatives()
    );
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @PatchMapping({ "/api/questions/mc/{id}", "/api/questions/mc/{id}/" })
  public ResponseEntity<MultipleChoiceQuestion> updateMultipleChoiceQuestion(@PathVariable UUID id, @RequestBody MultipleChoiceQuestion updates) {
    Optional<MultipleChoiceQuestion> existing = questionService.getMultipleChoiceQuestionById(id);
    if (existing.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    MultipleChoiceQuestion question = existing.get();
    if (updates.getStatement() != null) question.setStatement(updates.getStatement());
    if (updates.getTeacherId() != null) question.setTeacherId(updates.getTeacherId());

    MultipleChoiceQuestion updated = questionService.saveMultipleChoiceQuestion(question);
    return ResponseEntity.status(HttpStatus.OK).body(updated);
  }

  // Alternatives for a specific MCQ
  @GetMapping({ "/api/questions/mc/{mcqId}/alternatives", "/api/questions/mc/{mcqId}/alternatives/" })
  public ResponseEntity<List<Alternative>> getAlternatives(@PathVariable UUID mcqId) {
    Optional<MultipleChoiceQuestion> question = questionService.getMultipleChoiceQuestionById(mcqId);
    if (question.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    List<Alternative> alternatives = questionService.getAlternativesFromQuestion(mcqId);
    return ResponseEntity.status(HttpStatus.OK).body(alternatives);
  }

  @PostMapping({ "/api/questions/mc/{mcqId}/alternatives", "/api/questions/mc/{mcqId}/alternatives/" })
  public ResponseEntity<Alternative> createAlternative(@PathVariable UUID mcqId, @RequestBody Alternative alternative) {
    Optional<MultipleChoiceQuestion> question = questionService.getMultipleChoiceQuestionById(mcqId);
    if (question.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    alternative.setQuestionId(mcqId);
    Alternative created = questionService.saveAlternative(alternative);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @PatchMapping({ "/api/questions/mc/{mcqId}/alternatives/{letter}", "/api/questions/mc/{mcqId}/alternatives/{letter}/" })
  public ResponseEntity<Alternative> updateAlternative(
      @PathVariable UUID mcqId,
      @PathVariable String letter,
      @RequestBody Alternative updates) {
    Optional<Alternative> existing = questionService.getAlternativesFromQuestion(mcqId)
      .stream()
      .filter(a -> a.getLetter().equals(letter))
      .findFirst();
    if (existing.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    Alternative alternative = existing.get();
    if (updates.getText() != null) alternative.setText(updates.getText());
    if (updates.getIsCorrect() != null) alternative.setIsCorrect(updates.getIsCorrect());

    Alternative updated = questionService.saveAlternative(alternative);
    return ResponseEntity.status(HttpStatus.OK).body(updated);
  }

  @PatchMapping({ "/api/questions/mc/{mcqId}/correct-alternative", "/api/questions/mc/{mcqId}/correct-alternative/" })
  public ResponseEntity<Void> changeCorrectAlternative(
      @PathVariable UUID mcqId,
      @RequestBody Map<String, String> request) {
    String newCorrectLetter = request.get("letter");
    if (newCorrectLetter == null || newCorrectLetter.isBlank()) {
      return ResponseEntity.badRequest().build();
    }

    Optional<MultipleChoiceQuestion> question = questionService.getMultipleChoiceQuestionById(mcqId);
    if (question.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    questionService.changeCorrectAlternative(mcqId, newCorrectLetter.toUpperCase());
    return ResponseEntity.ok().build();
  }
}