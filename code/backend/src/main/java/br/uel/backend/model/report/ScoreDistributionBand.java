package br.uel.backend.model.report;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScoreDistributionBand {
  private String scoreRange;
  private Long studentCount;
}