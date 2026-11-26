package br.uel.backend.model;

import br.uel.backend.error.FieldValidationException;
import lombok.*;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
public class ClassEnrollment {
  private UUID studentId;
  private UUID classGroupId;

  public void validateStudentId() {
    if (studentId == null) throw new FieldValidationException("studentId", "studentId cannot be null");
  }

  public void validateClassGroupId() {
    if (classGroupId == null) throw new FieldValidationException("classGroupId", "classGroupId cannot be null");
  }
}