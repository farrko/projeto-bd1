package br.uel.backend.dao;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import br.uel.backend.model.Alternative;
import lombok.AllArgsConstructor;

@Repository
@AllArgsConstructor
public class AlternativeDao {
  private JdbcTemplate jdbc;

  private static RowMapper<Alternative> rowMapper = (rs, rowNum) -> Alternative.builder()
    .questionId(rs.getObject("question_id", UUID.class))
    .letter(rs.getString("letter"))
    .text(rs.getString("text"))
    .isCorrect(rs.getBoolean("is_correct"))
    .build();

  public Optional<Alternative> findById(UUID questionId, String letter) {
    String sql =
      """
      SELECT question_id, letter, text, is_correct
      FROM alternative
      WHERE question_id = ? AND letter = ?
      """;

    try {
      return Optional.ofNullable(jdbc.queryForObject(sql, rowMapper, questionId, letter));
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }

  public List<Alternative> findAllFromQuestion(UUID questionId) {
    String sql =
      """
      SELECT question_id, letter, text, is_correct
      FROM alternative
      WHERE question_id = ?
      ORDER BY letter
      """;

    return jdbc.query(sql, rowMapper, questionId);
  }

  public List<Alternative> findAll() {
    String sql =
      """
      SELECT question_id, letter, text, is_correct
      FROM alternative
      """;

    return jdbc.query(sql, rowMapper);
  }

  public Alternative save(Alternative alternative) {
    String sql =
      """
      INSERT INTO alternative (question_id, letter, text, is_correct)
      VALUES (?, ?, ?, ?)
      ON CONFLICT (question_id, letter) DO UPDATE SET
        text = EXCLUDED.text,
        is_correct = EXCLUDED.is_correct
      RETURNING question_id, letter, text, is_correct
      """;

    return jdbc.queryForObject(
      sql,
      rowMapper,
      alternative.getQuestionId(),
      alternative.getLetter(),
      alternative.getText(),
      Boolean.TRUE.equals(alternative.getIsCorrect())
    );
  }
}
