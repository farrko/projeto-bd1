package br.uel.backend.model.question;

import br.uel.backend.model.Question;
import lombok.*;
import java.util.ArrayList;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MultipleChoiceQuestion extends Question {
  private ArrayList<UUID> alternatives;
}
