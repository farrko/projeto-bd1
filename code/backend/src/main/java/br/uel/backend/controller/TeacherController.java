package br.uel.backend.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import br.uel.backend.model.Assessment;
import br.uel.backend.model.user.Teacher;
import br.uel.backend.service.AssessmentService;
import br.uel.backend.service.UserService;
import lombok.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users/teachers")
public class TeacherController {
  private final UserService userService;
  private final AssessmentService assessmentService;

  @GetMapping({ "", "/" })
  public ResponseEntity<List<Teacher>> all() {
    List<Teacher> teachers = userService.getAllTeachers();
    if (teachers == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    return ResponseEntity.status(HttpStatus.OK).body(teachers);
  }

  @GetMapping({ "/{id}", "/{id}/" })
  public ResponseEntity<Teacher> getById(@PathVariable UUID id) {
    Optional<Teacher> teacher = userService.getTeacherById(id);
    if (teacher.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    return ResponseEntity.status(HttpStatus.OK).body(teacher.get());
  }

  @PostMapping({ "", "/" })
  public ResponseEntity<Teacher> create(@RequestBody Teacher teacher) {
    Teacher teacherCreated = userService.saveTeacher(teacher);
    return ResponseEntity.status(HttpStatus.CREATED).body(teacherCreated);
  }

  @PatchMapping({ "/{id}", "/{id}/" })
  public ResponseEntity<Teacher> update(@PathVariable UUID id, @RequestBody Teacher updates) {
    Optional<Teacher> t = userService.getTeacherById(id);
    if (t.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    Teacher teacher = t.get();
    if (updates.getName() != null) teacher.setName(updates.getName());
    if (updates.getEmail() != null) teacher.setEmail(updates.getEmail());
    if (updates.getPassword() != null) teacher.setPassword(updates.getPassword());
    if (updates.getRole() != null) teacher.setRole(updates.getRole());
    if (updates.getStaffNumber() != null) teacher.setStaffNumber(updates.getStaffNumber());

    Teacher teacherUpdated = userService.saveTeacher(teacher);

    return ResponseEntity.status(HttpStatus.OK).body(teacherUpdated);
  }

  @GetMapping({ "/{id}/assessments", "/{id}/assessments/" })
  public ResponseEntity<List<Assessment>> getAssessments(@PathVariable UUID id) {
    Optional<Teacher> teacher = userService.getTeacherById(id);
    if (teacher.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    List<Assessment> assessments = assessmentService.getAllAssessmentsWithTeacher(id);
    return ResponseEntity.status(HttpStatus.OK).body(assessments);
  }
}