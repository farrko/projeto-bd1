package br.uel.backend.error;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

public class DatabaseException extends ResponseStatusException {
  private final String constraintName;
  private final String detail;

  public DatabaseException(HttpStatus status, String message, String constraintName, String detail) {
    super(status, message);
    this.constraintName = constraintName;
    this.detail = detail;
  }

  public String getConstraintName() {
    return constraintName;
  }

  public String getDetail() {
    return detail;
  }
}