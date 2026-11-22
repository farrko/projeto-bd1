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

  public ClassGroup save(ClassGroup classGroup) {
    if (classGroup.getId() == null) {
      String sql =
        """
        INSERT INTO class_group (name, year, semester)
        VALUES (?, ?, ?)
        RETURNING id, name, year, semester
        """;

      return jdbc.queryForObject(
        sql,
        rowMapper,
        classGroup.getName(),
        classGroup.getYear(),
        classGroup.getSemester()
      );
    }

    String sql =
      """
      INSERT INTO class_group (id, name, year, semester)
      VALUES (?, ?, ?, ?)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        year = EXCLUDED.year,
        semester = EXCLUDED.semester
      RETURNING id, name, year, semester
      """;

    return jdbc.queryForObject(
      sql,
      rowMapper,
      classGroup.getId(),
      classGroup.getName(),
      classGroup.getYear(),
      classGroup.getSemester()
    );
  }
}
