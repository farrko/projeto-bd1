package br.uel.backend.dao.question;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import br.uel.backend.model.question.FreeTextQuestion;
import lombok.AllArgsConstructor;

@Repository
@AllArgsConstructor
public class FreeTextQuestionDao {
  private JdbcTemplate jdbc;

  private static RowMapper<FreeTextQuestion> rowMapper = (rs, rowNum) -> FreeTextQuestion.builder()
    .id(rs.getObject("id", UUID.class))
    .statement(rs.getString("statement"))
    .type(rs.getString("type"))
    .createdAt(rs.getObject("created_at", LocalDateTime.class))
    .teacherId(rs.getObject("teacher_id", UUID.class))
    .expectedAnswer(rs.getString("expected_answer"))
    .build();

  public Optional<FreeTextQuestion> findById(UUID id) {
    String sql =
      """
      SELECT q.id, q.statement, q.type, q.created_at, q.teacher_id, f.expected_answer
      FROM question q
      JOIN free_text_question f ON f.question_id = q.id
      WHERE q.id = ?
      """;

    try {
      return Optional.ofNullable(jdbc.queryForObject(sql, rowMapper, id));
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }
}
