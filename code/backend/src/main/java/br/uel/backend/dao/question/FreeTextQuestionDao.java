package br.uel.backend.dao.question;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import br.uel.backend.model.question.FreeTextQuestion;
import lombok.*;

@Repository
@RequiredArgsConstructor
public class FreeTextQuestionDao {
  private final JdbcTemplate jdbc;

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

  public List<FreeTextQuestion> findAll() {
    String sql =
      """
      SELECT q.id, q.statement, q.type, q.created_at, q.teacher_id, f.expected_answer
      FROM question q
      JOIN free_text_question f ON f.question_id = q.id
      """;

    return jdbc.query(sql, rowMapper);
  }

  @Transactional
  public FreeTextQuestion save(FreeTextQuestion question) {
    UUID id;
    if (question.getId() == null) {
      String sql =
        """
        INSERT INTO question (statement, type, created_at, teacher_id)
        VALUES (?, 'FREE_TEXT', COALESCE(?, LOCALTIMESTAMP), ?)
        RETURNING id, created_at
        """;

      id = jdbc.queryForObject(
        sql,
        (rs, rowNum) -> {
          UUID generatedId = rs.getObject("id", UUID.class);
          question.setId(generatedId);
          question.setCreatedAt(rs.getObject("created_at", LocalDateTime.class));
          return generatedId;
        },
        question.getStatement(),
        question.getCreatedAt(),
        question.getTeacherId()
      );
    } else {
      String sql =
        """
        INSERT INTO question (id, statement, type, created_at, teacher_id)
        VALUES (?, ?, 'FREE_TEXT', COALESCE(?, LOCALTIMESTAMP), ?)
        ON CONFLICT (id) DO UPDATE SET
          statement = EXCLUDED.statement,
          type = 'FREE_TEXT',
          teacher_id = EXCLUDED.teacher_id
        RETURNING id, created_at
        """;

      id = jdbc.queryForObject(
        sql,
        (rs, rowNum) -> {
          UUID savedId = rs.getObject("id", UUID.class);
          question.setId(savedId);
          question.setCreatedAt(rs.getObject("created_at", LocalDateTime.class));
          return savedId;
        },
        question.getId(),
        question.getStatement(),
        question.getCreatedAt(),
        question.getTeacherId()
      );
    }

    String sql =
      """
      INSERT INTO free_text_question (question_id, type, expected_answer)
      VALUES (?, 'FREE_TEXT', ?)
      ON CONFLICT (question_id) DO UPDATE SET
        expected_answer = EXCLUDED.expected_answer
      """;

    jdbc.update(sql, id, question.getExpectedAnswer());

    question.setType("FREE_TEXT");
    return question;
  }
}