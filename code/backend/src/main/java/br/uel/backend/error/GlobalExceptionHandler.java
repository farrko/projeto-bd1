package br.uel.backend.error;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.postgresql.util.PSQLException;
import org.postgresql.util.PSQLState;
import org.springframework.validation.FieldError;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(FieldValidationException.class)
  public ResponseEntity<ErrorResponse> handleFieldValidation(FieldValidationException ex) {
    return ResponseEntity
      .status(HttpStatus.BAD_REQUEST)
      .body(new ErrorResponse(ErrorCodes.VALIDATION_ERROR, ex.getReason(), Map.of("field", ex.getField())));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
    Map<String, Object> errors = new HashMap<>();
    for (FieldError error : ex.getBindingResult().getFieldErrors()) {
      errors.put(error.getField(), error.getDefaultMessage());
    }

    return ResponseEntity
      .status(HttpStatus.BAD_REQUEST)
      .body(new ErrorResponse(ErrorCodes.VALIDATION_ERROR, "Invalid request body", errors));
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
    return ResponseEntity
      .status(HttpStatus.BAD_REQUEST)
      .body(new ErrorResponse(ErrorCodes.INVALID_ARGUMENT, ex.getMessage()));
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
    Throwable cause = ex.getCause();
    if (cause instanceof PSQLException psqlEx) {
      return handlePSQLException(psqlEx);
    }
    return ResponseEntity
      .status(HttpStatus.CONFLICT)
      .body(new ErrorResponse(ErrorCodes.DATA_INTEGRITY_VIOLATION, ex.getMostSpecificCause().getMessage()));
  }

  private ResponseEntity<ErrorResponse> handlePSQLException(PSQLException ex) {
    String sqlState = ex.getSQLState();
    String message = ex.getMessage();
    String constraint = ex.getServerErrorMessage() != null ? ex.getServerErrorMessage().getConstraint() : null;
    String detail = ex.getServerErrorMessage() != null ? ex.getServerErrorMessage().getDetail() : null;

    // Unique constraint violations
    if (PSQLState.UNIQUE_VIOLATION.getState().equals(sqlState)) {
      return ResponseEntity
        .status(HttpStatus.CONFLICT)
        .body(new ErrorResponse(ErrorCodes.UNIQUE_CONSTRAINT_VIOLATION, formatUniqueViolation(message, constraint), Map.of("constraint", constraint, "detail", detail)));
    }

    // Foreign key violations
    if (PSQLState.FOREIGN_KEY_VIOLATION.getState().equals(sqlState)) {
      return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(new ErrorResponse(ErrorCodes.FOREIGN_KEY_VIOLATION, formatForeignKeyViolation(message, constraint), Map.of("constraint", constraint, "detail", detail)));
    }

    // Check constraint violations
    if (PSQLState.CHECK_VIOLATION.getState().equals(sqlState)) {
      return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(new ErrorResponse(ErrorCodes.CHECK_CONSTRAINT_VIOLATION, formatCheckViolation(message, constraint), Map.of("constraint", constraint, "detail", detail)));
    }

    // Exclusion violation
    if (PSQLState.EXCLUSION_VIOLATION.getState().equals(sqlState)) {
      return ResponseEntity
        .status(HttpStatus.CONFLICT)
        .body(new ErrorResponse(ErrorCodes.EXCLUSION_VIOLATION, message, Map.of("constraint", constraint, "detail", detail)));
    }

    // Trigger exceptions (RAISE EXCEPTION) - typically P0001
    if ("P0001".equals(sqlState)) {
      return handleTriggerException(message);
    }

    // Default for other PostgreSQL errors
    return ResponseEntity
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .body(new ErrorResponse(ErrorCodes.DATABASE_ERROR, message, Map.of("sqlState", sqlState, "constraint", constraint, "detail", detail)));
  }

  private ResponseEntity<ErrorResponse> handleTriggerException(String message) {
    // Map trigger error messages to specific error codes
    if (message.contains("at least two alternatives")) {
      return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(new ErrorResponse(ErrorCodes.MIN_ALTERNATIVES_REQUIRED, "Multiple choice question must have at least two alternatives"));
    }
    if (message.contains("exactly one correct alternative")) {
      return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(new ErrorResponse(ErrorCodes.EXACTLY_ONE_CORRECT_ALTERNATIVE, "Multiple choice question must have exactly one correct alternative"));
    }
    if (message.contains("class group of assessment") && message.contains("cannot be changed")) {
      return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(new ErrorResponse(ErrorCodes.CLASS_GROUP_IMMUTABLE, "The class group of an assessment cannot be changed after creation"));
    }
    if (message.contains("not enrolled in the class group")) {
      return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(new ErrorResponse(ErrorCodes.STUDENT_NOT_ENROLLED, "Student is not enrolled in the class group of this assessment"));
    }
    if (message.contains("has assignments and cannot be removed")) {
      return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(new ErrorResponse(ErrorCodes.ENROLLMENT_HAS_ASSIGNMENTS, "Cannot remove enrollment: student has assignments in this class group"));
    }
    if (message.contains("cannot change after answers exist") && message.contains("Points")) {
      return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(new ErrorResponse(ErrorCodes.POINTS_IMMUTABLE_AFTER_ANSWERS, "Points cannot be changed after answers exist for this question"));
    }
    if (message.contains("correct alternative") && message.contains("cannot change after answers exist")) {
      return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(new ErrorResponse(ErrorCodes.CORRECT_ALTERNATIVE_IMMUTABLE, "The correct alternative cannot be changed after answers exist"));
    }
    if (message.contains("Invalid assignment status transition")) {
      return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(new ErrorResponse(ErrorCodes.INVALID_STATUS_TRANSITION, "Invalid assignment status transition"));
    }
    if (message.contains("can only be created while the assignment is IN_PROGRESS") ||
        message.contains("can only be changed while the assignment is IN_PROGRESS") ||
        message.contains("can only be removed while the assignment is IN_PROGRESS")) {
      return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(new ErrorResponse(ErrorCodes.ANSWER_ONLY_IN_PROGRESS, "Answers can only be created, changed, or removed while assignment is IN_PROGRESS"));
    }
    if (message.contains("Free text answers can only be graded while the assignment is SUBMITTED")) {
      return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(new ErrorResponse(ErrorCodes.FREE_TEXT_GRADING_ONLY_SUBMITTED, "Free text answers can only be graded while assignment is SUBMITTED"));
    }
    if (message.contains("cannot be GRADED while answers have no score")) {
      return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(new ErrorResponse(ErrorCodes.CANNOT_GRADE_WITHOUT_SCORES, "Cannot grade assignment: some answers have no score"));
    }
    if (message.contains("After GRADED, neither the content nor the scores can be altered")) {
      return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(new ErrorResponse(ErrorCodes.ANSWER_IMMUTABLE_AFTER_GRADED, "Answers and scores cannot be modified after assignment is GRADED"));
    }
    if (message.contains("exceeds the") && message.contains("points of question")) {
      return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(new ErrorResponse(ErrorCodes.SCORE_EXCEEDS_POINTS, "Score exceeds the maximum points for this question"));
    }
    if (message.contains("does not accept answer_text") || message.contains("does not accept chosen_letter")) {
      return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(new ErrorResponse(ErrorCodes.QUESTION_TYPE_MISMATCH, "Answer type does not match question type"));
    }

    // Generic trigger exception
    return ResponseEntity
      .status(HttpStatus.BAD_REQUEST)
      .body(new ErrorResponse(ErrorCodes.TRIGGER_EXCEPTION, message));
  }

  private String formatUniqueViolation(String message, String constraint) {
    if (constraint != null) {
      if (constraint.contains("enrollment_number") || constraint.contains("staff_number") || constraint.contains("email")) {
        return "A record with this value already exists";
      }
      if (constraint.contains("alternative_one_correct")) {
        return "There can only be one correct alternative per question";
      }
      if (constraint.contains("question_id_type_unique")) {
        return "Question type mismatch";
      }
      if (constraint.contains("assessment_item_position_unique")) {
        return "An item with this position already exists in the assessment";
      }
    }
    return "Duplicate value violates unique constraint";
  }

  private String formatForeignKeyViolation(String message, String constraint) {
    if (constraint != null) {
      if (constraint.contains("assignment_enrollment")) {
        return "Student is not enrolled in the class group of this assessment";
      }
      if (constraint.contains("answer_assignment")) {
        return "Can only answer an assessment assigned to this student";
      }
      if (constraint.contains("answer_assessment_item")) {
        return "Question does not belong to this assessment";
      }
      if (constraint.contains("answer_alternative")) {
        return "Selected alternative does not belong to this question";
      }
      if (constraint.contains("question_teacher")) {
        return "Referenced teacher does not exist";
      }
      if (constraint.contains("assessment_teacher") || constraint.contains("assessment_class_group")) {
        return "Referenced teacher or class group does not exist";
      }
    }
    return "Referenced record does not exist";
  }

  private String formatCheckViolation(String message, String constraint) {
    if (constraint != null) {
      if (constraint.contains("end_time > start_time")) {
        return "End time must be after start time";
      }
      if (constraint.contains("points > 0")) {
        return "Points must be greater than zero";
      }
      if (constraint.contains("position > 0")) {
        return "Position must be greater than zero";
      }
      if (constraint.contains("score >= 0")) {
        return "Score cannot be negative";
      }
      if (constraint.contains("submitted_at >= started_at")) {
        return "Submitted time must be after started time";
      }
      if (constraint.contains("single_kind")) {
        return "Answer must have either chosen_letter or answer_text, not both";
      }
      if (constraint.contains("role")) {
        return "Invalid role value";
      }
      if (constraint.contains("semester")) {
        return "Semester must be 1 or 2";
      }
      if (constraint.contains("year > 0")) {
        return "Year must be greater than zero";
      }
    }
    return "Check constraint violated";
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
    return ResponseEntity
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .body(new ErrorResponse("INTERNAL_ERROR", "An unexpected error occurred"));
  }

  public record ErrorResponse(String code, String message,Map<String, Object> details) {
    public ErrorResponse(String code, String message) {
      this(code, message, Map.of());
    }

    public ErrorResponse(String code, String message, Map<String, Object> details) {
      this.code = code;
      this.message = message;
      this.details = details;
    }
  }
}
