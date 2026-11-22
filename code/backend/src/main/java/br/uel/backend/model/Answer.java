package br.uel.backend.model;

import br.uel.backend.error.FieldValidationException;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
public class Answer {
  private UUID assessmentId;
  private UUID studentId;
  private UUID questionId;
  private String chosenLetter;
  private String answerText;
  private BigDecimal score;

  public void validateAssessmentId() {
    if (assessmentId == null) {
      throw new FieldValidationException("assessmentId", "assessmentId cannot be null");
    }
  }

  public void validateStudentId() {
    if (studentId == null) {
      throw new FieldValidationException("studentId", "studentId cannot be null");
    }
  }

  public void validateQuestionId() {
    if (questionId == null) {
      throw new FieldValidationException("questionId", "questionId cannot be null");
    }
  }

  public void validateChosenLetter() {
    if (chosenLetter != null && !chosenLetter.matches("^[A-Z]$")) {
      throw new FieldValidationException("chosenLetter", "chosenLetter must be a single uppercase letter (A-Z)");
    }
  }

  public void validateAnswerText() {
    // nullable field, no constraints besides being optional
  }

  public void validateScore() {
    if (score != null && score.compareTo(BigDecimal.ZERO) < 0) {
      throw new FieldValidationException("score", "score must be greater than or equal to 0");
    }
  }
}
