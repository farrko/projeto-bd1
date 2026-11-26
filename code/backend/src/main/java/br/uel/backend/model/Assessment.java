package br.uel.backend.model;

import br.uel.backend.error.FieldValidationException;
import lombok.*;
import java.time.*;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
public class Assessment {
  private UUID id;
  private UUID teacherId;
  private UUID classGroupId;
  private String title;
  private String description;
  private LocalDate assessmentDate;
  private LocalTime startTime;
  private LocalTime endTime;

  public void validateId() {
    // nullable (auto-generated)
  }

  public void validateTeacherId() {
    if (teacherId == null) throw new FieldValidationException("teacherId", "teacherId cannot be null");
  }

  public void validateClassGroupId() {
    // nullable
  }

  public void validateTitle() {
    if (title == null) throw new FieldValidationException("title", "title cannot be null");
    if (title.isBlank()) throw new FieldValidationException("title", "title cannot be empty");
    if (title.length() > 200) throw new FieldValidationException("title", "title must be at most 200 characters");
  }

  public void validateDescription() {
    // nullable
  }

  public void validateAssessmentDate() {
    if (assessmentDate == null) throw new FieldValidationException("assessmentDate", "assessmentDate cannot be null");
  }

  public void validateStartTime() {
    if (startTime == null) throw new FieldValidationException("startTime", "startTime cannot be null");
  }

  public void validateEndTime() {
    if (endTime == null) throw new FieldValidationException("endTime", "endTime cannot be null");
  }
}