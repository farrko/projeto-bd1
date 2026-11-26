package br.uel.backend.dao;

import lombok.*;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import br.uel.backend.model.UserAccount;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class UserAccountDao {
  private final JdbcTemplate jdbc;

  private static RowMapper<UserAccount> rowMapper = (rs, rowNum) -> UserAccount.builder()
    .id(rs.getObject("id", UUID.class))
    .name(rs.getString("name"))
    .email(rs.getString("email"))
    .password(rs.getString("password"))
    .role(rs.getString("role"))
    .build();

  public Optional<UserAccount> findById(UUID id) {
    String sql =
      """
      SELECT id, name, email, password, role
      FROM user_account
      WHERE id = ?
      """;

    try {
      return Optional.ofNullable(jdbc.queryForObject(sql, rowMapper, id));
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }

  public List<UserAccount> findAll() {
    String sql =
      """
      SELECT id, name, email, password, role
      FROM user_account
      """;

    return jdbc.query(sql, rowMapper);
  }

  public UserAccount save(UserAccount userAccount) {
    if (userAccount.getId() == null) {
      String sql =
        """
        INSERT INTO user_account (name, email, password, role)
        VALUES (?, ?, ?, ?)
        RETURNING id, name, email, password, role
        """;

      return jdbc.queryForObject(
        sql,
        rowMapper,
        userAccount.getName(),
        userAccount.getEmail(),
        userAccount.getPassword(),
        userAccount.getRole()
      );
    }

    String sql =
      """
      INSERT INTO user_account (id, name, email, password, role)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        password = EXCLUDED.password,
        role = EXCLUDED.role
      RETURNING id, name, email, password, role
      """;

    return jdbc.queryForObject(
      sql,
      rowMapper,
      userAccount.getId(),
      userAccount.getName(),
      userAccount.getEmail(),
      userAccount.getPassword(),
      userAccount.getRole()
    );
  }
}