package br.uel.backend.model.report;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentAverageReport {
  private UUID assessmentId;
  private String title;
  private String classGroup;
  private LocalDate assessmentDate;
  private Long gradedCount;
  private BigDecimal averageScore;
  private BigDecimal maxScore;
  private BigDecimal averagePercent;
  private BigDecimal lowestScore;
  private BigDecimal highestScore;
}