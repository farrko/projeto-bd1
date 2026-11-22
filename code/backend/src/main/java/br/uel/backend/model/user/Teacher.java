package br.uel.backend.model.user;

import br.uel.backend.model.UserAccount;
import lombok.*;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Teacher extends UserAccount {
  private String staff_number;
}
