package br.uel.backend.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import br.uel.backend.model.Assessment;
import br.uel.backend.model.ClassGroup;
import br.uel.backend.model.user.Student;
import br.uel.backend.service.ClassGroupService;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/classes")
public class ClassController {
  private ClassGroupService classGroupService;

  @GetMapping({ "", "/" })
  public ResponseEntity<List<ClassGroup>> all() {
    List<ClassGroup> classes = classGroupService.getAllClassGroups();
    if (classes == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    return ResponseEntity.status(HttpStatus.OK).body(classes);
  }

  @GetMapping({ "/{id}" ,"/{id}/" })
  public ResponseEntity<ClassGroup> getById(@PathVariable UUID id) {
    Optional<ClassGroup> classGroup = classGroupService.getClassGroupById(id);
    if (classGroup.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    return ResponseEntity.status(HttpStatus.OK).body(classGroup.get());
  }

  @PostMapping({ "", "/" })
  public ResponseEntity<ClassGroup> create(@RequestBody ClassGroup classGroup) {
    ClassGroup classGroupCreated = classGroupService.saveClassGroup(classGroup);
    return ResponseEntity.status(HttpStatus.CREATED).body(classGroupCreated);
  }

  @PatchMapping({ "/{id}" ,"/{id}/" })
  public ResponseEntity<ClassGroup> update(@PathVariable UUID id, @RequestBody ClassGroup updates) {
    Optional<ClassGroup> c = classGroupService.getClassGroupById(id);
    if (c.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    ClassGroup classGroup = c.get();
    if (updates.getName() != null) classGroup.setName(updates.getName());
    if (updates.getYear() != null) classGroup.setYear(updates.getYear());
    if (updates.getSemester() != null) classGroup.setSemester(updates.getSemester());

    ClassGroup classGroupUpdated = classGroupService.saveClassGroup(classGroup);

    return ResponseEntity.status(HttpStatus.OK).body(classGroupUpdated);
  }

  @GetMapping({ "/{id}/students", "/{id}/students/" })
  public ResponseEntity<List<Student>> getStudents(@PathVariable UUID id) {
    Optional<ClassGroup> classGroup = classGroupService.getClassGroupById(id);
    if (classGroup.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    List<Student> students = classGroupService.getAllStudentsInClassGroup(id);
    return ResponseEntity.status(HttpStatus.OK).body(students);
  }

  @GetMapping({ "/{id}/assessments", "/{id}/assessments/" })
  public ResponseEntity<List<Assessment>> getAssessments(@PathVariable UUID id) {
    Optional<ClassGroup> classGroup = classGroupService.getClassGroupById(id);
    if (classGroup.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    List<Assessment> assessments = classGroupService.getAllAssessmentsInClassGroup(id);
    return ResponseEntity.status(HttpStatus.OK).body(assessments);
  }
}
