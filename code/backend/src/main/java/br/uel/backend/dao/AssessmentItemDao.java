package br.uel.backend.dao;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import br.uel.backend.model.AssessmentItem;
import lombok.*;

@Repository
@RequiredArgsConstructor
public class AssessmentItemDao {
  private final JdbcTemplate jdbc;

  private static RowMapper<AssessmentItem> rowMapper = (rs, rowNum) -> AssessmentItem.builder()
    .assessmentId(rs.getObject("assessment_id", UUID.class))
    .questionId(rs.getObject("question_id", UUID.class))
    .points(rs.getBigDecimal("points"))
    .position(rs.getInt("position"))
    .build();

  public Optional<AssessmentItem> findById(UUID assessmentId, UUID questionId) {
    String sql =
      """
      SELECT assessment_id, question_id, points, position
      FROM assessment_item
      WHERE assessment_id = ? AND question_id = ?
      """;

    try {
      return Optional.ofNullable(jdbc.queryForObject(sql, rowMapper, assessmentId, questionId));
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }

  public List<AssessmentItem> findAll() {
    String sql =
      """
      SELECT assessment_id, question_id, points, position
      FROM assessment_item
      """;

    return jdbc.query(sql, rowMapper);
  }

  public List<AssessmentItem> findAllInAssessment(UUID assessmentId) {
    String sql =
      """
      SELECT assessment_id, question_id, points, position
      FROM assessment_item
      WHERE assessment_id = ?
      ORDER BY position
      """;

    return jdbc.query(sql, rowMapper, assessmentId);
  }

  public AssessmentItem save(AssessmentItem assessmentItem) {
    String sql =
      """
      INSERT INTO assessment_item (assessment_id, question_id, points, position)
      VALUES (?, ?, ?, ?)
      ON CONFLICT (assessment_id, question_id) DO UPDATE SET
        points = EXCLUDED.points,
        position = EXCLUDED.position
      RETURNING assessment_id, question_id, points, position
      """;

    return jdbc.queryForObject(
      sql,
      rowMapper,
      assessmentItem.getAssessmentId(),
      assessmentItem.getQuestionId(),
      assessmentItem.getPoints(),
      assessmentItem.getPosition()
    );
  }

  @Transactional
  public List<AssessmentItem> reorderItems(UUID assessmentId, List<UUID> questionIds) {
    String sql = "UPDATE assessment_item SET position = ? WHERE assessment_id = ? AND question_id = ?";
    for (int i = 0; i < questionIds.size(); i++) {
      jdbc.update(sql, i + 1, assessmentId, questionIds.get(i));
    }
    return findAllInAssessment(assessmentId);
  }
}