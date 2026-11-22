package br.uel.backend.dao;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import br.uel.backend.model.Question;
import lombok.AllArgsConstructor;

@Repository
@AllArgsConstructor
public class QuestionDao {
  private JdbcTemplate jdbc;

  private static RowMapper<Question> rowMapper = (rs, rowNum) -> Question.builder()
    .id(rs.getObject("id", UUID.class))
    .statement(rs.getString("statement"))
    .type(rs.getString("type"))
    .createdAt(rs.getObject("created_at", LocalDateTime.class))
    .teacherId(rs.getObject("teacher_id", UUID.class))
    .build();

  public Optional<Question> findById(UUID id) {
    String sql =
      """
      SELECT id, statement, type, created_at, teacher_id
      FROM question
      WHERE id = ?
      """;

    try {
      return Optional.ofNullable(jdbc.queryForObject(sql, rowMapper, id));
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }
}
