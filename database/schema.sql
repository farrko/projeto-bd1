-- Usuários

CREATE TABLE user_account (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL,
  CONSTRAINT user_account_role_check CHECK (role IN ('STUDENT', 'TEACHER')),
  CONSTRAINT user_account_id_role_unique UNIQUE (id, role)
);

CREATE TABLE student (
  user_id UUID PRIMARY KEY,
  role VARCHAR(10) NOT NULL DEFAULT 'STUDENT',
  enrollment_number VARCHAR(20) NOT NULL UNIQUE,
  CONSTRAINT student_role_check CHECK (role = 'STUDENT'),
  CONSTRAINT student_user_account_fk FOREIGN KEY (user_id, role) REFERENCES user_account (id, role)
);

CREATE TABLE teacher (
  user_id UUID PRIMARY KEY,
  role VARCHAR(10) NOT NULL DEFAULT 'TEACHER',
  staff_number VARCHAR(20) NOT NULL UNIQUE,
  CONSTRAINT teacher_role_check CHECK (role = 'TEACHER'),
  CONSTRAINT teacher_user_account_fk FOREIGN KEY (user_id, role) REFERENCES user_account (id, role)
);

-- Turmas

CREATE TABLE class_group (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  year SMALLINT NOT NULL,
  semester SMALLINT NOT NULL,
  CONSTRAINT class_group_year_check CHECK (year > 0),
  CONSTRAINT class_group_semester_check CHECK (semester IN (1, 2)),
  CONSTRAINT class_group_name_year_semester_unique UNIQUE (name, year, semester)
);

CREATE TABLE class_enrollment (
  student_id UUID NOT NULL REFERENCES student (user_id),
  class_group_id UUID NOT NULL REFERENCES class_group (id),
  PRIMARY KEY (student_id, class_group_id)
);

-- Questões

CREATE TABLE question (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  statement TEXT NOT NULL,
  type VARCHAR(15) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  teacher_id UUID NOT NULL REFERENCES teacher (user_id),
  CONSTRAINT question_type_check CHECK (type IN ('MULTIPLE_CHOICE', 'FREE_TEXT')),
  CONSTRAINT question_id_type_unique UNIQUE (id, type)
);

CREATE TABLE multiple_choice_question (
  question_id UUID PRIMARY KEY,
  type VARCHAR(15) NOT NULL DEFAULT 'MULTIPLE_CHOICE',
  CONSTRAINT multiple_choice_question_type_check CHECK (type = 'MULTIPLE_CHOICE'),
  CONSTRAINT multiple_choice_question_question_fk FOREIGN KEY (question_id, type) REFERENCES question (id, type)
);

CREATE TABLE free_text_question (
  question_id UUID PRIMARY KEY,
  type VARCHAR(15) NOT NULL DEFAULT 'FREE_TEXT',
  expected_answer TEXT,
  CONSTRAINT free_text_question_type_check CHECK (type = 'FREE_TEXT'),
  CONSTRAINT free_text_question_question_fk FOREIGN KEY (question_id, type) REFERENCES question (id, type)
);

CREATE TABLE alternative (
  question_id UUID NOT NULL,
  letter CHAR(1) NOT NULL,
  text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (question_id, letter),
  CONSTRAINT alternative_letter_check CHECK (letter ~ '^[A-Z]$'),
  CONSTRAINT alternative_question_fk FOREIGN KEY (question_id) REFERENCES multiple_choice_question (question_id) ON DELETE CASCADE
);

-- Restrição de uma alternativa correta por questão
CREATE UNIQUE INDEX alternative_one_correct_per_question ON alternative (question_id) WHERE is_correct;

-- Avaliações

CREATE TABLE assessment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  assessment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  teacher_id UUID NOT NULL REFERENCES teacher (user_id),
  class_group_id UUID REFERENCES class_group (id),
  CONSTRAINT assessment_time_check CHECK (end_time > start_time)
);

