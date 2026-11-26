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
import br.uel.backend.model.question.MultipleChoiceQuestion;
import lombok.*;

@Repository
@RequiredArgsConstructor
public class MultipleChoiceQuestionDao {
  private final JdbcTemplate jdbc;

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

  public List<MultipleChoiceQuestion> findAll() {
    String sql =
      """
      SELECT q.id, q.statement, q.type, q.created_at, q.teacher_id
      FROM question q
      JOIN multiple_choice_question m ON m.question_id = q.id
      """;

    return jdbc.query(sql, rowMapper);
  }

  @Transactional
  public MultipleChoiceQuestion save(MultipleChoiceQuestion question) {
    UUID id;
    if (question.getId() == null) {
      String questionSql =
        """
        INSERT INTO question (statement, type, created_at, teacher_id)
        VALUES (?, 'MULTIPLE_CHOICE', COALESCE(?, LOCALTIMESTAMP), ?)
        RETURNING id, created_at
        """;

      id = jdbc.queryForObject(
        questionSql,
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
      String questionSql =
        """
        INSERT INTO question (id, statement, type, created_at, teacher_id)
        VALUES (?, ?, 'MULTIPLE_CHOICE', COALESCE(?, LOCALTIMESTAMP), ?)
        ON CONFLICT (id) DO UPDATE SET
          statement = EXCLUDED.statement,
          type = 'MULTIPLE_CHOICE',
          teacher_id = EXCLUDED.teacher_id
        RETURNING id, created_at
        """;

      id = jdbc.queryForObject(
        questionSql,
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

    String mcSql =
      """
      INSERT INTO multiple_choice_question (question_id, type)
      VALUES (?, 'MULTIPLE_CHOICE')
      ON CONFLICT (question_id) DO NOTHING
      """;

    jdbc.update(mcSql, id);

    question.setType("MULTIPLE_CHOICE");
    return question;
  }
}