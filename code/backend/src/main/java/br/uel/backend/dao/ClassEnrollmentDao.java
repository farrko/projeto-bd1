package br.uel.backend.dao;

import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import br.uel.backend.model.ClassEnrollment;
import lombok.AllArgsConstructor;

@Repository
@AllArgsConstructor
public class ClassEnrollmentDao {
  private JdbcTemplate jdbc;

  private static RowMapper<ClassEnrollment> rowMapper = (rs, rowNum) -> ClassEnrollment.builder()
    .studentId(rs.getObject("student_id", UUID.class))
    .classGroupId(rs.getObject("class_group_id", UUID.class))
    .build();

  public Optional<ClassEnrollment> findById(UUID studentId, UUID classGroupId) {
    String sql =
      """
      SELECT student_id, class_group_id
      FROM class_enrollment
      WHERE student_id = ? AND class_group_id = ?
      """;

    try {
      return Optional.ofNullable(jdbc.queryForObject(sql, rowMapper, studentId, classGroupId));
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }
}
