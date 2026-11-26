package br.uel.backend.dto;

import java.util.UUID;

public record AnswerCreateRequest(UUID questionId, String chosenLetter, String answerText) {}