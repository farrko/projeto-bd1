package br.uel.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import br.uel.backend.dao.user.StudentDao;
import br.uel.backend.dao.user.TeacherDao;
import br.uel.backend.model.user.Student;
import br.uel.backend.model.user.Teacher;
import lombok.*;

@Service
@RequiredArgsConstructor
public class UserService {
  private final StudentDao studentDao;
  private final TeacherDao teacherDao;

  public Optional<Student> getStudentById(UUID id) {
    return studentDao.findById(id);
  }

  public List<Student> getAllStudents() {
    return studentDao.findAll();
  }

  public Student saveStudent(Student student) {
    if (student.getRole() == null) student.setRole("STUDENT");
    validateStudent(student);
    return studentDao.save(student);
  }

  public Optional<Teacher> getTeacherById(UUID id) {
    return teacherDao.findById(id);
  }

  public List<Teacher> getAllTeachers() {
    return teacherDao.findAll();
  }

  public Teacher saveTeacher(Teacher teacher) {
    if (teacher.getRole() == null) teacher.setRole("TEACHER");
    validateTeacher(teacher);
    return teacherDao.save(teacher);
  }

  private void validateStudent(Student student) {
    student.validateId();
    student.validateName();
    student.validateEmail();
    student.validatePassword();
    student.validateRole();
    student.validateEnrollmentNumber();
  }

  private void validateTeacher(Teacher teacher) {
    teacher.validateId();
    teacher.validateName();
    teacher.validateEmail();
    teacher.validatePassword();
    teacher.validateRole();
    teacher.validateStaffNumber();
  }
}