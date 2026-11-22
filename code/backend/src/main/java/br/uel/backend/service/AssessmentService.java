package br.uel.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import br.uel.backend.dao.AssessmentDao;
import br.uel.backend.dao.AssessmentItemDao;
import br.uel.backend.dao.ClassGroupDao;
import br.uel.backend.dao.user.TeacherDao;
import br.uel.backend.model.Assessment;
import br.uel.backend.model.AssessmentItem;
import br.uel.backend.model.ClassGroup;
import br.uel.backend.model.user.Teacher;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AssessmentService {
  private AssessmentDao assessmentDao;
  private AssessmentItemDao assessmentItemDao;
  private TeacherDao teacherDao;
  private ClassGroupDao classGroupDao;

  public Optional<Assessment> getAssessmentById(UUID id) {
    return assessmentDao.findById(id);
  }

  public List<Assessment> getAllAssessments() {
    return assessmentDao.findAll();
  }

  public Teacher getAssessmentTeacher(Assessment assessment) {
    return teacherDao.findTeacherById(assessment.getTeacherId()).get();
  }

  public ClassGroup getAssessmentClassGroup(Assessment assessment) {
    if (assessment.getClassGroupId() == null) return null;
    return classGroupDao.findById(assessment.getClassGroupId()).get();
  }

  public List<AssessmentItem> getAssessmentItems(Assessment assessment) {
    return assessmentItemDao.findAllInAssessment(assessment.getId());
  }
}
