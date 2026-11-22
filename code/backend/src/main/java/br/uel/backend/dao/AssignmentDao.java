package br.uel.backend.dao;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import br.uel.backend.model.Assignment;
import lombok.AllArgsConstructor;

@Repository
@AllArgsConstructor
public class AssignmentDao {
  private JdbcTemplate jdbc;

  private static RowMapper<Assignment> rowMapper = (rs, rowNum) -> Assignment.builder()
    .assessmentId(rs.getObject("assessment_id", UUID.class))
    .studentId(rs.getObject("student_id", UUID.class))
    .status(rs.getString("status"))
    .startedAt(rs.getObject("started_at", LocalDateTime.class))
    .submittedAt(rs.getObject("submitted_at", LocalDateTime.class))
    .build();

  public Optional<Assignment> findById(UUID assessmentId, UUID studentId) {
    String sql =
      """
      SELECT assessment_id, student_id, status, started_at, submitted_at
      FROM assignment
      WHERE assessment_id = ? AND student_id = ?
      """;

    try {
      return Optional.ofNullable(jdbc.queryForObject(sql, rowMapper, assessmentId, studentId));
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }

  public Assignment save(Assignment assignment) {
    String sql =
      """
      INSERT INTO assignment (assessment_id, student_id, status, started_at, submitted_at)
      VALUES (?, ?, COALESCE(?, 'ASSIGNED'), ?, ?)
      RETURNING assessment_id, student_id, status, started_at, submitted_at
      """;

    return jdbc.queryForObject(
      sql,
      rowMapper,
      assignment.getAssessmentId(),
      assignment.getStudentId(),
      assignment.getStatus(),
      assignment.getStartedAt(),
      assignment.getSubmittedAt()
    );
  }

  public Assignment update(Assignment assignment) {
    String sql =
      """
      UPDATE assignment
      SET status = ?,
          started_at = ?,
          submitted_at = ?
      WHERE assessment_id = ? AND student_id = ?
      RETURNING assessment_id, student_id, status, started_at, submitted_at
      """;

    return jdbc.queryForObject(
      sql,
      rowMapper,
      assignment.getStatus(),
      assignment.getStartedAt(),
      assignment.getSubmittedAt(),
      assignment.getAssessmentId(),
      assignment.getStudentId()
    );
  }
}
