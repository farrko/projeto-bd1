package br.uel.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import br.uel.backend.dao.AssessmentDao;
import br.uel.backend.dao.ClassEnrollmentDao;
import br.uel.backend.dao.ClassGroupDao;
import br.uel.backend.dao.user.StudentDao;
import br.uel.backend.model.Assessment;
import br.uel.backend.model.ClassEnrollment;
import br.uel.backend.model.ClassGroup;
import br.uel.backend.model.user.Student;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ClassGroupService {
  private ClassGroupDao classGroupDao;
  private ClassEnrollmentDao classEnrollmentDao;
  private StudentDao studentDao;
  private AssessmentDao assessmentDao;

  public Optional<ClassGroup> getClassGroupById(UUID id) {
    return classGroupDao.findById(id);
  }

  public List<ClassGroup> getAllClassGroups() {
    return classGroupDao.findAll();
  }

  public List<Student> getAllStudentsInClassGroup(ClassGroup classGroup) {
    List<ClassEnrollment> enrollments = classEnrollmentDao.findAllInClassGroup(classGroup.getId());

    List<Student> students = new ArrayList<>();
    for (ClassEnrollment enrollment : enrollments) {
      UUID studentId = enrollment.getStudentId();
      students.add(studentDao.findById(studentId).get());
    }

    return students;
  }

  public List<Student> getAllStudentsInClassGroup(UUID classGroupId) {
    List<ClassEnrollment> enrollments = classEnrollmentDao.findAllInClassGroup(classGroupId);

    List<Student> students = new ArrayList<>();
    for (ClassEnrollment enrollment : enrollments) {
      UUID studentId = enrollment.getStudentId();
      students.add(studentDao.findById(studentId).get());
    }

    return students;
  }

  public List<Assessment> getAllAssessmentsInClassGroup(UUID classGroupId) {
    return assessmentDao.findAllWithClassGroup(classGroupId);
  }

  public ClassGroup saveClassGroup(ClassGroup classGroup) {
    validateClassGroup(classGroup);
    return classGroupDao.save(classGroup);
  }

  public ClassEnrollment saveClassEnrollment(ClassEnrollment classEnrollment) {
    validateClassEnrollment(classEnrollment);
    return classEnrollmentDao.save(classEnrollment);
  }

  private void validateClassGroup(ClassGroup classGroup) {
    classGroup.validateId();
    classGroup.validateName();
    classGroup.validateYear();
    classGroup.validateSemester();
  }

  private void validateClassEnrollment(ClassEnrollment classEnrollment) {
    classEnrollment.validateStudentId();
    classEnrollment.validateClassGroupId();
  }
}
