package br.uel.backend.model.question;

import br.uel.backend.model.Question;
import lombok.*;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class FreeTextQuestion extends Question {
  private String expectedAnswer;

  public void validateExpectedAnswer() {
    // nullable field, no constraints besides being optional
  }
}
