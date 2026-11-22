package br.uel.backend.dao.question;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import br.uel.backend.model.question.MultipleChoiceQuestion;
import lombok.AllArgsConstructor;

@Repository
@AllArgsConstructor
public class MultipleChoiceQuestionDao {
  private JdbcTemplate jdbc;

  private static RowMapper<MultipleChoiceQuestion> rowMapper = (rs, rowNum) -> MultipleChoiceQuestion.builder()
    .id(rs.getObject("id", UUID.class))
    .statement(rs.getString("statement"))
    .type(rs.getString("type"))
    .createdAt(rs.getObject("created_at", LocalDateTime.class))
    .teacherId(rs.getObject("teacher_id", UUID.class))
    .build();

  public Optional<MultipleChoiceQuestion> findById(UUID id) {
    String sql =
      """
      SELECT q.id, q.statement, q.type, q.created_at, q.teacher_id
      FROM question q
      JOIN multiple_choice_question m ON m.question_id = q.id
      WHERE q.id = ?
      """;

    try {
      return Optional.ofNullable(jdbc.queryForObject(sql, rowMapper, id));
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }
}
