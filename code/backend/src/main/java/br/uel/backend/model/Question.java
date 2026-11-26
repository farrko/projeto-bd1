package br.uel.backend.model;

import br.uel.backend.error.FieldValidationException;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
public class Question {
  private UUID id;
  private UUID teacherId;
  private String statement;
  private String type;
  private LocalDateTime createdAt;

  public void validateId() {
    // nullable (auto-generated)
  }

  public void validateTeacherId() {
    if (teacherId == null) throw new FieldValidationException("teacherId", "teacherId cannot be null");
  }

  public void validateStatement() {
    if (statement == null) throw new FieldValidationException("statement", "statement cannot be null");
    if (statement.isBlank()) throw new FieldValidationException("statement", "statement cannot be empty");
  }

  public void validateType() {
    if (type == null) throw new FieldValidationException("type", "type cannot be null");
    if (!type.matches("^(MULTIPLE_CHOICE|FREE_TEXT)$")) {
      throw new FieldValidationException("type", "type must be MULTIPLE_CHOICE or FREE_TEXT");
    }
  }

  public void validateCreatedAt() {
    if (createdAt == null) throw new FieldValidationException("createdAt", "createdAt cannot be null");
  }
}