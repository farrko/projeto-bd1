# Esquema relacional

## Tabelas

```
user_account(id, name, email, password, role)
  PRIMARY KEY  id
  UNIQUE       email
  UNIQUE       (id, role)
  CHECK        role IN ('STUDENT', 'TEACHER')

student(user_id, role, enrollment_number)
  PRIMARY KEY  user_id
  UNIQUE       enrollment_number
  CHECK        role = 'STUDENT'
  FOREIGN KEY  (user_id, role) REFERENCES user_account(id, role)

teacher(user_id, role, staff_number)
  PRIMARY KEY  user_id
  UNIQUE       staff_number
  CHECK        role = 'TEACHER'
  FOREIGN KEY  (user_id, role) REFERENCES user_account(id, role)

class_group(id, name, year, semester)
  PRIMARY KEY  id
  UNIQUE       (name, year, semester)
  CHECK        semester IN (1, 2)

class_enrollment(student_id, class_group_id)
  PRIMARY KEY  (student_id, class_group_id)
  FOREIGN KEY  student_id REFERENCES student(user_id)
  FOREIGN KEY  class_group_id REFERENCES class_group(id)

question(id, statement, type, created_at, teacher_id)
  PRIMARY KEY  id
  UNIQUE       (id, type)
  CHECK        type IN ('MULTIPLE_CHOICE', 'FREE_TEXT')
  FOREIGN KEY  teacher_id REFERENCES teacher(user_id)

multiple_choice_question(question_id, type)
  PRIMARY KEY  question_id
  CHECK        type = 'MULTIPLE_CHOICE'
  FOREIGN KEY  (question_id, type) REFERENCES question(id, type)

free_text_question(question_id, type, expected_answer (nullable))
  PRIMARY KEY  question_id
  CHECK        type = 'FREE_TEXT'
  FOREIGN KEY  (question_id, type) REFERENCES question(id, type)

alternative(question_id, letter, text, is_correct)
  PRIMARY KEY  (question_id, letter)
  CHECK        letter ~ '^[A-Z]$'
  UNIQUE       (question_id) WHERE is_correct        -- índice único parcial
  FOREIGN KEY  question_id REFERENCES multiple_choice_question(question_id) ON DELETE CASCADE

assessment(id, title, description (nullable), assessment_date, start_time, end_time, teacher_id, class_group_id (nullable))
  PRIMARY KEY  id
  CHECK        end_time > start_time
  FOREIGN KEY  teacher_id REFERENCES teacher(user_id)
  FOREIGN KEY  class_group_id REFERENCES class_group(id)

assessment_item(assessment_id, question_id, points, position)
  PRIMARY KEY  (assessment_id, question_id)
  UNIQUE       (assessment_id, position)
  CHECK        points > 0
  CHECK        position > 0
  FOREIGN KEY  assessment_id REFERENCES assessment(id)
  FOREIGN KEY  question_id REFERENCES question(id)

assignment(assessment_id, student_id, status, started_at (nullable), submitted_at (nullable))
  PRIMARY KEY  (assessment_id, student_id)
  CHECK        status IN ('ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'GRADED')
  CHECK        submitted_at >= started_at
  FOREIGN KEY  assessment_id REFERENCES assessment(id)
  FOREIGN KEY  student_id REFERENCES student(user_id)

answer(assessment_id, student_id, question_id, chosen_letter (nullable), answer_text (nullable), score (nullable))
  PRIMARY KEY  (assessment_id, student_id, question_id)
  CHECK        NOT (chosen_letter IS NOT NULL AND answer_text IS NOT NULL)
  CHECK        score >= 0
  FOREIGN KEY  (assessment_id, student_id) REFERENCES assignment(assessment_id, student_id)
  FOREIGN KEY  (assessment_id, question_id) REFERENCES assessment_item(assessment_id, question_id)
  FOREIGN KEY  (question_id, chosen_letter) REFERENCES alternative(question_id, letter)
```

## Mapeamento de elementos do DER

