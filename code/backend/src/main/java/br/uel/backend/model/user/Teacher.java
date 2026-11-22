package br.uel.backend.model.user;

import br.uel.backend.model.User;
import lombok.*;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Teacher extends User {
  private String staff_number;
}
