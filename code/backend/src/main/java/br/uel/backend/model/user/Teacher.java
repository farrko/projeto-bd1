package br.uel.backend.model.user;

import br.uel.backend.error.FieldValidationException;
import br.uel.backend.model.UserAccount;
import lombok.*;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Teacher extends UserAccount {
  private String staffNumber;

  public void validateStaffNumber() {
    if (staffNumber == null) throw new FieldValidationException("staffNumber", "staffNumber cannot be null");
    if (staffNumber.isBlank()) throw new FieldValidationException("staffNumber", "staffNumber cannot be empty");
    if (staffNumber.length() > 20) throw new FieldValidationException("staffNumber", "staffNumber must be at most 20 characters");
  }
}