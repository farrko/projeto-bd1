package br.uel.backend.error;

import org.springframework.web.server.ResponseStatusException;

public class FieldValidationException extends ResponseStatusException {
  private final String field;

  public FieldValidationException(String field, String message) {
    super(org.springframework.http.HttpStatus.BAD_REQUEST, message);
    this.field = field;
  }

  public String getField() {
    return field;
  }
}
