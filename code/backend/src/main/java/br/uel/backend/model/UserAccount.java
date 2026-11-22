package br.uel.backend.model;

import br.uel.backend.error.FieldValidationException;
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

  public void validateId() {
    // nullable (auto-generated)
  }

  public void validateName() {
    if (name == null) {
      throw new FieldValidationException("name", "name cannot be null");
    }
    if (name.isBlank()) {
      throw new FieldValidationException("name", "name cannot be empty");
    }
    if (name.length() > 150) {
      throw new FieldValidationException("name", "name must be at most 150 characters");
    }
  }

  public void validateEmail() {
    if (email == null) {
      throw new FieldValidationException("email", "email cannot be null");
    }
    if (email.isBlank()) {
      throw new FieldValidationException("email", "email cannot be empty");
    }
    if (email.length() > 255) {
      throw new FieldValidationException("email", "email must be at most 255 characters");
    }
    if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
      throw new FieldValidationException("email", "email must be a valid email address");
    }
  }

  public void validatePassword() {
    if (password == null) {
      throw new FieldValidationException("password", "password cannot be null");
    }
    if (password.isBlank()) {
      throw new FieldValidationException("password", "password cannot be empty");
    }
  }

  public void validateRole() {
    if (role == null) {
      throw new FieldValidationException("role", "role cannot be null");
    }
    if (!role.matches("^(STUDENT|TEACHER)$")) {
      throw new FieldValidationException("role", "role must be STUDENT or TEACHER");
    }
  }
}
