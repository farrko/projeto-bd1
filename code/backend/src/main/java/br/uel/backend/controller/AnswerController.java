package br.uel.backend.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import br.uel.backend.dto.AnswerCreateRequest;
import br.uel.backend.dto.AnswerScoreRequest;
import br.uel.backend.model.Answer;
import br.uel.backend.service.AnswerService;
import lombok.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/assignments/{assessmentId}/{studentId}/answers")
public class AnswerController {
  private final AnswerService answerService;

  @PostMapping({ "", "/" })
  public ResponseEntity<Answer> createAnswer(@PathVariable UUID assessmentId, @PathVariable UUID studentId, @RequestBody AnswerCreateRequest request) {
    Answer answer = Answer.builder()
      .assessmentId(assessmentId)
      .studentId(studentId)
      .questionId(request.questionId())
      .chosenLetter(request.chosenLetter())
      .answerText(request.answerText())
      .build();

    Answer created = answerService.save(answer);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @PatchMapping({ "/{questionId}", "/{questionId}/" })
  public ResponseEntity<Answer> updateAnswer(@PathVariable UUID assessmentId, @PathVariable UUID studentId, @PathVariable UUID questionId, @RequestBody AnswerCreateRequest request) {
    Optional<Answer> existing = answerService.getAnswerById(assessmentId, studentId, questionId);
    if (existing.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    Answer answer = existing.get();
    if (request.chosenLetter() != null) answer.setChosenLetter(request.chosenLetter());
    if (request.answerText() != null) answer.setAnswerText(request.answerText());

    Answer updated = answerService.update(answer);
    return ResponseEntity.status(HttpStatus.OK).body(updated);
  }

  @PatchMapping({ "/{questionId}/score", "/{questionId}/score/" })
  public ResponseEntity<Answer> updateScore(@PathVariable UUID assessmentId, @PathVariable UUID studentId, @PathVariable UUID questionId, @RequestBody AnswerScoreRequest request) {
    Optional<Answer> existing = answerService.getAnswerById(assessmentId, studentId, questionId);
    if (existing.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    Answer updated = answerService.updateScore(assessmentId, studentId, questionId, request.score());
    return ResponseEntity.status(HttpStatus.OK).body(updated);
  }

  @GetMapping({ "", "/" })
  public ResponseEntity<List<Answer>> getAllAnswers(@PathVariable UUID assessmentId, @PathVariable UUID studentId) {
    List<Answer> answers = answerService.getAnswersByAssignment(assessmentId, studentId);
    return ResponseEntity.status(HttpStatus.OK).body(answers);
  }

  @GetMapping({ "/{questionId}", "/{questionId}/" })
  public ResponseEntity<Answer> getAnswer(@PathVariable UUID assessmentId, @PathVariable UUID studentId, @PathVariable UUID questionId) {
    Optional<Answer> answer = answerService.getAnswerById(assessmentId, studentId, questionId);
    if (answer.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    return ResponseEntity.status(HttpStatus.OK).body(answer.get());
  }
}