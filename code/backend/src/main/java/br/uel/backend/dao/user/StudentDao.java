package br.uel.backend.dao.user;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import br.uel.backend.model.user.Student;
import lombok.*;

@Repository
@RequiredArgsConstructor
public class StudentDao {
  private final JdbcTemplate jdbc;

  private static RowMapper<Student> rowMapper = (rs, rowNum) -> Student.builder()
    .id(rs.getObject("id", UUID.class))
    .name(rs.getString("name"))
    .email(rs.getString("email"))
    .password(rs.getString("password"))
    .role(rs.getString("role"))
    .enrollmentNumber(rs.getString("enrollment_number"))
    .build();

  public Optional<Student> findById(UUID userId) {
    String sql =
      """
      SELECT u.id, u.name, u.email, u.password, u.role, s.enrollment_number
      FROM user_account u
      JOIN student s ON s.user_id = u.id
      WHERE u.id = ?
      """;

    try {
      return Optional.ofNullable(jdbc.queryForObject(sql, rowMapper, userId));
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }

  public List<Student> findAll() {
    String sql =
      """
      SELECT u.id, u.name, u.email, u.password, u.role, s.enrollment_number
      FROM user_account u
      JOIN student s ON s.user_id = u.id
      """;

    return jdbc.query(sql, rowMapper);
  }

  @Transactional
  public Student save(Student student) {
    UUID id;
    if (student.getId() == null) {
      String userSql =
        """
        INSERT INTO user_account (name, email, password, role)
        VALUES (?, ?, ?, 'STUDENT')
        RETURNING id
        """;

      id = jdbc.queryForObject(
        userSql,
        UUID.class,
        student.getName(),
        student.getEmail(),
        student.getPassword()
      );
    } else {
      String userSql =
        """
        INSERT INTO user_account (id, name, email, password, role)
        VALUES (?, ?, ?, ?, 'STUDENT')
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          password = EXCLUDED.password,
          role = 'STUDENT'
        RETURNING id
        """;

      id = jdbc.queryForObject(
        userSql,
        UUID.class,
        student.getId(),
        student.getName(),
        student.getEmail(),
        student.getPassword()
      );
    }

    String studentSql =
      """
      INSERT INTO student (user_id, role, enrollment_number)
      VALUES (?, 'STUDENT', ?)
      ON CONFLICT (user_id) DO UPDATE SET
        enrollment_number = EXCLUDED.enrollment_number
      """;

    jdbc.update(studentSql, id, student.getEnrollmentNumber());

    student.setId(id);
    student.setRole("STUDENT");
    return student;
  }
}