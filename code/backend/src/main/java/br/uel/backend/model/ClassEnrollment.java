package br.uel.backend.model;

import lombok.*;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
public class ClassEnrollment {
  private UUID studentId;
  private UUID classGroupId;
}
