package br.uel.backend.dao.user;

import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
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
}
