package br.uel.backend.model.report;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MostMissedQuestionReport {
  private Long errorRank;
  private UUID questionId;
  private String statement;
  private Long answerCount;
  private Long wrongCount;
  private BigDecimal errorPercent;
}