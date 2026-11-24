package br.uel.backend.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import br.uel.backend.model.user.Student;
import br.uel.backend.service.UserService;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/users/students")
public class StudentController {
  private UserService userService;

  @GetMapping({ "", "/" })
  public ResponseEntity<List<Student>> all() {
    List<Student> students = userService.getAllStudents();
    if (students == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    return ResponseEntity.status(HttpStatus.OK).body(students);
  }

  @GetMapping({ "/{id}", "/{id}/" })
  public ResponseEntity<Student> getById(@PathVariable UUID id) {
    Optional<Student> student = userService.getStudentById(id);
    if (student.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    return ResponseEntity.status(HttpStatus.OK).body(student.get());
  }

  @PostMapping({ "", "/" })
  public ResponseEntity<Student> create(@RequestBody Student student) {
    Student studentCreated = userService.saveStudent(student);
    return ResponseEntity.status(HttpStatus.CREATED).body(studentCreated);
  }

  @PatchMapping({ "/{id}", "/{id}/" })
  public ResponseEntity<Student> update(@PathVariable UUID id, @RequestBody Student updates) {
    Optional<Student> s = userService.getStudentById(id);
    if (s.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    Student student = s.get();
    if (updates.getName() != null) student.setName(updates.getName());
    if (updates.getEmail() != null) student.setEmail(updates.getEmail());
    if (updates.getPassword() != null) student.setPassword(updates.getPassword());
    if (updates.getRole() != null) student.setRole(updates.getRole());
    if (updates.getEnrollmentNumber() != null) student.setEnrollmentNumber(updates.getEnrollmentNumber());

    Student studentUpdated = userService.saveStudent(student);

    return ResponseEntity.status(HttpStatus.OK).body(studentUpdated);
  }
}
