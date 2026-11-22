package br.uel.backend.model;

import lombok.*;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
public class Alternative {
  private UUID questionId;
  private String letter;
  private String text;
  private Boolean isCorrect;
}
