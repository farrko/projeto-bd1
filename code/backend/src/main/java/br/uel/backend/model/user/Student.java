package br.uel.backend.model.user;

import br.uel.backend.model.User;
import lombok.*;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Student extends User {
  private String enrollmentNumber;
}
