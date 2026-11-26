package br.uel.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import br.uel.backend.dao.AssessmentDao;
import br.uel.backend.dao.AssignmentDao;
import br.uel.backend.dao.user.StudentDao;
import br.uel.backend.model.Assessment;
import br.uel.backend.model.Assignment;
import br.uel.backend.model.AssignmentWithScore;
import br.uel.backend.model.user.Student;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class AssignmentService {
  private AssignmentDao assignmentDao;
  private AssessmentDao assessmentDao;
  private StudentDao studentDao;

  public Optional<Assignment> getAssignmentById(UUID assessmentId, UUID studentId) {
    return assignmentDao.findById(assessmentId, studentId);
  }

  public List<Assignment> getAllAssignments() {
    return assignmentDao.findAll();
  }

  public List<Assignment> getAllAssignmentsWithAssessment(Assessment assessment) {
    return assignmentDao.findAllWithAssessment(assessment.getId());
  }

  public List<Assignment> getAllAssignmentsWithAssessment(UUID assessmentId) {
    return assignmentDao.findAllWithAssessment(assessmentId);
  }

  public List<Assignment> getAllAssignmentsWithStudent(Student student) {
    return assignmentDao.findAllWithStudent(student.getId());
  }

  public List<Assignment> getAllAssignmentsWithStudent(UUID studentId) {
    return assignmentDao.findAllWithStudent(studentId);
  }

  public Assessment getAssignmentAssessment(Assignment assignment) {
    return assessmentDao.findById(assignment.getAssessmentId()).get();
  }

  public Student getAssignmentStudent(Assignment assignment) {
    return studentDao.findById(assignment.getStudentId()).get();
  }

  public Optional<AssignmentWithScore> getAssignmentWithScore(UUID assessmentId, UUID studentId) {
    return assignmentDao.findWithScore(assessmentId, studentId);
  }

  // .save: cria uma nova entry
  public Assignment save(Assignment assignment) {
    validateAssignment(assignment);
    return assignmentDao.save(assignment);
  }

  // .update: atualiza uma entry existente (separação necessária por conta de trigger BEFORE INSERT)
  public Assignment update(Assignment assignment) {
    validateAssignment(assignment);
    return assignmentDao.update(assignment);
  }

  private void validateAssignment(Assignment assignment) {
    assignment.validateAssessmentId();
    assignment.validateStudentId();
    assignment.validateStatus();
    assignment.validateStartedAt();
    assignment.validateSubmittedAt();
  }

  public Assignment startAssignment(UUID assessmentId, UUID studentId) {
    Optional<Assignment> existing = assignmentDao.findById(assessmentId, studentId);
    if (existing.isEmpty()) {
      throw new IllegalArgumentException("Assignment not found");
    }
    Assignment assignment = existing.get();
    if (!"ASSIGNED".equals(assignment.getStatus())) {
      throw new IllegalArgumentException("Can only start an ASSIGNED assignment");
    }
    assignment.setStatus("IN_PROGRESS");
    assignment.setStartedAt(LocalDateTime.now());
    return assignmentDao.update(assignment);
  }

  public Assignment submitAssignment(UUID assessmentId, UUID studentId) {
    Optional<Assignment> existing = assignmentDao.findById(assessmentId, studentId);
    if (existing.isEmpty()) {
      throw new IllegalArgumentException("Assignment not found");
    }
    Assignment assignment = existing.get();
    if (!"IN_PROGRESS".equals(assignment.getStatus())) {
      throw new IllegalArgumentException("Can only submit an IN_PROGRESS assignment");
    }
    assignment.setStatus("SUBMITTED");
    assignment.setSubmittedAt(LocalDateTime.now());
    return assignmentDao.update(assignment);
  }

  public Assignment gradeAssignment(UUID assessmentId, UUID studentId) {
    Optional<Assignment> existing = assignmentDao.findById(assessmentId, studentId);
    if (existing.isEmpty()) {
      throw new IllegalArgumentException("Assignment not found");
    }
    Assignment assignment = existing.get();
    if (!"SUBMITTED".equals(assignment.getStatus())) {
      throw new IllegalArgumentException("Can only grade a SUBMITTED assignment");
    }
    assignment.setStatus("GRADED");
    return assignmentDao.update(assignment);
  }

  public List<Assignment> assignStudentsToAssessment(UUID assessmentId, List<UUID> studentIds) {
    assessmentDao.findById(assessmentId).orElseThrow(() -> new IllegalArgumentException("Assessment not found"));

    List<Assignment> created = new java.util.ArrayList<>();
    for (UUID studentId : studentIds) {
      studentDao.findById(studentId).orElseThrow(() -> new IllegalArgumentException("Student not found: " + studentId));

      Assignment assignment = Assignment.builder()
        .assessmentId(assessmentId)
        .studentId(studentId)
        .status("ASSIGNED")
        .build();

      Assignment saved = assignmentDao.save(assignment);
      created.add(saved);
    }
    return created;
  }
}

