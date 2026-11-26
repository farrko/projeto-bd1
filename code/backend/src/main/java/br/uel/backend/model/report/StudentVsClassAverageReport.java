package br.uel.backend.model.report;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentVsClassAverageReport {
  private LocalDate assessmentDate;
  private String title;
  private BigDecimal studentScore;
  private BigDecimal classAverage;
  private BigDecimal difference;
}