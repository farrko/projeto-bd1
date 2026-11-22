package br.uel.backend.model;

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
}
