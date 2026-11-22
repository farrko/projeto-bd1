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
import br.uel.backend.model.user.Student;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AssignmentService {
  private AssignmentDao assignmentDao;
  private AssessmentDao assessmentDao;
  private StudentDao studentDao;

  public Optional<Assignment> getAssignmentById(UUID assessmentId, UUID studentId) {
    return assignmentDao.findById(assessmentId, studentId);
  }

  public List<Assignment> getAllAssignmentsWithAssessment(Assessment assessment) {
    return assignmentDao.findAllWithAssessment(assessment.getId());
  }

  public List<Assignment> getAllAssignmentsWithAssessment(UUID assessmentId) {
    return assignmentDao.findAllWithAssessment(assessmentId);
  }

  public Assessment getAssignmentAssessment(Assignment assignment) {
    return assessmentDao.findById(assignment.getAssessmentId()).get();
  }

  public Student getAssignmentStudent(Assignment assignment) {
    return studentDao.findById(assignment.getStudentId()).get();
  }

  // .save: cria uma nova entry
  public Assignment save(Assignment assignment) {
    return assignmentDao.save(assignment);
  }

  // .update: atualiza uma entry existente (separação necessária por conta de trigger BEFORE INSERT)
  public Assignment update(Assignment assignment) {
    return assignmentDao.update(assignment);
  }
}

