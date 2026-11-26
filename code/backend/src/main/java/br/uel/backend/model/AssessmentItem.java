package br.uel.backend.model;

import br.uel.backend.error.FieldValidationException;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
public class AssessmentItem {
  private UUID assessmentId;
  private UUID questionId;
  private BigDecimal points;
  private Integer position;

  public void validateAssessmentId() {
    if (assessmentId == null) throw new FieldValidationException("assessmentId", "assessmentId cannot be null");
  }

  public void validateQuestionId() {
    if (questionId == null) throw new FieldValidationException("questionId", "questionId cannot be null");
  }

  public void validatePoints() {
    if (points == null) throw new FieldValidationException("points", "points cannot be null");
    if (points.compareTo(BigDecimal.ZERO) <= 0) throw new FieldValidationException("points", "points must be greater than 0");
  }

  public void validatePosition() {
    if (position == null) throw new FieldValidationException("position", "position cannot be null");
    if (position <= 0) throw new FieldValidationException("position", "position must be greater than 0");
  }
}