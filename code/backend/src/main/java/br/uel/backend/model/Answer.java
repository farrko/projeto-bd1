package br.uel.backend.model;

import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
public class Answer {
  private UUID assessmentId;
  private UUID studentId;
  private UUID questionId;
  private String chosenLetter;
  private String answerText;
  private BigDecimal score;
}
