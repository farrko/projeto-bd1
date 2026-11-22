package br.uel.backend.model;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
public class Question {
  private UUID id;
  private UUID teacherId;
  private String statement;
  private String type;
  private LocalDateTime createdAt;
}
