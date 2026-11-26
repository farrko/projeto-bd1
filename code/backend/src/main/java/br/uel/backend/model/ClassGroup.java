package br.uel.backend.model;

import br.uel.backend.error.FieldValidationException;
import lombok.*;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
public class ClassGroup {
  private UUID id;
  private String name;
  private Integer year;
  private Integer semester;

  public void validateId() {
    // nullable (auto-generated)
  }

  public void validateName() {
    if (name == null) throw new FieldValidationException("name", "name cannot be null");
    if (name.isBlank()) throw new FieldValidationException("name", "name cannot be empty");
    if (name.length() > 100) throw new FieldValidationException("name", "name must be at most 100 characters");
  }

  public void validateYear() {
    if (year == null) throw new FieldValidationException("year", "year cannot be null");
    if (year <= 0) throw new FieldValidationException("year", "year must be greater than 0");
  }

  public void validateSemester() {
    if (semester == null) throw new FieldValidationException("semester", "semester cannot be null");
    if (semester != 1 && semester != 2) throw new FieldValidationException("semester", "semester must be 1 or 2");
  }
}