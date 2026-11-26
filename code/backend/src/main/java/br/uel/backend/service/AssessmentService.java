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

  public List<Assessment> getAllAssessmentsWithClassGroup(ClassGroup classGroup) {
    return assessmentDao.findAllWithClassGroup(classGroup.getId());
  }

  public List<Assessment> getAllAssessmentsWithClassGroup(UUID classGroupId) {
    return assessmentDao.findAllWithClassGroup(classGroupId);
  }

  public List<Assessment> getAllAssessmentsWithTeacher(Teacher teacher) {
    return assessmentDao.findAllWithTeacher(teacher.getId());
  }

  public List<Assessment> getAllAssessmentsWithTeacher(UUID teacherId) {
    return assessmentDao.findAllWithTeacher(teacherId);
  }

  public List<Assessment> getAllAssessmentsWithClassGroupAndTeacher(ClassGroup classGroup, Teacher teacher) {
    return assessmentDao.findAllWithClassGroupAndTeacher(classGroup.getId(), teacher.getId());
  }

  public List<Assessment> getAllAssessmentsWithClassGroupAndTeacher(UUID classGroupId, UUID teacherId) {
    return assessmentDao.findAllWithClassGroupAndTeacher(classGroupId, teacherId);
  }

  public Teacher getAssessmentTeacher(Assessment assessment) {
    return teacherDao.findById(assessment.getTeacherId()).get();
  }

  public ClassGroup getAssessmentClassGroup(Assessment assessment) {
    if (assessment.getClassGroupId() == null) return null;
    return classGroupDao.findById(assessment.getClassGroupId()).get();
  }

  public List<AssessmentItem> getAssessmentItems(Assessment assessment) {
    return assessmentItemDao.findAllInAssessment(assessment.getId());
  }

  public Assessment saveAssessment(Assessment assessment) {
    validateAssessment(assessment);
    return assessmentDao.save(assessment);
  }

  public AssessmentItem saveAssessmentItem(AssessmentItem assessmentItem) {
    validateAssessmentItem(assessmentItem);
    return assessmentItemDao.save(assessmentItem);
  }

  private void validateAssessment(Assessment assessment) {
    assessment.validateId();
    assessment.validateTeacherId();
    assessment.validateClassGroupId();
    assessment.validateTitle();
    assessment.validateDescription();
    assessment.validateAssessmentDate();
    assessment.validateStartTime();
    assessment.validateEndTime();
  }

  private void validateAssessmentItem(AssessmentItem assessmentItem) {
    assessmentItem.validateAssessmentId();
    assessmentItem.validateQuestionId();
    assessmentItem.validatePoints();
    assessmentItem.validatePosition();
  }

  public List<AssessmentItem> reorderAssessmentItems(UUID assessmentId, List<UUID> questionIds) {
    assessmentDao.findById(assessmentId).orElseThrow(() -> new IllegalArgumentException("Assessment not found"));
    return assessmentItemDao.reorderItems(assessmentId, questionIds);
  }
}
