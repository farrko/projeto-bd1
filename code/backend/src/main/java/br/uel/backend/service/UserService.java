package br.uel.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import br.uel.backend.dao.user.StudentDao;
import br.uel.backend.dao.user.TeacherDao;
import br.uel.backend.model.user.Student;
import br.uel.backend.model.user.Teacher;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {
  private StudentDao studentDao;
  private TeacherDao teacherDao;

  public Optional<Student> getStudentById(UUID id) {
    return studentDao.findById(id);
  }

  public List<Student> getAllStudents() {
    return studentDao.findAll();
  }

  public Student saveStudent(Student student) {
    return studentDao.save(student);
  }

  public Optional<Teacher> getTeacherById(UUID id) {
    return teacherDao.findById(id);
  }

  public List<Teacher> getAllTeachers() {
    return teacherDao.findAll();
  }

  public Teacher saveTeacher(Teacher teacher) {
    return teacherDao.save(teacher);
  }
}
