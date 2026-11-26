package br.uel.backend.model;

import br.uel.backend.error.FieldValidationException;
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

  public void validateQuestionId() {
    if (questionId == null) throw new FieldValidationException("questionId", "questionId cannot be null");
  }

  public void validateLetter() {
    if (letter == null) throw new FieldValidationException("letter", "letter cannot be null");
    if (!letter.matches("^[A-Z]$")) {
      throw new FieldValidationException("letter", "letter must be a single uppercase letter (A-Z)");
    }
  }

  public void validateText() {
    if (text == null) throw new FieldValidationException("text", "text cannot be null");
    if (text.isBlank()) throw new FieldValidationException("text", "text cannot be empty");
  }

  public void validateIsCorrect() {
    if (isCorrect == null) throw new FieldValidationException("isCorrect", "isCorrect cannot be null");
  }
}