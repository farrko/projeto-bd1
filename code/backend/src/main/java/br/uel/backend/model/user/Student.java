package br.uel.backend.model.user;

import br.uel.backend.model.UserAccount;
import lombok.*;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Student extends UserAccount {
  private String enrollmentNumber;
}