CREATE TABLE assessment_item (
  assessment_id UUID NOT NULL REFERENCES assessment (id),
  question_id UUID NOT NULL REFERENCES question (id),
  points NUMERIC(5,2) NOT NULL,
  position SMALLINT NOT NULL,
  PRIMARY KEY (assessment_id, question_id),
  CONSTRAINT assessment_item_points_check CHECK (points > 0),
  CONSTRAINT assessment_item_position_check CHECK (position > 0),
  CONSTRAINT assessment_item_position_unique UNIQUE (assessment_id, position) DEFERRABLE INITIALLY DEFERRED -- Adia até o fim da transação, para permitir reordenar os itens
);

CREATE TABLE assignment (
  assessment_id UUID NOT NULL REFERENCES assessment (id),
  student_id UUID NOT NULL REFERENCES student (user_id),
  status VARCHAR(12) NOT NULL DEFAULT 'ASSIGNED',
  started_at TIMESTAMP,
  submitted_at TIMESTAMP,
  PRIMARY KEY (assessment_id, student_id),
  CONSTRAINT assignment_status_check CHECK (status IN ('ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'GRADED')),
  CONSTRAINT assignment_submitted_after_started_check CHECK (submitted_at >= started_at)
);

-- Respostas

CREATE TABLE answer (
  assessment_id UUID NOT NULL,
  student_id UUID NOT NULL,
  question_id UUID NOT NULL,
  chosen_letter CHAR(1),
  answer_text TEXT,
  score NUMERIC(5,2),
  PRIMARY KEY (assessment_id, student_id, question_id),
  CONSTRAINT answer_single_kind_check CHECK (NOT (chosen_letter IS NOT NULL AND answer_text IS NOT NULL)),
  CONSTRAINT answer_score_check CHECK (score >= 0),
  CONSTRAINT answer_assignment_fk FOREIGN KEY (assessment_id, student_id) REFERENCES assignment (assessment_id, student_id), -- Só se responde uma avaliação atribuída ao próprio aluno
  CONSTRAINT answer_assessment_item_fk FOREIGN KEY (assessment_id, question_id) REFERENCES assessment_item (assessment_id, question_id), -- Só se responde uma questão que pertence à avaliação
  CONSTRAINT answer_alternative_fk FOREIGN KEY (question_id, chosen_letter) REFERENCES alternative (question_id, letter) -- A alternativa escolhida pertence à questão respondida
);

-- Índices

CREATE INDEX question_teacher_idx ON question (teacher_id);
CREATE INDEX assessment_teacher_idx ON assessment (teacher_id);
CREATE INDEX assessment_class_group_idx ON assessment (class_group_id);
CREATE INDEX assessment_date_idx ON assessment (assessment_date);
CREATE INDEX assessment_item_question_idx ON assessment_item (question_id);
CREATE INDEX class_enrollment_class_idx ON class_enrollment (class_group_id);
CREATE INDEX assignment_student_idx ON assignment (student_id);
CREATE INDEX answer_question_idx ON answer (question_id);
CREATE INDEX answer_student_idx ON answer (student_id);

-- Gatilhos - referenciar regras em esquema.md

-- Regra 1
CREATE FUNCTION check_multiple_choice_alternatives() RETURNS trigger AS $$
DECLARE
  target_question_id UUID;
  alternative_count INTEGER;
  correct_count INTEGER;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_question_id := OLD.question_id;
  ELSE
    target_question_id := NEW.question_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM multiple_choice_question WHERE question_id = target_question_id) THEN
    RETURN NULL;
  END IF;

  SELECT COUNT(*), COUNT(*) FILTER (WHERE is_correct) INTO alternative_count, correct_count FROM alternative WHERE question_id = target_question_id;

  IF alternative_count < 2 THEN
    RAISE EXCEPTION 'Multiple choice question % must have at least two alternatives',
      target_question_id;
  END IF;
  IF correct_count <> 1 THEN
    RAISE EXCEPTION 'Multiple choice question % must have exactly one correct alternative',
      target_question_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER alternative_rules_trigger AFTER INSERT OR UPDATE OR DELETE ON alternative DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_multiple_choice_alternatives();
CREATE CONSTRAINT TRIGGER multiple_choice_question_rules_trigger AFTER INSERT ON multiple_choice_question DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_multiple_choice_alternatives();

-- Regra 2
CREATE FUNCTION check_user_subclass() RETURNS trigger AS $$
BEGIN
  IF NEW.role = 'STUDENT' AND NOT EXISTS (SELECT 1 FROM student WHERE user_id = NEW.id) THEN
    RAISE EXCEPTION 'User % has role STUDENT but no row in student', NEW.id;
  END IF;
  IF NEW.role = 'TEACHER' AND NOT EXISTS (SELECT 1 FROM teacher WHERE user_id = NEW.id) THEN
    RAISE EXCEPTION 'User % has role TEACHER but no row in teacher', NEW.id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER user_account_subclass_trigger AFTER INSERT ON user_account DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_user_subclass();

CREATE FUNCTION check_question_subclass() RETURNS trigger AS $$
BEGIN
  IF NEW.type = 'MULTIPLE_CHOICE' AND NOT EXISTS (SELECT 1 FROM multiple_choice_question WHERE question_id = NEW.id) THEN
    RAISE EXCEPTION 'Question % is MULTIPLE_CHOICE but has no row in multiple_choice_question', NEW.id;
  END IF;
  IF NEW.type = 'FREE_TEXT' AND NOT EXISTS (SELECT 1 FROM free_text_question WHERE question_id = NEW.id) THEN
    RAISE EXCEPTION 'Question % is FREE_TEXT but has no row in free_text_question', NEW.id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER question_subclass_trigger AFTER INSERT ON question DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION check_question_subclass();

-- Regras 3 e 4
CREATE FUNCTION prepare_answer() RETURNS trigger AS $$
DECLARE
  question_type VARCHAR(15);
  item_points NUMERIC(5,2);
  chosen_is_correct BOOLEAN;
BEGIN
  SELECT q.type, i.points INTO question_type, item_points FROM assessment_item i JOIN question q ON q.id = i.question_id WHERE i.assessment_id = NEW.assessment_id AND i.question_id = NEW.question_id;

  IF NOT FOUND THEN
    RETURN NEW;
  END IF;

  IF question_type = 'MULTIPLE_CHOICE' THEN
    IF NEW.answer_text IS NOT NULL THEN
      RAISE EXCEPTION 'Multiple choice question % does not accept answer_text', NEW.question_id;
    END IF;
    IF NEW.chosen_letter IS NULL THEN
      NEW.score := 0;
    ELSE
      SELECT a.is_correct INTO chosen_is_correct FROM alternative a WHERE a.question_id = NEW.question_id AND a.letter = NEW.chosen_letter;
      IF COALESCE(chosen_is_correct, FALSE) THEN
        NEW.score := item_points;
      ELSE
        NEW.score := 0;
      END IF;
    END IF;
  ELSE
    IF NEW.chosen_letter IS NOT NULL THEN
      RAISE EXCEPTION 'Free text question % does not accept chosen_letter', NEW.question_id;
    END IF;
    IF NEW.score IS NOT NULL AND NEW.score > item_points THEN
      RAISE EXCEPTION 'Score % exceeds the % points of question % in assessment %', NEW.score, item_points, NEW.question_id, NEW.assessment_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER answer_prepare_trigger BEFORE INSERT OR UPDATE ON answer FOR EACH ROW EXECUTE FUNCTION prepare_answer();

-- Regra 5
CREATE FUNCTION assign_assessment_to_class_group() RETURNS trigger AS $$
BEGIN
  INSERT INTO assignment (assessment_id, student_id) SELECT NEW.id, e.student_id FROM class_enrollment e WHERE e.class_group_id = NEW.class_group_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assessment_assign_trigger AFTER INSERT ON assessment FOR EACH ROW WHEN (NEW.class_group_id IS NOT NULL) EXECUTE FUNCTION assign_assessment_to_class_group();

-- Regra 6
CREATE FUNCTION forbid_class_group_change() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'The class group of assessment % cannot be changed', OLD.id;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assessment_class_group_immutable_trigger BEFORE UPDATE OF class_group_id ON assessment FOR EACH ROW WHEN (OLD.class_group_id IS DISTINCT FROM NEW.class_group_id) EXECUTE FUNCTION forbid_class_group_change();

-- A regra 7 é definida de forma natural

-- Regra 8
CREATE FUNCTION check_assignment_enrollment() RETURNS trigger AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM assessment a WHERE a.id = NEW.assessment_id AND a.class_group_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM class_enrollment e WHERE e.class_group_id = a.class_group_id AND e.student_id = NEW.student_id)) THEN
    RAISE EXCEPTION 'Student % is not enrolled in the class group of assessment %', NEW.student_id, NEW.assessment_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assignment_enrollment_trigger BEFORE INSERT OR UPDATE OF assessment_id, student_id ON assignment FOR EACH ROW EXECUTE FUNCTION check_assignment_enrollment();

