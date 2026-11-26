package br.uel.backend.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import br.uel.backend.dao.AssessmentDao;
import br.uel.backend.dao.ReportDao;
import br.uel.backend.dao.user.StudentDao;
import br.uel.backend.error.FieldValidationException;
import br.uel.backend.model.report.AssessmentAverageReport;
import br.uel.backend.model.report.MostMissedQuestionReport;
import br.uel.backend.model.report.ScoreDistributionBand;
import br.uel.backend.model.report.StudentVsClassAverageReport;
import lombok.*;

@Service
@RequiredArgsConstructor
public class ReportService {
  private static final LocalDate DEFAULT_START_DATE = LocalDate.of(1900, 1, 1);
  private static final LocalDate DEFAULT_END_DATE = LocalDate.of(9999, 12, 31);
  private static final int DEFAULT_MIN_GRADED = 1;
  private static final int DEFAULT_MIN_ANSWERS = 1;
  private static final int DEFAULT_TOP = 10;

  private final ReportDao reportDao;
  private final AssessmentDao assessmentDao;
  private final StudentDao studentDao;

  public List<AssessmentAverageReport> getAssessmentAverages(LocalDate startDate, LocalDate endDate, Integer minGraded) {
    LocalDate effectiveStartDate = startDate != null ? startDate : DEFAULT_START_DATE;
    LocalDate effectiveEndDate = endDate != null ? endDate : DEFAULT_END_DATE;
    int effectiveMinGraded = minGraded != null ? minGraded : DEFAULT_MIN_GRADED;

    if (effectiveStartDate.isAfter(effectiveEndDate)) throw new FieldValidationException("startDate", "startDate cannot be after endDate");
    if (effectiveMinGraded < 0) throw new FieldValidationException("minGraded", "minGraded cannot be negative");

    return reportDao.findAssessmentAverages(effectiveStartDate, effectiveEndDate, effectiveMinGraded);
  }

  public Optional<List<ScoreDistributionBand>> getScoreDistribution(UUID assessmentId) {
    if (assessmentDao.findById(assessmentId).isEmpty()) return Optional.empty();
    return Optional.of(reportDao.findScoreDistributionByAssessment(assessmentId));
  }

  public Optional<List<StudentVsClassAverageReport>> getStudentVsClassAverage(UUID studentId) {
    if (studentDao.findById(studentId).isEmpty()) return Optional.empty();
    return Optional.of(reportDao.findStudentVsClassAverage(studentId));
  }

  public List<MostMissedQuestionReport> getMostMissedQuestions(LocalDate startDate, LocalDate endDate, Integer minAnswers, Integer top, String search) {
    LocalDate effectiveStartDate = startDate != null ? startDate : DEFAULT_START_DATE;
    LocalDate effectiveEndDate = endDate != null ? endDate : DEFAULT_END_DATE;
    int effectiveMinAnswers = minAnswers != null ? minAnswers : DEFAULT_MIN_ANSWERS;
    int effectiveTop = top != null ? top : DEFAULT_TOP;
    String effectiveSearch = search != null ? search : "";

    if (effectiveStartDate.isAfter(effectiveEndDate)) throw new FieldValidationException("startDate", "startDate cannot be after endDate");
    if (effectiveMinAnswers < 1) throw new FieldValidationException("minAnswers", "minAnswers must be at least 1");
    if (effectiveTop < 1) throw new FieldValidationException("top", "top must be at least 1");

    return reportDao.findMostMissedQuestions(effectiveStartDate, effectiveEndDate, effectiveMinAnswers, effectiveTop, effectiveSearch);
  }
}