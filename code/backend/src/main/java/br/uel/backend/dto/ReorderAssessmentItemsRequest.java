package br.uel.backend.dto;

import java.util.List;
import java.util.UUID;

public record ReorderAssessmentItemsRequest(
    List<UUID> questionIds
) {}