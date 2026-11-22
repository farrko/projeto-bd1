package br.uel.backend.dao;

import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import br.uel.backend.model.ClassGroup;
import lombok.AllArgsConstructor;

@Repository
@AllArgsConstructor
public class ClassGroupDao {
  private JdbcTemplate jdbc;

  private static RowMapper<ClassGroup> rowMapper = (rs, rowNum) -> ClassGroup.builder()
    .id(rs.getObject("id", UUID.class))
    .name(rs.getString("name"))
    .year(rs.getInt("year"))
    .semester(rs.getInt("semester"))
    .build();

  public Optional<ClassGroup> findById(UUID id) {
    String sql =
      """
      SELECT id, name, year, semester
      FROM class_group
      WHERE id = ?
      """;

    try {
      return Optional.ofNullable(jdbc.queryForObject(sql, rowMapper, id));
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }
}
