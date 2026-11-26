package br.uel.backend.model.user;

import br.uel.backend.error.FieldValidationException;
import br.uel.backend.model.UserAccount;
import lombok.*;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Student extends UserAccount {
  private String enrollmentNumber;

  public void validateEnrollmentNumber() {
    if (enrollmentNumber == null) throw new FieldValidationException("enrollmentNumber", "enrollmentNumber cannot be null");
    if (enrollmentNumber.isBlank()) throw new FieldValidationException("enrollmentNumber", "enrollmentNumber cannot be empty");
    if (enrollmentNumber.length() > 20) {
      throw new FieldValidationException("enrollmentNumber", "enrollmentNumber must be at most 20 characters");
    }
  }
}