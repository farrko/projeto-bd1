package br.uel.backend.dao;

import java.time.LocalDate;
import java.time.LocalTime;
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
}
