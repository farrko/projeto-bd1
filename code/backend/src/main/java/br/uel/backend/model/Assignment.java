package br.uel.backend.model;

import br.uel.backend.error.FieldValidationException;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
public class Assignment {
  private UUID assessmentId;
  private UUID studentId;
  private String status;
  private LocalDateTime startedAt;
  private LocalDateTime submittedAt;

  public void validateAssessmentId() {
    if (assessmentId == null) throw new FieldValidationException("assessmentId", "assessmentId cannot be null");
  }

  public void validateStudentId() {
    if (studentId == null) throw new FieldValidationException("studentId", "studentId cannot be null");
  }

  public void validateStatus() {
    if (status == null) throw new FieldValidationException("status", "status cannot be null");
    if (!status.matches("^(ASSIGNED|IN_PROGRESS|SUBMITTED|GRADED)$")) {
      throw new FieldValidationException("status", "status must be one of: ASSIGNED, IN_PROGRESS, SUBMITTED, GRADED");
    }
  }

  public void validateStartedAt() {
    // nullable
  }

  public void validateSubmittedAt() {
    // nullable
  }
}