| Elemento do DER | Tabela(s) | Regra aplicada |
|---|---|---|
| USUARIO, ALUNO, PROFESSOR (especialização disjunta e total) | `user_account`, `student`, `teacher` | Uma tabela por classe. A chave primária da subclasse é também chave estrangeira da superclasse. O discriminador `role` e o `CHECK` em cada subclasse garantem a disjunção. |
| QUESTAO, MULTIPLA_ESCOLHA, TEXTO_LIVRE (especialização disjunta e total) | `question`, `multiple_choice_question`, `free_text_question` | Mesma estratégia, com `type` como discriminador. |
| ALTERNATIVA (entidade fraca) | `alternative` | A chave primária é a chave do dono (`question_id`) mais a chave parcial (`letter`). |
| TURMA | `class_group` | Entidade forte. |
| MATRICULADO (M:N) | `class_enrollment` | Tabela de relacionamento com as duas chaves estrangeiras como chave primária. |
| CRIA, ELABORA (1:N) | `question.teacher_id`, `assessment.teacher_id` | Chave estrangeira no lado N. |
| APLICA (1:N, participação parcial de AVALIACAO) | `assessment.class_group_id` | Chave estrangeira anulável no lado N: avaliações sem turma (provas extras) ficam com `NULL`. |
| COMPOE (M:N, com `valor` e `ordem`) | `assessment_item` | Tabela de relacionamento, com `points` e `position`. |
| ATRIBUIDA_A (M:N, com `status`, `data_inicio`, `data_envio`) | `assignment` | Tabela de relacionamento com os atributos do relacionamento. |
| RESPONDE (ALUNO, agregação ITEM_AVALIACAO; atributos `letra_escolhida`, `texto_resposta`, `nota_obtida`) | `answer` | A chave primária une `student_id` com a chave de `assessment_item`. O atributo `letra_escolhida` vira `chosen_letter`, nulo nas questões de texto livre, e combinado com `question_id` forma a chave estrangeira composta para `alternative`, que garante que a letra existe naquela questão. |
| `nota_total` (derivado) | não armazenado | Calculado por `SUM(answer.score)` agrupado por `(assessment_id, student_id)`. |

## Regras garantidas pelo `schema.sql`

Estas regras não aparecem como linhas no DER, porque RESPONDE liga ALUNO diretamente à agregação e a alternativa escolhida é um atributo. O `schema.sql` as garante com chaves estrangeiras compostas de `answer`.

1. Só se responde uma avaliação atribuída ao próprio aluno: `(assessment_id, student_id)` referencia `assignment`.
2. Só se responde uma questão que pertence à avaliação: `(assessment_id, question_id)` referencia `assessment_item`.
3. A alternativa escolhida pertence à questão respondida: `(question_id, chosen_letter)` referencia `alternative`.

## Regras que o `schema.sql` não cobre

Estas regras ficam em gatilhos, na camada de serviço ou em ambos:

1. Todo `user_account` e toda `question` têm a linha correspondente na tabela da subclasse.
2. Toda questão de múltipla escolha tem no mínimo 2 alternativas e exatamente 1 correta, com o índice parcial garantindo no máximo 1.
3. Todo tipo da resposta bate com o tipo da questão: `chosen_letter` nas objetivas e `answer_text` nas de texto livre.
4. Todas as questões possuem um limite de pontuação `score <= points`. Nas objetivas, a nota é calculada pelo sistema ao enviar. Nas de texto livre, o professor a informa.
5. Quando uma avaliação é criada com `class_group_id` preenchido, um gatilho `AFTER INSERT` em `assessment` insere, na mesma transação, um `assignment` com `status = 'ASSIGNED'` para cada aluno de `class_enrollment` daquela turma. Avaliações sem turma são permitidas, e o serviço insere os `assignment` dos alunos escolhidos individualmente.
6. Um gatilho `BEFORE UPDATE` em `assessment` rejeita a alteração de `class_group_id` depois da criação, garantindo imutabilidade de turma.
7. Um aluno matriculado depois da criação da avaliação não recebe essa avaliação, ele recebe apenas as avaliações criadas após a matrícula.
8. Um aluno só pode ser atribuído a uma avaliação com turma se estiver matriculado na mesma, garantido por um gatilho `BEFORE INSERT OR UPDATE OF assessment_id, student_id` em `assignment`. Provas extras para alunos específicos são criadas como avaliações sem turma.
9. Um gatilho `BEFORE DELETE OR UPDATE OF student_id, class_group_id` em `class_enrollment` rejeita a exclusão ou a troca de chave de uma matrícula cujo aluno já tenha `assignment` em alguma avaliação daquela turma.
10. Um gatilho `BEFORE UPDATE OF points` em `assessment_item` rejeita a alteração de `points` quando já existe alguma `answer` para aquele item.

## Justificativa da 3FN

Todos os atributos são atômicos, cada atributo não-chave depende da chave inteira (as chaves compostas de `assignment` e `answer` não têm dependências parciais) e só dela (não há dependências transitivas), o que garante o cumprimento da primeira, segunda e terceira forma normal.
