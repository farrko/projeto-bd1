package br.uel.backend.dao;

import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import br.uel.backend.model.Answer;
import lombok.AllArgsConstructor;

@Repository
@AllArgsConstructor
public class AnswerDao {
  private JdbcTemplate jdbc;

  private static RowMapper<Answer> rowMapper = (rs, rowNum) -> Answer.builder()
    .assessmentId(rs.getObject("assessment_id", UUID.class))
    .studentId(rs.getObject("student_id", UUID.class))
    .questionId(rs.getObject("question_id", UUID.class))
    .chosenLetter(rs.getString("chosen_letter"))
    .answerText(rs.getString("answer_text"))
    .score(rs.getBigDecimal("score"))
    .build();

  public Optional<Answer> findById(UUID assessmentId, UUID studentId, UUID questionId) {
    String sql =
      """
      SELECT assessment_id, student_id, question_id, chosen_letter, answer_text, score
      FROM answer
      WHERE assessment_id = ? AND student_id = ? AND question_id = ?
      """;

    try {
      return Optional.ofNullable(
        jdbc.queryForObject(sql, rowMapper, assessmentId, studentId, questionId));
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }
}
