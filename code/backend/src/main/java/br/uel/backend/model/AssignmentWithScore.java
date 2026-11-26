package br.uel.backend.model;

import br.uel.backend.error.FieldValidationException;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
public class AssignmentWithScore {
  private UUID assessmentId;
  private UUID studentId;
  private String status;
  private LocalDateTime startedAt;
  private LocalDateTime submittedAt;
  private BigDecimal totalScore;
  private Integer pendingCount;

  public void validateAssessmentId() {
    if (assessmentId == null) throw new FieldValidationException("assessmentId", "assessmentId cannot be null");
  }

  public void validateStudentId() {
    if (studentId == null) throw new FieldValidationException("studentId", "studentId cannot be null");
  }

  public void validateStatus() {
    if (status == null) throw new FieldValidationException("status", "status cannot be null");
  }
}