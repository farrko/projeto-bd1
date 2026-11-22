package br.uel.backend.dao;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import br.uel.backend.model.UserAccount;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class UserAccountDao {
  private JdbcTemplate jdbc;

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
}
