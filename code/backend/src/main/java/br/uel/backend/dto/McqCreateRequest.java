package br.uel.backend.dto;

import br.uel.backend.model.Alternative;
import br.uel.backend.model.question.MultipleChoiceQuestion;
import java.util.List;

public record McqCreateRequest(
    MultipleChoiceQuestion question,
    List<Alternative> alternatives
) {}