-- Regra 9
CREATE FUNCTION prevent_enrollment_removal() RETURNS trigger AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM assignment asg JOIN assessment a ON a.id = asg.assessment_id WHERE a.class_group_id = OLD.class_group_id AND asg.student_id = OLD.student_id) THEN
    RAISE EXCEPTION 'Enrollment of student % in class group % has assignments and cannot be removed', OLD.student_id, OLD.class_group_id;
  END IF;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER class_enrollment_protect_trigger BEFORE DELETE OR UPDATE OF student_id, class_group_id ON class_enrollment FOR EACH ROW EXECUTE FUNCTION prevent_enrollment_removal();

-- Regra 10
CREATE FUNCTION forbid_points_change_after_answers() RETURNS trigger AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM answer WHERE assessment_id = OLD.assessment_id AND question_id = OLD.question_id) THEN
    RAISE EXCEPTION 'Points of question % in assessment % cannot change after answers exist', OLD.question_id, OLD.assessment_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assessment_item_points_immutable_trigger BEFORE UPDATE OF points ON assessment_item FOR EACH ROW WHEN (OLD.points IS DISTINCT FROM NEW.points) EXECUTE FUNCTION forbid_points_change_after_answers();

-- Regra 11
CREATE FUNCTION forbid_correct_change_after_answers() RETURNS trigger AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM answer WHERE question_id = OLD.question_id) THEN
    RAISE EXCEPTION 'The correct alternative of question % cannot change after answers exist', OLD.question_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER alternative_correct_immutable_trigger BEFORE UPDATE OF is_correct ON alternative FOR EACH ROW WHEN (OLD.is_correct IS DISTINCT FROM NEW.is_correct) EXECUTE FUNCTION forbid_correct_change_after_answers();

