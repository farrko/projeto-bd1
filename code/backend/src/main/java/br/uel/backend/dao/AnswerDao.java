package br.uel.backend.dao;

import java.util.List;
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

  public List<Answer> findAll() {
    String sql =
      """
      SELECT assessment_id, student_id, question_id, chosen_letter, answer_text, score
      FROM answer
      """;

    return jdbc.query(sql, rowMapper);
  }

  public List<Answer> findAllWithAssessment(UUID assessmentId) {
    String sql =
      """
      SELECT assessment_id, student_id, question_id, chosen_letter, answer_text, score
      FROM answer
      WHERE assessment_id = ?
      """;

    return jdbc.query(sql, rowMapper, assessmentId);
  }

  public List<Answer> findAllWithStudent(UUID studentId) {
    String sql =
      """
      SELECT assessment_id, student_id, question_id, chosen_letter, answer_text, score
      FROM answer
      WHERE student_id = ?
      """;

    return jdbc.query(sql, rowMapper, studentId);
  }

  public List<Answer> findAllWithQuestion(UUID questionId) {
    String sql =
      """
      SELECT assessment_id, student_id, question_id, chosen_letter, answer_text, score
      FROM answer
      WHERE question_id = ?
      """;

    return jdbc.query(sql, rowMapper, questionId);
  }

  public List<Answer> findAllWithAssessmentAndStudent(UUID assessmentId, UUID studentId) {
    String sql =
      """
      SELECT assessment_id, student_id, question_id, chosen_letter, answer_text, score
      FROM answer
      WHERE assessment_id = ? AND student_id = ?
      """;

    return jdbc.query(sql, rowMapper, assessmentId, studentId);
  }

  public List<Answer> findAllWithAssessmentAndQuestion(UUID assessmentId, UUID questionId) {
    String sql =
      """
      SELECT assessment_id, student_id, question_id, chosen_letter, answer_text, score
      FROM answer
      WHERE assessment_id = ? AND question_id = ?
      """;

    return jdbc.query(sql, rowMapper, assessmentId, questionId);
  }

  public List<Answer> findAllWithStudentAndQuestion(UUID studentId, UUID questionId) {
    String sql =
      """
      SELECT assessment_id, student_id, question_id, chosen_letter, answer_text, score
      FROM answer
      WHERE student_id = ? AND question_id = ?
      """;

    return jdbc.query(sql, rowMapper, studentId, questionId);
  }

  public Answer save(Answer answer) {
    String sql =
      """
      INSERT INTO answer (assessment_id, student_id, question_id, chosen_letter, answer_text, score)
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING assessment_id, student_id, question_id, chosen_letter, answer_text, score
      """;

    return jdbc.queryForObject(
      sql,
      rowMapper,
      answer.getAssessmentId(),
      answer.getStudentId(),
      answer.getQuestionId(),
      answer.getChosenLetter(),
      answer.getAnswerText(),
      answer.getScore()
    );
  }

  public Answer update(Answer answer) {
    String sql =
      """
      UPDATE answer
      SET chosen_letter = ?,
          answer_text = ?,
          score = ?
      WHERE assessment_id = ? AND student_id = ? AND question_id = ?
      RETURNING assessment_id, student_id, question_id, chosen_letter, answer_text, score
      """;

    return jdbc.queryForObject(
      sql,
      rowMapper,
      answer.getChosenLetter(),
      answer.getAnswerText(),
      answer.getScore(),
      answer.getAssessmentId(),
      answer.getStudentId(),
      answer.getQuestionId()
    );
  }
}
