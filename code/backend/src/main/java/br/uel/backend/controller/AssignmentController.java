package br.uel.backend.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import br.uel.backend.model.Assignment;
import br.uel.backend.model.AssignmentWithScore;
import br.uel.backend.service.AssignmentService;
import lombok.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/assignments")
public class AssignmentController {
  private final AssignmentService assignmentService;

  @GetMapping({ "", "/" })
  public ResponseEntity<List<Assignment>> all() {
    List<Assignment> assignments = assignmentService.getAllAssignments();
    if (assignments == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    return ResponseEntity.status(HttpStatus.OK).body(assignments);
  }

  @GetMapping({ "/{assessmentId}/{studentId}", "/{assessmentId}/{studentId}/" })
  public ResponseEntity<Assignment> getById(@PathVariable UUID assessmentId, @PathVariable UUID studentId) {
    Optional<Assignment> assignment = assignmentService.getAssignmentById(assessmentId, studentId);
    if (assignment.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    return ResponseEntity.status(HttpStatus.OK).body(assignment.get());
  }

  @PostMapping({ "", "/" })
  public ResponseEntity<Assignment> create(@RequestBody Assignment assignment) {
    Assignment assignmentCreated = assignmentService.save(assignment);
    return ResponseEntity.status(HttpStatus.CREATED).body(assignmentCreated);
  }

  @PatchMapping({ "/{assessmentId}/{studentId}", "/{assessmentId}/{studentId}/" })
  public ResponseEntity<Assignment> update(@PathVariable UUID assessmentId, @PathVariable UUID studentId, @RequestBody Assignment updates) {
    Optional<Assignment> a = assignmentService.getAssignmentById(assessmentId, studentId);
    if (a.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    Assignment assignment = a.get();
    if (updates.getStatus() != null) assignment.setStatus(updates.getStatus());
    if (updates.getStartedAt() != null) assignment.setStartedAt(updates.getStartedAt());
    if (updates.getSubmittedAt() != null) assignment.setSubmittedAt(updates.getSubmittedAt());

    Assignment assignmentUpdated = assignmentService.update(assignment);

    return ResponseEntity.status(HttpStatus.OK).body(assignmentUpdated);
  }

  @GetMapping({ "/{assessmentId}/{studentId}/score", "/{assessmentId}/{studentId}/score/" })
  public ResponseEntity<AssignmentWithScore> getScore(@PathVariable UUID assessmentId, @PathVariable UUID studentId) {
    Optional<AssignmentWithScore> score = assignmentService.getAssignmentWithScore(assessmentId, studentId);
    if (score.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    return ResponseEntity.status(HttpStatus.OK).body(score.get());
  }

  @PatchMapping({ "/{assessmentId}/{studentId}/start", "/{assessmentId}/{studentId}/start/" })
  public ResponseEntity<Assignment> startAssignment(@PathVariable UUID assessmentId, @PathVariable UUID studentId) {
    Assignment updated = assignmentService.startAssignment(assessmentId, studentId);
    return ResponseEntity.status(HttpStatus.OK).body(updated);
  }

  @PatchMapping({ "/{assessmentId}/{studentId}/submit", "/{assessmentId}/{studentId}/submit/" })
  public ResponseEntity<Assignment> submitAssignment(@PathVariable UUID assessmentId, @PathVariable UUID studentId) {
    Assignment updated = assignmentService.submitAssignment(assessmentId, studentId);
    return ResponseEntity.status(HttpStatus.OK).body(updated);
  }

  @PatchMapping({ "/{assessmentId}/{studentId}/grade", "/{assessmentId}/{studentId}/grade/" })
  public ResponseEntity<Assignment> gradeAssignment(@PathVariable UUID assessmentId, @PathVariable UUID studentId) {
    Assignment updated = assignmentService.gradeAssignment(assessmentId, studentId);
    return ResponseEntity.status(HttpStatus.OK).body(updated);
  }

  @PostMapping({ "/{assessmentId}/students", "/{assessmentId}/students/" })
  public ResponseEntity<List<Assignment>> assignStudentsToAssessment(
      @PathVariable UUID assessmentId,
      @RequestBody List<UUID> studentIds) {
    List<Assignment> created = assignmentService.assignStudentsToAssessment(assessmentId, studentIds);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }
}