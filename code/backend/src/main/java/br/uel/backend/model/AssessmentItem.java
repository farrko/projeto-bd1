package br.uel.backend.model;

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
}
