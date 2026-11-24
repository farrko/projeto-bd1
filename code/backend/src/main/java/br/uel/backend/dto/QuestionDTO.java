package br.uel.backend.dto;

import br.uel.backend.model.Alternative;
import br.uel.backend.model.question.FreeTextQuestion;
import br.uel.backend.model.question.MultipleChoiceQuestion;
import java.util.List;
import java.util.UUID;

public record QuestionDTO(
    UUID id,
    UUID teacherId,
    String statement,
    String type,
    String expectedAnswer,
    List<Alternative> alternatives
) {
    public static QuestionDTO fromFreeText(FreeTextQuestion q) {
        return new QuestionDTO(
            q.getId(),
            q.getTeacherId(),
            q.getStatement(),
            "FREE_TEXT",
            q.getExpectedAnswer(),
            List.of()
        );
    }

    public static QuestionDTO fromMultipleChoice(MultipleChoiceQuestion q, List<Alternative> alternatives) {
        return new QuestionDTO(
            q.getId(),
            q.getTeacherId(),
            q.getStatement(),
            "MULTIPLE_CHOICE",
            null,
            alternatives
        );
    }
}