-- Regra 12
CREATE FUNCTION validate_assignment_status() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status <> 'ASSIGNED' OR NEW.started_at IS NOT NULL OR NEW.submitted_at IS NOT NULL THEN
      RAISE EXCEPTION 'A new assignment must start as ASSIGNED, without started_at or submitted_at';
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.status = OLD.status THEN
    IF NEW.started_at IS DISTINCT FROM OLD.started_at OR NEW.submitted_at IS DISTINCT FROM OLD.submitted_at THEN
      RAISE EXCEPTION 'started_at and submitted_at can only change together with a status transition';
    END IF;
    RETURN NEW;
  END IF;

  IF NOT (
    (OLD.status = 'ASSIGNED' AND NEW.status = 'IN_PROGRESS') OR
    (OLD.status = 'IN_PROGRESS' AND NEW.status = 'SUBMITTED') OR
    (OLD.status = 'SUBMITTED' AND NEW.status = 'GRADED')
  ) THEN
    RAISE EXCEPTION 'Invalid assignment status transition from % to %', OLD.status, NEW.status;
  END IF;

  IF NEW.status = 'IN_PROGRESS' THEN
    NEW.started_at := COALESCE(NEW.started_at, CURRENT_TIMESTAMP);
  ELSIF NEW.status = 'SUBMITTED' THEN
    NEW.submitted_at := COALESCE(NEW.submitted_at, CURRENT_TIMESTAMP);
  ELSIF NEW.status = 'GRADED' THEN
    IF EXISTS (SELECT 1 FROM answer WHERE assessment_id = NEW.assessment_id AND student_id = NEW.student_id AND score IS NULL) THEN
      RAISE EXCEPTION 'Assignment (%, %) cannot be GRADED while answers have no score', NEW.assessment_id, NEW.student_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assignment_status_trigger BEFORE INSERT OR UPDATE OF status, started_at, submitted_at ON assignment FOR EACH ROW EXECUTE FUNCTION validate_assignment_status();

