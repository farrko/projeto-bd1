package br.uel.backend.model;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
public class Assignment {
  private UUID assessmentId;
  private UUID studentId;
  private String status;
  private LocalDateTime startedAt;
  private LocalDateTime submittedAt;
}
