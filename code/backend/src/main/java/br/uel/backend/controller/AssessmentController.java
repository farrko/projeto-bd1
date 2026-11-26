package br.uel.backend.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import br.uel.backend.dto.ReorderAssessmentItemsRequest;
import br.uel.backend.model.Assessment;
import br.uel.backend.model.AssessmentItem;
import br.uel.backend.service.AssessmentService;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/assessments")
public class AssessmentController {
  private AssessmentService assessmentService;

  @GetMapping({ "", "/" })
  public ResponseEntity<List<Assessment>> all() {
    List<Assessment> assessments = assessmentService.getAllAssessments();
    if (assessments == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    return ResponseEntity.status(HttpStatus.OK).body(assessments);
  }

  @GetMapping({ "/{id}", "/{id}/" })
  public ResponseEntity<Assessment> getById(@PathVariable UUID id) {
    Optional<Assessment> assessment = assessmentService.getAssessmentById(id);
    if (assessment.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    return ResponseEntity.status(HttpStatus.OK).body(assessment.get());
  }

  @PostMapping({ "", "/" })
  public ResponseEntity<Assessment> create(@RequestBody Assessment assessment) {
    Assessment assessmentCreated = assessmentService.saveAssessment(assessment);
    return ResponseEntity.status(HttpStatus.CREATED).body(assessmentCreated);
  }

  @PatchMapping({ "/{id}", "/{id}/" })
  public ResponseEntity<Assessment> update(@PathVariable UUID id, @RequestBody Assessment updates) {
    Optional<Assessment> a = assessmentService.getAssessmentById(id);
    if (a.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    Assessment assessment = a.get();
    if (updates.getTeacherId() != null) assessment.setTeacherId(updates.getTeacherId());
    if (updates.getClassGroupId() != null) assessment.setClassGroupId(updates.getClassGroupId());
    if (updates.getTitle() != null) assessment.setTitle(updates.getTitle());
    if (updates.getDescription() != null) assessment.setDescription(updates.getDescription());
    if (updates.getAssessmentDate() != null) assessment.setAssessmentDate(updates.getAssessmentDate());
    if (updates.getStartTime() != null) assessment.setStartTime(updates.getStartTime());
    if (updates.getEndTime() != null) assessment.setEndTime(updates.getEndTime());

    Assessment assessmentUpdated = assessmentService.saveAssessment(assessment);

    return ResponseEntity.status(HttpStatus.OK).body(assessmentUpdated);
  }

  @PatchMapping({ "/{id}/items/reorder", "/{id}/items/reorder/" })
  public ResponseEntity<List<AssessmentItem>> reorderItems(@PathVariable UUID id, @RequestBody ReorderAssessmentItemsRequest request) {
    List<AssessmentItem> items = assessmentService.reorderAssessmentItems(id, request.questionIds());
    return ResponseEntity.status(HttpStatus.OK).body(items);
  }
}
