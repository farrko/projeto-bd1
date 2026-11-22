package br.uel.backend.model;

import lombok.*;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
public class UserAccount {
  private UUID id;
  private String name;
  private String email;
  private String password;
  private String role;
}
