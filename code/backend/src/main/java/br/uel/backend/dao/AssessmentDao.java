package br.uel.backend.dao;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import br.uel.backend.model.Assessment;
import lombok.AllArgsConstructor;

@Repository
@AllArgsConstructor
public class AssessmentDao {
  private JdbcTemplate jdbc;

  private static RowMapper<Assessment> rowMapper = (rs, rowNum) -> Assessment.builder()
    .id(rs.getObject("id", UUID.class))
    .teacherId(rs.getObject("teacher_id", UUID.class))
    .classGroupId(rs.getObject("class_group_id", UUID.class))
    .title(rs.getString("title"))
    .description(rs.getString("description"))
    .assessmentDate(rs.getObject("assessment_date", LocalDate.class))
    .startTime(rs.getObject("start_time", LocalTime.class))
    .endTime(rs.getObject("end_time", LocalTime.class))
    .build();

  public Optional<Assessment> findById(UUID id) {
    String sql =
      """
      SELECT id, teacher_id, class_group_id, title, description, assessment_date, start_time, end_time
      FROM assessment
      WHERE id = ?
      """;

    try {
      return Optional.ofNullable(jdbc.queryForObject(sql, rowMapper, id));
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }

  public List<Assessment> findAll() {
    String sql =
      """
      SELECT id, teacher_id, class_group_id, title, description, assessment_date, start_time, end_time
      FROM assessment
      """;

    return jdbc.query(sql, rowMapper);
  }

  public List<Assessment> findAllWithClassGroup(UUID classGroupId) {
    String sql =
      """
      SELECT id, teacher_id, class_group_id, title, description, assessment_date, start_time, end_time
      FROM assessment
      WHERE class_group_id = ?
      """;

    return jdbc.query(sql, rowMapper, classGroupId);
  }

  public List<Assessment> findAllWithTeacher(UUID teacherId) {
    String sql =
      """
      SELECT id, teacher_id, class_group_id, title, description, assessment_date, start_time, end_time
      FROM assessment
      WHERE teacher_id = ?
      """;

    return jdbc.query(sql, rowMapper, teacherId);
  }

  public List<Assessment> findAllWithClassGroupAndTeacher(UUID classGroupId, UUID teacherId) {
    String sql =
      """
      SELECT id, teacher_id, class_group_id, title, description, assessment_date, start_time, end_time
      FROM assessment
      WHERE class_group_id = ? AND teacher_id = ?
      """;

    return jdbc.query(sql, rowMapper, classGroupId, teacherId);
  }

  public Assessment save(Assessment assessment) {
    if (assessment.getId() == null) {
      String sql =
        """
        INSERT INTO assessment (teacher_id, class_group_id, title, description, assessment_date, start_time, end_time)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        RETURNING id, teacher_id, class_group_id, title, description, assessment_date, start_time, end_time
        """;

      return jdbc.queryForObject(
        sql,
        rowMapper,
        assessment.getTeacherId(),
        assessment.getClassGroupId(),
        assessment.getTitle(),
        assessment.getDescription(),
        assessment.getAssessmentDate(),
        assessment.getStartTime(),
        assessment.getEndTime()
      );
    }

    String sql =
      """
      INSERT INTO assessment (id, teacher_id, class_group_id, title, description, assessment_date, start_time, end_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT (id) DO UPDATE SET
        teacher_id = EXCLUDED.teacher_id,
        class_group_id = EXCLUDED.class_group_id,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        assessment_date = EXCLUDED.assessment_date,
        start_time = EXCLUDED.start_time,
        end_time = EXCLUDED.end_time
      RETURNING id, teacher_id, class_group_id, title, description, assessment_date, start_time, end_time
      """;

    return jdbc.queryForObject(
      sql,
      rowMapper,
      assessment.getId(),
      assessment.getTeacherId(),
      assessment.getClassGroupId(),
      assessment.getTitle(),
      assessment.getDescription(),
      assessment.getAssessmentDate(),
      assessment.getStartTime(),
      assessment.getEndTime()
    );
  }
}
