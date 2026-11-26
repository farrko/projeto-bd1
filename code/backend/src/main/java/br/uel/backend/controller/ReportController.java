package br.uel.backend.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.uel.backend.model.report.AssessmentAverageReport;
import br.uel.backend.model.report.MostMissedQuestionReport;
import br.uel.backend.model.report.ScoreDistributionBand;
import br.uel.backend.model.report.StudentVsClassAverageReport;
import br.uel.backend.service.ReportService;
import lombok.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reports")
public class ReportController {
  private final ReportService reportService;

  @GetMapping({ "/assessment-averages", "/assessment-averages/" })
  public ResponseEntity<List<AssessmentAverageReport>> getAssessmentAverages(
    @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
    @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
    @RequestParam(required = false) Integer minGraded
  ) {
    List<AssessmentAverageReport> report = reportService.getAssessmentAverages(startDate, endDate, minGraded);
    return ResponseEntity.status(HttpStatus.OK).body(report);
  }

  @GetMapping({ "/assessments/{id}/score-distribution", "/assessments/{id}/score-distribution/" })
  public ResponseEntity<List<ScoreDistributionBand>> getScoreDistribution(@PathVariable UUID id) {
    Optional<List<ScoreDistributionBand>> report = reportService.getScoreDistribution(id);
    if (report.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    return ResponseEntity.status(HttpStatus.OK).body(report.get());
  }

  @GetMapping({ "/students/{id}/vs-class-average", "/students/{id}/vs-class-average/" })
  public ResponseEntity<List<StudentVsClassAverageReport>> getStudentVsClassAverage(@PathVariable UUID id) {
    Optional<List<StudentVsClassAverageReport>> report = reportService.getStudentVsClassAverage(id);
    if (report.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    return ResponseEntity.status(HttpStatus.OK).body(report.get());
  }

  @GetMapping({ "/questions/most-missed", "/questions/most-missed/" })
  public ResponseEntity<List<MostMissedQuestionReport>> getMostMissedQuestions(
    @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
    @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
    @RequestParam(required = false) Integer minAnswers,
    @RequestParam(required = false) Integer top,
    @RequestParam(required = false) String search
  ) {
    List<MostMissedQuestionReport> report = reportService.getMostMissedQuestions(startDate, endDate, minAnswers, top, search);
    return ResponseEntity.status(HttpStatus.OK).body(report);
  }
}