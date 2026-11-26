package br.uel.backend.dao;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import br.uel.backend.model.report.AssessmentAverageReport;
import br.uel.backend.model.report.MostMissedQuestionReport;
import br.uel.backend.model.report.ScoreDistributionBand;
import br.uel.backend.model.report.StudentVsClassAverageReport;
import lombok.AllArgsConstructor;

@Repository
@AllArgsConstructor
public class ReportDao {
  private JdbcTemplate jdbc;

  private static final RowMapper<AssessmentAverageReport> ASSESSMENT_AVERAGE_ROW_MAPPER = (rs, rowNum) ->
    AssessmentAverageReport.builder()
      .assessmentId(rs.getObject("assessment_id", UUID.class))
      .title(rs.getString("title"))
      .classGroup(rs.getString("class_group"))
      .assessmentDate(rs.getObject("assessment_date", LocalDate.class))
      .gradedCount(rs.getLong("graded_count"))
      .averageScore(rs.getBigDecimal("average_score"))
      .maxScore(rs.getBigDecimal("max_score"))
      .averagePercent(rs.getBigDecimal("average_percent"))
      .lowestScore(rs.getBigDecimal("lowest_score"))
      .highestScore(rs.getBigDecimal("highest_score"))
      .build();

  private static final RowMapper<ScoreDistributionBand> SCORE_DISTRIBUTION_ROW_MAPPER = (rs, rowNum) ->
    ScoreDistributionBand.builder()
      .scoreRange(rs.getString("score_range"))
      .studentCount(rs.getLong("student_count"))
      .build();

  private static final RowMapper<StudentVsClassAverageReport> STUDENT_VS_CLASS_AVERAGE_ROW_MAPPER = (rs, rowNum) ->
    StudentVsClassAverageReport.builder()
      .assessmentDate(rs.getObject("assessment_date", LocalDate.class))
      .title(rs.getString("title"))
      .studentScore(rs.getBigDecimal("student_score"))
      .classAverage(rs.getBigDecimal("class_average"))
      .difference(rs.getBigDecimal("difference"))
      .build();

  private static final RowMapper<MostMissedQuestionReport> MOST_MISSED_QUESTION_ROW_MAPPER = (rs, rowNum) ->
    MostMissedQuestionReport.builder()
      .errorRank(rs.getLong("error_rank"))
      .questionId(rs.getObject("question_id", UUID.class))
      .statement(rs.getString("statement"))
      .answerCount(rs.getLong("answer_count"))
      .wrongCount(rs.getLong("wrong_count"))
      .errorPercent(rs.getBigDecimal("error_percent"))
      .build();

  public List<AssessmentAverageReport> findAssessmentAverages(LocalDate startDate, LocalDate endDate, int minGraded) {
    String sql =
      """
      SELECT
        a.id AS assessment_id,
        a.title,
        COALESCE(cg.name, 'Sem turma') AS class_group,
        a.assessment_date,
        COUNT(*) AS graded_count,
        ROUND(AVG(s.total_score), 2) AS average_score,
        m.max_score,
        ROUND(100 * AVG(s.total_score) / m.max_score, 1) AS average_percent,
        MIN(s.total_score) AS lowest_score,
        MAX(s.total_score) AS highest_score
      FROM assignment_total_score s
      JOIN assessment a ON a.id = s.assessment_id
      LEFT JOIN class_group cg ON cg.id = a.class_group_id
      JOIN (SELECT assessment_id, SUM(points) AS max_score FROM assessment_item GROUP BY assessment_id) m ON m.assessment_id = a.id
      WHERE s.status = 'GRADED' AND a.assessment_date BETWEEN ? AND ?
      GROUP BY a.id, a.title, cg.name, a.assessment_date, m.max_score
      HAVING COUNT(*) >= ?
      ORDER BY a.assessment_date
      """;

    return jdbc.query(sql, ASSESSMENT_AVERAGE_ROW_MAPPER, startDate, endDate, minGraded);
  }

  public List<ScoreDistributionBand> findScoreDistributionByAssessment(UUID assessmentId) {
    String sql =
      """
      SELECT
        b.label AS score_range,
        COUNT(g.student_id) AS student_count
      FROM (VALUES
        (1, '0% a 24%', 0, 25),
        (2, '25% a 49%', 25, 50),
        (3, '50% a 74%', 50, 75),
        (4, '75% a 100%', 75, 101)
      ) AS b(band_order, label, lower_percent, upper_percent)
      LEFT JOIN (
        SELECT s.student_id, 100 * s.total_score / m.max_score AS percent
        FROM assignment_total_score s
        JOIN (SELECT assessment_id, SUM(points) AS max_score FROM assessment_item GROUP BY assessment_id) m ON m.assessment_id = s.assessment_id
        WHERE s.assessment_id = ? AND s.status = 'GRADED'
      ) g ON g.percent >= b.lower_percent AND g.percent < b.upper_percent
      GROUP BY b.band_order, b.label
      ORDER BY b.band_order
      """;

    return jdbc.query(sql, SCORE_DISTRIBUTION_ROW_MAPPER, assessmentId);
  }

  public List<StudentVsClassAverageReport> findStudentVsClassAverage(UUID studentId) {
    String sql =
      """
      SELECT
        a.assessment_date,
        a.title,
        s.total_score AS student_score,
        c.class_average,
        ROUND(s.total_score - c.class_average, 2) AS difference
      FROM assignment_total_score s
      JOIN assessment a ON a.id = s.assessment_id
      CROSS JOIN LATERAL (
        SELECT ROUND(AVG(o.total_score), 2) AS class_average
        FROM assignment_total_score o
        WHERE o.assessment_id = s.assessment_id AND o.status = 'GRADED'
      ) c
      WHERE s.student_id = ? AND s.status = 'GRADED'
      ORDER BY a.assessment_date
      """;

    return jdbc.query(sql, STUDENT_VS_CLASS_AVERAGE_ROW_MAPPER, studentId);
  }

  public List<MostMissedQuestionReport> findMostMissedQuestions(LocalDate startDate, LocalDate endDate, int minAnswers, int top, String search) {
    String sql =
      """
      SELECT
        RANK() OVER (ORDER BY COUNT(*) FILTER (WHERE ans.score < i.points)::numeric / COUNT(*) DESC) AS error_rank,
        q.id AS question_id,
        LEFT(q.statement, 90) AS statement,
        COUNT(*) AS answer_count,
        COUNT(*) FILTER (WHERE ans.score < i.points) AS wrong_count,
        ROUND(100.0 * COUNT(*) FILTER (WHERE ans.score < i.points) / COUNT(*), 1) AS error_percent
      FROM answer ans
      JOIN assessment_item i ON i.assessment_id = ans.assessment_id AND i.question_id = ans.question_id
      JOIN question q ON q.id = ans.question_id
      JOIN assessment a ON a.id = ans.assessment_id
      JOIN assignment asg ON asg.assessment_id = ans.assessment_id AND asg.student_id = ans.student_id
      WHERE q.type = 'MULTIPLE_CHOICE'
        AND asg.status IN ('SUBMITTED', 'GRADED')
        AND ans.score IS NOT NULL
        AND a.assessment_date BETWEEN ? AND ?
        AND LOWER(q.statement) LIKE '%' || LOWER(?) || '%'
      GROUP BY q.id, q.statement
      HAVING COUNT(*) >= ?
      ORDER BY error_rank, q.statement
      FETCH FIRST ? ROWS ONLY
      """;

    return jdbc.query(sql, MOST_MISSED_QUESTION_ROW_MAPPER, startDate, endDate, search, minAnswers, top);
  }
}
