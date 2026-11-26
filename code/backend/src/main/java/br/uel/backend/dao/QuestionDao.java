package br.uel.backend.dao;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import br.uel.backend.model.Question;
import lombok.*;

@Repository
@RequiredArgsConstructor
public class QuestionDao {
  private final JdbcTemplate jdbc;

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

  public List<Question> findAll() {
    String sql =
      """
      SELECT id, statement, type, created_at, teacher_id
      FROM question
      """;

    return jdbc.query(sql, rowMapper);
  }

  public Question save(Question question) {
    if (question.getId() == null) {
      String sql =
        """
        INSERT INTO question (statement, type, created_at, teacher_id)
        VALUES (?, ?, COALESCE(?, LOCALTIMESTAMP), ?)
        RETURNING id, statement, type, created_at, teacher_id
        """;

      return jdbc.queryForObject(
        sql,
        rowMapper,
        question.getStatement(),
        question.getType(),
        question.getCreatedAt(),
        question.getTeacherId()
      );
    }

    String sql =
      """
      INSERT INTO question (id, statement, type, created_at, teacher_id)
      VALUES (?, ?, ?, COALESCE(?, LOCALTIMESTAMP), ?)
      ON CONFLICT (id) DO UPDATE SET
        statement = EXCLUDED.statement,
        type = EXCLUDED.type,
        teacher_id = EXCLUDED.teacher_id
      RETURNING id, statement, type, created_at, teacher_id
      """;

    return jdbc.queryForObject(
      sql,
      rowMapper,
      question.getId(),
      question.getStatement(),
      question.getType(),
      question.getCreatedAt(),
      question.getTeacherId()
    );
  }
}