-- Regra 13
CREATE FUNCTION check_answer_lifecycle() RETURNS trigger AS $$
DECLARE
  current_status VARCHAR(12);
  question_type VARCHAR(15);
  target answer%ROWTYPE;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target := OLD;
  ELSE
    target := NEW;
  END IF;

  SELECT status INTO current_status FROM assignment WHERE assessment_id = target.assessment_id AND student_id = target.student_id;

  IF NOT FOUND THEN
    IF TG_OP = 'DELETE' THEN
      RETURN OLD;
    END IF;
    RETURN NEW;
  END IF;

  SELECT type INTO question_type FROM question WHERE id = target.question_id;

  IF TG_OP = 'INSERT' THEN
    IF current_status <> 'IN_PROGRESS' THEN
      RAISE EXCEPTION 'Answers can only be created while the assignment is IN_PROGRESS (is %)', current_status;
    END IF;
    IF question_type = 'FREE_TEXT' AND NEW.score IS NOT NULL THEN
      RAISE EXCEPTION 'Free text answers can only be graded while the assignment is SUBMITTED';
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF (NEW.chosen_letter IS DISTINCT FROM OLD.chosen_letter OR NEW.answer_text IS DISTINCT FROM OLD.answer_text) AND current_status <> 'IN_PROGRESS' THEN
      RAISE EXCEPTION 'Answers can only be changed while the assignment is IN_PROGRESS (is %)',
        current_status;
    END IF;
    IF question_type = 'FREE_TEXT' AND NEW.score IS DISTINCT FROM OLD.score AND current_status <> 'SUBMITTED' THEN
      RAISE EXCEPTION 'Free text answers can only be graded while the assignment is SUBMITTED (is %)', current_status;
    END IF;
    RETURN NEW;
  END IF;

  IF current_status <> 'IN_PROGRESS' THEN
    RAISE EXCEPTION 'Answers can only be removed while the assignment is IN_PROGRESS (is %)', current_status;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER answer_lifecycle_trigger BEFORE INSERT OR UPDATE OR DELETE ON answer FOR EACH ROW EXECUTE FUNCTION check_answer_lifecycle();

-- View para nota total (atributo derivado)
CREATE VIEW assignment_total_score AS
SELECT asg.assessment_id,
  asg.student_id,
  asg.status,
  asg.started_at,
  asg.submitted_at,
  COALESCE(SUM(ans.score), 0) AS total_score,
  COUNT(ans.question_id) FILTER (WHERE ans.score IS NULL) AS pending_count
FROM assignment asg
LEFT JOIN answer ans ON ans.assessment_id = asg.assessment_id AND ans.student_id = asg.student_id GROUP BY asg.assessment_id, asg.student_id, asg.status, asg.started_at, asg.submitted_at;
