package br.uel.backend.model;

import lombok.*;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
public class ClassGroup {
  private UUID id;
  private String name;
  private Integer year;
  private Integer semester;
}
