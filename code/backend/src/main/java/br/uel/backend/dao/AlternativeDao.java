package br.uel.backend.dao;

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
}
