package br.uel.backend.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import br.uel.backend.model.Assignment;
import br.uel.backend.service.AssignmentService;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/assignments")
public class AssignmentController {
  private AssignmentService assignmentService;

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
}