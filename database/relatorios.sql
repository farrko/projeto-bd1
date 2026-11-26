-- Parâmetros base para testes
--  Utiliza elementos criados pelo carga.sql.

\set student_id '''20000000-0000-0000-0000-000000000005'''
\set assessment_id '''50000000-0000-0000-0000-000000000001'''
\set start_date '''2026-01-01'''
\set end_date '''2026-12-31'''
\set min_graded 1
\set min_answers 5
\set top_n 10
\set search ''''''

-- Relatório 1: média e distribuição das notas por avaliação
-- Os resultados usam percentual da nota máxima para comparar avaliações com pontuações totais diferentes

-- 1a: Média por avaliação (considera apenas atribuições corrigidas)
SELECT
  a.id AS assessment_id,
  a.title,
  COALESCE(cg.name, 'Sem turma') AS class_group,
  a.assessment_date,
  COUNT(*) AS graded_count,
  ROUND(AVG(s.total_score), 2) AS average_score,
  m.max_score,
  ROUND(100 * AVG(s.total_score) / m.max_score, 1) AS average_percent,
  MIN(s.total_score) AS lowest_score,
  MAX(s.total_score) AS highest_score
FROM assignment_total_score s
JOIN assessment a ON a.id = s.assessment_id
LEFT JOIN class_group cg ON cg.id = a.class_group_id
JOIN (SELECT assessment_id, SUM(points) AS max_score FROM assessment_item GROUP BY assessment_id) m ON m.assessment_id = a.id
WHERE s.status = 'GRADED' AND a.assessment_date BETWEEN :start_date AND :end_date
GROUP BY a.id, a.title, cg.name, a.assessment_date, m.max_score
HAVING COUNT(*) >= :min_graded
ORDER BY a.assessment_date;

-- 1b: Distribuição das notas de uma avaliação, em faixas do percentual da nota máxima (faixas sem alunos aparecem com zero)
SELECT
  b.label AS score_range,
  COUNT(g.student_id) AS student_count
FROM (VALUES
  (1, '0% a 24%', 0, 25),
  (2, '25% a 49%', 25, 50),
  (3, '50% a 74%', 50, 75),
  (4, '75% a 100%', 75, 101)
) AS b(band_order, label, lower_percent, upper_percent)
LEFT JOIN (
  SELECT s.student_id, 100 * s.total_score / m.max_score AS percent
  FROM assignment_total_score s
  JOIN (SELECT assessment_id, SUM(points) AS max_score FROM assessment_item GROUP BY assessment_id) m ON m.assessment_id = s.assessment_id
  WHERE s.assessment_id = :assessment_id AND s.status = 'GRADED'
) g ON g.percent >= b.lower_percent AND g.percent < b.upper_percent
GROUP BY b.band_order, b.label
ORDER BY b.band_order;

-- Relatório 2: desempenho de um aluno comparado com a média da turma

SELECT
  a.assessment_date,
  a.title,
  s.total_score AS student_score,
  c.class_average,
  ROUND(s.total_score - c.class_average, 2) AS difference
FROM assignment_total_score s
JOIN assessment a ON a.id = s.assessment_id
CROSS JOIN LATERAL (
  SELECT ROUND(AVG(o.total_score), 2) AS class_average
  FROM assignment_total_score o
  WHERE o.assessment_id = s.assessment_id AND o.status = 'GRADED'
) c
WHERE s.student_id = :student_id AND s.status = 'GRADED'
ORDER BY a.assessment_date;

-- Relatório 3: questões objetivas mais erradas, com percentual
-- :search filtra o enunciado (texto vazio = todas as questões)

SELECT
  RANK() OVER (ORDER BY COUNT(*) FILTER (WHERE ans.score < i.points)::numeric / COUNT(*) DESC) AS error_rank,
  q.id AS question_id,
  LEFT(q.statement, 90) AS statement,
  COUNT(*) AS answer_count,
  COUNT(*) FILTER (WHERE ans.score < i.points) AS wrong_count,
  ROUND(100.0 * COUNT(*) FILTER (WHERE ans.score < i.points) / COUNT(*), 1) AS error_percent
FROM answer ans
JOIN assessment_item i ON i.assessment_id = ans.assessment_id AND i.question_id = ans.question_id
JOIN question q ON q.id = ans.question_id
JOIN assessment a ON a.id = ans.assessment_id
JOIN assignment asg ON asg.assessment_id = ans.assessment_id AND asg.student_id = ans.student_id
WHERE q.type = 'MULTIPLE_CHOICE'
  AND asg.status IN ('SUBMITTED', 'GRADED')
  AND ans.score IS NOT NULL
  AND a.assessment_date BETWEEN :start_date AND :end_date
  AND LOWER(q.statement) LIKE '%' || LOWER(:search) || '%'
GROUP BY q.id, q.statement
HAVING COUNT(*) >= :min_answers
ORDER BY error_rank, q.statement
FETCH FIRST :top_n ROWS ONLY;
