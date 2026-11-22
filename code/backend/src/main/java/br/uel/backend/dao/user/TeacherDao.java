package br.uel.backend.dao.user;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import br.uel.backend.model.user.Teacher;
import lombok.AllArgsConstructor;

@Repository
@AllArgsConstructor
public class TeacherDao {
  private JdbcTemplate jdbc;

  private static RowMapper<Teacher> rowMapper = (rs, rowNum) -> Teacher.builder()
    .id(rs.getObject("id", UUID.class))
    .name(rs.getString("name"))
    .email(rs.getString("email"))
    .password(rs.getString("password"))
    .role(rs.getString("role"))
    .staffNumber(rs.getString("staff_number"))
    .build();

  public Optional<Teacher> findTeacherById(UUID userId) {
    String sql =
      """
      SELECT u.id, u.name, u.email, u.password, u.role, t.staff_number
      FROM user_account u
      JOIN teacher t ON t.user_id = u.id
      WHERE u.id = ?
      """;

    try {
      return Optional.ofNullable(jdbc.queryForObject(sql, rowMapper, userId));
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }

  public List<Teacher> findAll() {
    String sql =
      """
      SELECT u.id, u.name, u.email, u.password, u.role, t.staff_number
      FROM user_account u
      JOIN teacher t ON t.user_id = u.id
      """;

    return jdbc.query(sql, rowMapper);
  }

  @Transactional
  public Teacher save(Teacher teacher) {
    UUID id;
    if (teacher.getId() == null) {
      String userSql =
        """
        INSERT INTO user_account (name, email, password, role)
        VALUES (?, ?, ?, 'TEACHER')
        RETURNING id
        """;

      id = jdbc.queryForObject(
        userSql,
        UUID.class,
        teacher.getName(),
        teacher.getEmail(),
        teacher.getPassword()
      );
    } else {
      String userSql =
        """
        INSERT INTO user_account (id, name, email, password, role)
        VALUES (?, ?, ?, ?, 'TEACHER')
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          password = EXCLUDED.password,
          role = 'TEACHER'
        RETURNING id
        """;

      id = jdbc.queryForObject(
        userSql,
        UUID.class,
        teacher.getId(),
        teacher.getName(),
        teacher.getEmail(),
        teacher.getPassword()
      );
    }

    String teacherSql =
      """
      INSERT INTO teacher (user_id, role, staff_number)
      VALUES (?, 'TEACHER', ?)
      ON CONFLICT (user_id) DO UPDATE SET
        staff_number = EXCLUDED.staff_number
      """;

    jdbc.update(teacherSql, id, teacher.getStaffNumber());

    teacher.setId(id);
    teacher.setRole("TEACHER");
    return teacher;
  }
}
