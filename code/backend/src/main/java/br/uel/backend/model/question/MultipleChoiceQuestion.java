package br.uel.backend.model.question;

import br.uel.backend.model.Question;
import lombok.*;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MultipleChoiceQuestion extends Question {}
