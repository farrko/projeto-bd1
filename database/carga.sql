BEGIN;

-- Usuários

-- 1. Professores
INSERT INTO user_account (id, name, email, password, role) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Prof. Carlos Drummond', 'carlos.drummond@escola.edu.br', 'prof123', 'TEACHER'),
  ('10000000-0000-0000-0000-000000000002', 'Profa. Maria Montessori', 'maria.montessori@escola.edu.br', 'prof123', 'TEACHER'),
  ('10000000-0000-0000-0000-000000000003', 'Prof. Paulo Freire', 'paulo.freire@escola.edu.br', 'prof123', 'TEACHER'),
  ('10000000-0000-0000-0000-000000000004', 'Profa. Ada Lovelace', 'ada.lovelace@escola.edu.br', 'prof123', 'TEACHER'),
  ('10000000-0000-0000-0000-000000000005', 'Prof. Milton Santos', 'milton.santos@escola.edu.br', 'prof123', 'TEACHER');

INSERT INTO teacher (user_id, role, staff_number) VALUES
  ('10000000-0000-0000-0000-000000000001', 'TEACHER', 'DOC-2026-01'),
  ('10000000-0000-0000-0000-000000000002', 'TEACHER', 'DOC-2026-02'),
  ('10000000-0000-0000-0000-000000000003', 'TEACHER', 'DOC-2026-03'),
  ('10000000-0000-0000-0000-000000000004', 'TEACHER', 'DOC-2026-04'),
  ('10000000-0000-0000-0000-000000000005', 'TEACHER', 'DOC-2026-05');

-- 2. Alunos
INSERT INTO user_account (id, name, email, password, role) VALUES
  ('20000000-0000-0000-0000-000000000001', 'Ana Clara Silva', 'ana.silva@aluno.edu.br', 'aluno123', 'STUDENT'),
  ('20000000-0000-0000-0000-000000000002', 'Bruno Henrique Souza', 'bruno.souza@aluno.edu.br', 'aluno123', 'STUDENT'),
  ('20000000-0000-0000-0000-000000000003', 'Camila Oliveira Santos', 'camila.santos@aluno.edu.br', 'aluno123', 'STUDENT'),
  ('20000000-0000-0000-0000-000000000004', 'Daniel Alves Pereira', 'daniel.pereira@aluno.edu.br', 'aluno123', 'STUDENT'),
  ('20000000-0000-0000-0000-000000000005', 'Eduarda Costa Lima', 'eduarda.lima@aluno.edu.br', 'aluno123', 'STUDENT'),
  ('20000000-0000-0000-0000-000000000006', 'Felipe Rocha Mendes', 'felipe.mendes@aluno.edu.br', 'aluno123', 'STUDENT'),
  ('20000000-0000-0000-0000-000000000007', 'Gabriela Martins Ferreira', 'gabriela.ferreira@aluno.edu.br', 'aluno123', 'STUDENT'),
  ('20000000-0000-0000-0000-000000000008', 'Lucas Ribeiro Gomes', 'lucas.gomes@aluno.edu.br', 'aluno123', 'STUDENT'),
  ('20000000-0000-0000-0000-000000000009', 'Mariana Barbosa Carvalho', 'mariana.carvalho@aluno.edu.br', 'aluno123', 'STUDENT'),
  ('20000000-0000-0000-0000-000000000010', 'Nicolas Araújo Dias', 'nicolas.dias@aluno.edu.br', 'aluno123', 'STUDENT'),
  ('20000000-0000-0000-0000-000000000011', 'Olivia Teixeira Castro', 'olivia.castro@aluno.edu.br', 'aluno123', 'STUDENT'),
  ('20000000-0000-0000-0000-000000000012', 'Pedro Augusto Correia', 'pedro.correia@aluno.edu.br', 'aluno123', 'STUDENT'),
  ('20000000-0000-0000-0000-000000000013', 'Rafaela Fernandes Monteiro', 'rafaela.monteiro@aluno.edu.br', 'aluno123', 'STUDENT'),
  ('20000000-0000-0000-0000-000000000014', 'Samuel Cardoso Pinto', 'samuel.pinto@aluno.edu.br', 'aluno123', 'STUDENT'),
  ('20000000-0000-0000-0000-000000000015', 'Thiago Moreira Nogueira', 'thiago.nogueira@aluno.edu.br', 'aluno123', 'STUDENT'),
  ('20000000-0000-0000-0000-000000000016', 'Valentina Vieira Cunha', 'valentina.cunha@aluno.edu.br', 'aluno123', 'STUDENT'),
  ('20000000-0000-0000-0000-000000000017', 'Gabriel Azevedo Freitas', 'gabriel.freitas@aluno.edu.br', 'aluno123', 'STUDENT'),
  ('20000000-0000-0000-0000-000000000018', 'Helena Duarte Machado', 'helena.machado@aluno.edu.br', 'aluno123', 'STUDENT'),
  ('20000000-0000-0000-0000-000000000019', 'Igor Batista Lopes', 'igor.lopes@aluno.edu.br', 'aluno123', 'STUDENT'),
  ('20000000-0000-0000-0000-000000000020', 'Julia Rezende Campos', 'julia.campos@aluno.edu.br', 'aluno123', 'STUDENT');

INSERT INTO student (user_id, role, enrollment_number) VALUES
  ('20000000-0000-0000-0000-000000000001', 'STUDENT', '20261001'),
  ('20000000-0000-0000-0000-000000000002', 'STUDENT', '20261002'),
  ('20000000-0000-0000-0000-000000000003', 'STUDENT', '20261003'),
  ('20000000-0000-0000-0000-000000000004', 'STUDENT', '20261004'),
  ('20000000-0000-0000-0000-000000000005', 'STUDENT', '20261005'),
  ('20000000-0000-0000-0000-000000000006', 'STUDENT', '20261006'),
  ('20000000-0000-0000-0000-000000000007', 'STUDENT', '20261007'),
  ('20000000-0000-0000-0000-000000000008', 'STUDENT', '20261008'),
  ('20000000-0000-0000-0000-000000000009', 'STUDENT', '20261009'),
  ('20000000-0000-0000-0000-000000000010', 'STUDENT', '20261010'),
  ('20000000-0000-0000-0000-000000000011', 'STUDENT', '20261011'),
  ('20000000-0000-0000-0000-000000000012', 'STUDENT', '20261012'),
  ('20000000-0000-0000-0000-000000000013', 'STUDENT', '20261013'),
  ('20000000-0000-0000-0000-000000000014', 'STUDENT', '20261014'),
  ('20000000-0000-0000-0000-000000000015', 'STUDENT', '20261015'),
  ('20000000-0000-0000-0000-000000000016', 'STUDENT', '20261016'),
  ('20000000-0000-0000-0000-000000000017', 'STUDENT', '20261017'),
  ('20000000-0000-0000-0000-000000000018', 'STUDENT', '20261018'),
  ('20000000-0000-0000-0000-000000000019', 'STUDENT', '20261019'),
  ('20000000-0000-0000-0000-000000000020', 'STUDENT', '20261020');


-- Turmas

INSERT INTO class_group (id, name, year, semester) VALUES
  ('30000000-0000-0000-0000-000000000001', 'Turma A', 2026, 2),
  ('30000000-0000-0000-0000-000000000002', 'Turma B', 2026, 2);

-- Alunos 1 a 10 na turma A, alunos 11 a 20 na turma B
INSERT INTO class_enrollment (student_id, class_group_id) VALUES
  ('20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000009', '30000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000010', '30000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000002'),
  ('20000000-0000-0000-0000-000000000012', '30000000-0000-0000-0000-000000000002'),
  ('20000000-0000-0000-0000-000000000013', '30000000-0000-0000-0000-000000000002'),
  ('20000000-0000-0000-0000-000000000014', '30000000-0000-0000-0000-000000000002'),
  ('20000000-0000-0000-0000-000000000015', '30000000-0000-0000-0000-000000000002'),
  ('20000000-0000-0000-0000-000000000016', '30000000-0000-0000-0000-000000000002'),
  ('20000000-0000-0000-0000-000000000017', '30000000-0000-0000-0000-000000000002'),
  ('20000000-0000-0000-0000-000000000018', '30000000-0000-0000-0000-000000000002'),
  ('20000000-0000-0000-0000-000000000019', '30000000-0000-0000-0000-000000000002'),
  ('20000000-0000-0000-0000-000000000020', '30000000-0000-0000-0000-000000000002');


-- Questões
--  Temas:
--   Q01 a Q06: Segunda Guerra Mundial (História)
--   Q07 a Q12: Álgebra com Funções Trigonométricas (Matemática)
--   Q13 a Q18: Filósofos do Contrato Social (Filosofia)
--   Q19 a Q24: Blocos Econômicos (Geografia)
--   Q25 a Q30: Brasil: Estado Novo (História)
--   Q31 a Q32: Questões extras (não usadas em provas)

-- Inserção em `question`
INSERT INTO question (id, statement, type, created_at, teacher_id) VALUES
  -- Tema 1: Segunda Guerra Mundial (História) - Prof. Carlos Drummond
  ('40000000-0000-0000-0000-000000000001',
   '(ENEM 2016) Durante a Segunda Guerra Mundial, o governo norte-americano criou o Escritório de Informação de Guerra, que produziu cartazes como o da personagem "Rosie, a Rebitadeira" (We Can Do It!). Qual foi o principal objetivo sociocultural dessa campanha nos Estados Unidos?',
   'MULTIPLE_CHOICE', '2026-08-01 09:00:00', '10000000-0000-0000-0000-000000000001'),

  ('40000000-0000-0000-0000-000000000002',
   '(VUNESP 2019) O Pacto Germano-Soviético (Ribbentrop-Molotov), assinado em agosto de 1939 entre a Alemanha nazista e a União Soviética, surpreendeu as potências ocidentais porque:',
   'MULTIPLE_CHOICE', '2026-08-01 09:10:00', '10000000-0000-0000-0000-000000000001'),

  ('40000000-0000-0000-0000-000000000003',
   '(FUVEST 2018) A Batalha de Stalingrado (1942-1943) é amplamente considerada pelos historiadores como o grande ponto de inflexão da Segunda Guerra Mundial na Europa devido:',
   'MULTIPLE_CHOICE', '2026-08-01 09:20:00', '10000000-0000-0000-0000-000000000001'),

  ('40000000-0000-0000-0000-000000000004',
   '(ENEM 2020) A Conferência de Potsdam, realizada entre julho e agosto de 1945 pelos líderes dos países Aliados, definiu diretrizes fundamentais para o pós-guerra na Europa, entre as quais se destaca:',
   'MULTIPLE_CHOICE', '2026-08-01 09:30:00', '10000000-0000-0000-0000-000000000001'),

  ('40000000-0000-0000-0000-000000000005',
   '(UNICAMP 2021) Sobre a participação da Força Expedicionária Brasileira (FEB) na Segunda Guerra Mundial, é correto afirmar que:',
   'MULTIPLE_CHOICE', '2026-08-01 09:40:00', '10000000-0000-0000-0000-000000000001'),

  ('40000000-0000-0000-0000-000000000006',
   '(VUNESP 2022 - Discursiva) Explique dois fatores que levaram os Estados Unidos a abandonarem sua política de neutralidade e entrarem oficialmente na Segunda Guerra Mundial em dezembro de 1941, mencionando o impacto geopolítico dessa entrada no teatro do Pacífico e da Europa.',
   'FREE_TEXT', '2026-08-01 09:50:00', '10000000-0000-0000-0000-000000000001'),

  -- Tema 2: Álgebra com Funções Trigonométricas (Matemática) - Profa. Ada Lovelace
  ('40000000-0000-0000-0000-000000000007',
   '(ENEM 2018) Em um parque de diversões, a altura h(t), em metros, de uma cabine de roda-gigante em relação ao solo, após t minutos de funcionamento, é modelada por h(t) = 12 + 10 * sen((pi/6) * t). Qual é o período de uma volta completa dessa roda-gigante e a altura máxima atingida pela cabine?',
   'MULTIPLE_CHOICE', '2026-08-02 10:00:00', '10000000-0000-0000-0000-000000000004'),

  ('40000000-0000-0000-0000-000000000008',
   '(VUNESP 2020) Sabendo que sen(x) + cos(x) = 1/2, o valor algébrico de sen(2x) é igual a:',
   'MULTIPLE_CHOICE', '2026-08-02 10:15:00', '10000000-0000-0000-0000-000000000004'),

  ('40000000-0000-0000-0000-000000000009',
   '(FUVEST 2019) O número de soluções reais da equação trigonométrica 2*cos²(x) - 3*cos(x) + 1 = 0 no intervalo fechado [0, 2*pi] é:',
   'MULTIPLE_CHOICE', '2026-08-02 10:30:00', '10000000-0000-0000-0000-000000000004'),

  ('40000000-0000-0000-0000-000000000010',
   '(ENEM 2021) A temperatura média diária T(t), em graus Celsius, de uma cidade ao longo dos meses do ano pode ser aproximada por T(t) = 22 - 6 * cos((pi/6) * (t - 1)), com t = 1 representando janeiro. Em qual mês ocorre a temperatura média máxima?',
   'MULTIPLE_CHOICE', '2026-08-02 10:45:00', '10000000-0000-0000-0000-000000000004'),

  ('40000000-0000-0000-0000-000000000011',
   '(UNICAMP 2020) Seja x um arco do primeiro quadrante tal que tg(x) = 3/4. O valor de sen(x) + cos(x) é:',
   'MULTIPLE_CHOICE', '2026-08-02 11:00:00', '10000000-0000-0000-0000-000000000004'),

  ('40000000-0000-0000-0000-000000000012',
   '(VUNESP 2021 - Discursiva) Resolva algebricamente a equação 2*sen²(x) - sen(x) - 1 = 0 para x pertencente ao intervalo [0, 2*pi], apresentando o conjunto solução completo em radianos.',
   'FREE_TEXT', '2026-08-02 11:15:00', '10000000-0000-0000-0000-000000000004'),

  -- Tema 3: Filósofos do Contrato Social (Filosofia) - Prof. Paulo Freire
  ('40000000-0000-0000-0000-000000000013',
   '(ENEM 2017) Em sua obra "Leviatã" (1651), Thomas Hobbes descreve o estado de natureza como uma condição em que "o homem é o lobo do homem". Para superar a guerra de todos contra todos, os indivíduos celebram um pacto social cujo objetivo central é:',
   'MULTIPLE_CHOICE', '2026-08-03 14:00:00', '10000000-0000-0000-0000-000000000003'),

  ('40000000-0000-0000-0000-000000000014',
   '(VUNESP 2018) Diferentemente de Thomas Hobbes, o filósofo inglês John Locke, no "Segundo Tratado sobre o Governo Civil", sustenta que no estado de natureza os seres humanos já possuem direitos naturais inalienáveis, sendo eles:',
   'MULTIPLE_CHOICE', '2026-08-03 14:15:00', '10000000-0000-0000-0000-000000000003'),

  ('40000000-0000-0000-0000-000000000015',
   '(ENEM 2019) Para Jean-Jacques Rousseau, em "Do Contrato Social" (1762), a soberania reside no povo e se expressa por meio da "vontade geral". Segundo o filósofo genebrino, a vontade geral distingue-se da "vontade de todos" porque:',
   'MULTIPLE_CHOICE', '2026-08-03 14:30:00', '10000000-0000-0000-0000-000000000003'),

  ('40000000-0000-0000-0000-000000000016',
   '(UEL 2020) Sobre a origem da desigualdade entre os homens na filosofia política de Jean-Jacques Rousseau, o surgimento da propriedade privada é apontado pelo autor como:',
   'MULTIPLE_CHOICE', '2026-08-03 14:45:00', '10000000-0000-0000-0000-000000000003'),

  ('40000000-0000-0000-0000-000000000017',
   '(FUVEST 2021) Na teoria contratualista de John Locke, caso o poder legislativo ou o governante viole o pacto de proteção aos direitos naturais dos cidadãos, a sociedade civil tem legitimidade para exercer o:',
   'MULTIPLE_CHOICE', '2026-08-03 15:00:00', '10000000-0000-0000-0000-000000000003'),

  ('40000000-0000-0000-0000-000000000018',
   '(UNESP/VUNESP 2023 - Discursiva) Compare as concepções de "estado de natureza" e de "forma de governo resultante do pacto social" nas filosofias políticas de Thomas Hobbes e Jean-Jacques Rousseau.',
   'FREE_TEXT', '2026-08-03 15:15:00', '10000000-0000-0000-0000-000000000003'),

  -- Tema 4: Blocos Econômicos (Geografia) - Prof. Milton Santos
  ('40000000-0000-0000-0000-000000000019',
   '(ENEM 2019) Os blocos econômicos regionais apresentam diferentes graus de integração comercial e institucional. A etapa em que os países-membros eliminam tarifas alfandegárias entre si e adotam uma Tarifa Externa Comum (TEC) para produtos vindos de fora do bloco denomina-se:',
   'MULTIPLE_CHOICE', '2026-08-04 08:00:00', '10000000-0000-0000-0000-000000000005'),

  ('40000000-0000-0000-0000-000000000020',
   '(VUNESP 2021) O USMCA (Acordo Estados Unidos-México-Canadá), que entrou em vigor em 2020 substituindo o antigo NAFTA, caracteriza-se como um bloco econômico classificado como:',
   'MULTIPLE_CHOICE', '2026-08-04 08:15:00', '10000000-0000-0000-0000-000000000005'),

  ('40000000-0000-0000-0000-000000000021',
   '(ENEM 2020) O Brexit, processo de saída do Reino Unido da União Europeia concluído em 2020, evidenciou tensões geopolíticas e econômicas relacionadas principalmente:',
   'MULTIPLE_CHOICE', '2026-08-04 08:30:00', '10000000-0000-0000-0000-000000000005'),

  ('40000000-0000-0000-0000-000000000022',
   '(FUVEST 2022) Criado pelo Tratado de Assunção em 1991, o Mercosul tem como membros fundadores:',
   'MULTIPLE_CHOICE', '2026-08-04 08:45:00', '10000000-0000-0000-0000-000000000005'),

  ('40000000-0000-0000-0000-000000000023',
   '(UNICAMP 2019) A União Europeia representa o estágio mais avançado de integração econômica mundial, pois além do mercado comum (livre circulação de bens, serviços, capitais e pessoas), instituiu:',
   'MULTIPLE_CHOICE', '2026-08-04 09:00:00', '10000000-0000-0000-0000-000000000005'),

  ('40000000-0000-0000-0000-000000000024',
   '(VUNESP 2022 - Discursiva) Diferencie conceitualmente uma "Zona de Livre Comércio" de um "Mercado Comum", citando um exemplo real de bloco econômico para cada uma dessas modalidades.',
   'FREE_TEXT', '2026-08-04 09:15:00', '10000000-0000-0000-0000-000000000005'),

  -- Tema 5: Brasil: Estado Novo (História) - Profa. Maria Montessori
  ('40000000-0000-0000-0000-000000000025',
   '(ENEM 2018) Em novembro de 1937, Getúlio Vargas fechou o Congresso Nacional e outorgou uma nova Constituição, inaugurando o Estado Novo. O pretexto imediato utilizado pelo governo para justificar o golpe autoritário foi a divulgação do:',
   'MULTIPLE_CHOICE', '2026-08-05 10:00:00', '10000000-0000-0000-0000-000000000002'),

  ('40000000-0000-0000-0000-000000000026',
   '(VUNESP 2019) Durante o Estado Novo (1937-1945), o Departamento de Imprensa e Propaganda (DIP) desempenhou papel estratégico na sustentação do regime varguista ao:',
   'MULTIPLE_CHOICE', '2026-08-05 10:15:00', '10000000-0000-0000-0000-000000000002'),

  ('40000000-0000-0000-0000-000000000027',
   '(ENEM 2021) A Consolidação das Leis do Trabalho (CLT), promulgada em 1943 durante o Estado Novo, inseriu-se na estratégia política do trabalhismo varguista porque:',
   'MULTIPLE_CHOICE', '2026-08-05 10:30:00', '10000000-0000-0000-0000-000000000002'),

  ('40000000-0000-0000-0000-000000000028',
   '(FUVEST 2020) No plano econômico, o Estado Novo (1937-1945) caracterizou-se pelo forte intervencionismo estatal e pelo nacionalismo desenvolvimentista, exemplificados pela criação de empresas estatais estratégicas como a:',
   'MULTIPLE_CHOICE', '2026-08-05 10:45:00', '10000000-0000-0000-0000-000000000002'),

  ('40000000-0000-0000-0000-000000000029',
   '(UEL 2021) A Constituição de 1937, apelidada de "Polaca" devido à inspiração na Constituição autoritária da Polônia, estabelecia entre suas medidas:',
   'MULTIPLE_CHOICE', '2026-08-05 11:00:00', '10000000-0000-0000-0000-000000000002'),

  ('40000000-0000-0000-0000-000000000030',
   '(VUNESP 2020 - Discursiva) Explique a contradição política vivida pelo regime do Estado Novo no Brasil a partir de 1942-1944, quando o governo de Getúlio Vargas enviou tropas para combater o nazi-fascismo na Europa enquanto mantinha uma ditadura no plano interno.',
   'FREE_TEXT', '2026-08-05 11:15:00', '10000000-0000-0000-0000-000000000002'),

  -- Questões extras
  ('40000000-0000-0000-0000-000000000031',
   '(ENEM 2022) A Conferência de Bretton Woods (1944), realizada ainda no contexto final da Segunda Guerra Mundial, criou instituições financeiras internacionais com o objetivo de estabilizar a economia global, entre elas:',
   'MULTIPLE_CHOICE', '2026-08-06 16:00:00', '10000000-0000-0000-0000-000000000001'),

  ('40000000-0000-0000-0000-000000000032',
   '(ENEM 2023) A criação da Zona Franca de Manaus, reformulada em 1967, teve como objetivo geopolítico e econômico integrar a Amazônia ocidental por meio de incentivos fiscais industriais e comerciais.',
   'FREE_TEXT', '2026-08-06 16:15:00', '10000000-0000-0000-0000-000000000005');


-- Subclasses de questões: `multiple_choice_question` e `free_text_question`

INSERT INTO multiple_choice_question (question_id, type) VALUES
  ('40000000-0000-0000-0000-000000000001', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000002', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000003', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000004', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000005', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000007', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000008', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000009', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000010', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000011', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000013', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000014', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000015', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000016', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000017', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000019', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000020', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000021', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000022', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000023', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000025', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000026', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000027', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000028', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000029', 'MULTIPLE_CHOICE'),
  ('40000000-0000-0000-0000-000000000031', 'MULTIPLE_CHOICE');

INSERT INTO free_text_question (question_id, type, expected_answer) VALUES
  ('40000000-0000-0000-0000-000000000006', 'FREE_TEXT',
   'Fatores: (1) O ataque japonês à base naval de Pearl Harbor no Havaí em 7 de dezembro de 1941; (2) A guerra submarina irrestrita alemã no Atlântico contra navios mercantes aliados e o rompimento das relações diplomáticas com o Eixo. Impacto: Os EUA mobilizaram sua gigantesca capacidade industrial e militar, equilibrando e revertendo o avanço japonês no Pacífico (Midway) e fortalecendo a frente ocidental europeia (Desembarque na Normandia).'),

  ('40000000-0000-0000-0000-000000000012', 'FREE_TEXT',
   'Fazendo y = sen(x), temos 2y² - y - 1 = 0. As raízes são y = 1 ou y = -1/2. Para sen(x) = 1 em [0, 2*pi], x = pi/2. Para sen(x) = -1/2 em [0, 2*pi], x = 7*pi/6 ou x = 11*pi/6. Conjunto solução: S = {pi/2, 7*pi/6, 11*pi/6}.'),

  ('40000000-0000-0000-0000-000000000018', 'FREE_TEXT',
   'Para Hobbes, o estado de natureza é marcado pela insegurança permanente e pela guerra de todos contra todos ("o homem é o lobo do homem"), exigindo um pacto de submissão a um soberano absoluto (Leviatã) para garantir a paz. Para Rousseau, o homem natural é originalmente bom e livre ("bom selvagem"), sendo corrompido pela propriedade privada e pela sociedade; o pacto social legítimo funda uma república democrática guiada pela vontade geral soberana do povo.'),

  ('40000000-0000-0000-0000-000000000024', 'FREE_TEXT',
   'Na Zona de Livre Comércio (ex.: USMCA), os países reduzem ou eliminam tarifas alfandegárias apenas para o comércio de mercadorias entre os membros, mantendo autonomia tarifária frente a terceiros. No Mercado Comum (ex.: União Europeia), além da livre circulação de mercadorias e da Tarifa Externa Comum, há livre circulação de serviços, capitais e trabalhadores.'),

  ('40000000-0000-0000-0000-000000000030', 'FREE_TEXT',
   'A contradição residia no fato de o Brasil lutar ao lado das democracias aliadas contra os regimes totalitários nazi-fascistas na Europa (por meio da FEB), enquanto internamente o governo Vargas mantinha um regime autoritário sem eleições, com censura (DIP) e repressão política. Essa incoerência fortaleceu a oposição democrática interna e precipitou a redemocratização e a queda de Vargas em outubro de 1945.'),

  ('40000000-0000-0000-0000-000000000032', 'FREE_TEXT',
   'Comente como a criação de polos industriais e incentivos fiscais na Zona Franca de Manaus buscou promover a ocupação demográfica, a soberania nacional e o desenvolvimento econômico da região Norte durante o regime militar.');

-- Alternativas das questões de múltipla escolha (cinco alternativas por questão, uma correta)
INSERT INTO alternative (question_id, letter, text, is_correct) VALUES
  -- Q01
  ('40000000-0000-0000-0000-000000000001', 'A', 'Incentivar o alistamento feminino obrigatório nas trincheiras da frente europeia.', FALSE),
  ('40000000-0000-0000-0000-000000000001', 'B', 'Mobilizar a mão de obra feminina para ocupar postos nas indústrias bélicas em substituição aos homens enviados ao front.', TRUE),
  ('40000000-0000-0000-0000-000000000001', 'C', 'Promover o retorno imediato das mulheres às tarefas domésticas tradicionais após a crise de 1929.', FALSE),
  ('40000000-0000-0000-0000-000000000001', 'D', 'Combater a sindicalização operária nas fábricas automobilísticas de Detroit.', FALSE),
  ('40000000-0000-0000-0000-000000000001', 'E', 'Financiar a reconstrução europeia por meio da venda de títulos agrícolas.', FALSE),

  -- Q02
  ('40000000-0000-0000-0000-000000000002', 'A', 'Estabeleceu uma aliança militar permanente entre Hitler e Stalin contra os Estados Unidos.', FALSE),
  ('40000000-0000-0000-0000-000000000002', 'B', 'Garantiu a devolução imediata da Alsácia-Lorena à França em troca de petróleo soviético.', FALSE),
  ('40000000-0000-0000-0000-000000000002', 'C', 'Uniu regimes ideologicamente antagônicos em um acordo de não agressão que incluía cláusulas secretas de partilha da Polônia.', TRUE),
  ('40000000-0000-0000-0000-000000000002', 'D', 'Determinou a dissolução da Internacional Comunista e o fim do Partido Nazista.', FALSE),
  ('40000000-0000-0000-0000-000000000002', 'E', 'Permitiu que a Grã-Bretanha ocupasse os estreitos do Mar Báltico sem oposição alemã.', FALSE),

  -- Q03
  ('40000000-0000-0000-0000-000000000003', 'A', 'À rendição incondicional imediata do Japão após o cerco soviético.', FALSE),
  ('40000000-0000-0000-0000-000000000003', 'B', 'Ao sucesso da Operação Barbarossa, que garantiu o controle alemão sobre os poços de petróleo do Cáucaso.', FALSE),
  ('40000000-0000-0000-0000-000000000003', 'C', 'À assinatura do Tratado de Versalhes logo após a derrota do 6º Exército Alemão.', FALSE),
  ('40000000-0000-0000-0000-000000000003', 'D', 'À destruição de grande parte do poderio ofensivo alemão na frente oriental, iniciando o recuo nazista rumo a Berlim.', TRUE),
  ('40000000-0000-0000-0000-000000000003', 'E', 'À entrada da Itália fascista na guerra ao lado da União Soviética.', FALSE),

  -- Q04
  ('40000000-0000-0000-0000-000000000004', 'A', 'A desmilitarização, desnazificação e divisão da Alemanha e de Berlim em quatro zonas de ocupação.', TRUE),
  ('40000000-0000-0000-0000-000000000004', 'B', 'A criação imediata da União Europeia e da moeda única continental.', FALSE),
  ('40000000-0000-0000-0000-000000000004', 'C', 'A anexação integral da França pelo Reino Unido para conter o avanço soviético.', FALSE),
  ('40000000-0000-0000-0000-000000000004', 'D', 'A manutenção das colônias asiáticas sob domínio japonês por mais vinte anos.', FALSE),
  ('40000000-0000-0000-0000-000000000004', 'E', 'A extinção da Organização das Nações Unidas recém-criada em São Francisco.', FALSE),

  -- Q05
  ('40000000-0000-0000-0000-000000000005', 'A', 'Os pracinhas brasileiros combateram exclusivamente no norte da África sob comando francês.', FALSE),
  ('40000000-0000-0000-0000-000000000005', 'B', 'A FEB atuou na campanha da Itália integrada ao V Exército dos EUA, destacando-se na tomada de Monte Castello.', TRUE),
  ('40000000-0000-0000-0000-000000000005', 'C', 'O Brasil enviou tropas após ser invadido por forças terrestres alemãs no Nordeste.', FALSE),
  ('40000000-0000-0000-0000-000000000005', 'D', 'A participação brasileira ocorreu sob o comando direto do Exército Vermelho soviético.', FALSE),
  ('40000000-0000-0000-0000-000000000005', 'E', 'O envio da FEB consolidou permanentemente a ditadura do Estado Novo até 1964.', FALSE),

  -- Q07
  ('40000000-0000-0000-0000-000000000007', 'A', 'Período de 6 minutos e altura máxima de 20 metros.', FALSE),
  ('40000000-0000-0000-0000-000000000007', 'B', 'Período de 12 minutos e altura máxima de 12 metros.', FALSE),
  ('40000000-0000-0000-0000-000000000007', 'C', 'Período de 12 minutos e altura máxima de 22 metros.', TRUE),
  ('40000000-0000-0000-0000-000000000007', 'D', 'Período de 24 minutos e altura máxima de 22 metros.', FALSE),
  ('40000000-0000-0000-0000-000000000007', 'E', 'Período de 6 minutos e altura máxima de 22 metros.', FALSE),

  -- Q08
  ('40000000-0000-0000-0000-000000000008', 'A', '-3/4', TRUE),
  ('40000000-0000-0000-0000-000000000008', 'B', '-1/4', FALSE),
  ('40000000-0000-0000-0000-000000000008', 'C', '1/4', FALSE),
  ('40000000-0000-0000-0000-000000000008', 'D', '3/4', FALSE),
  ('40000000-0000-0000-0000-000000000008', 'E', '-1/2', FALSE),

  -- Q09
  ('40000000-0000-0000-0000-000000000009', 'A', '1', FALSE),
  ('40000000-0000-0000-0000-000000000009', 'B', '2', FALSE),
  ('40000000-0000-0000-0000-000000000009', 'C', '3', FALSE),
  ('40000000-0000-0000-0000-000000000009', 'D', '4', TRUE),
  ('40000000-0000-0000-0000-000000000009', 'E', '5', FALSE),

  -- Q10
  ('40000000-0000-0000-0000-000000000010', 'A', 'Janeiro (t = 1)', FALSE),
  ('40000000-0000-0000-0000-000000000010', 'B', 'Abril (t = 4)', FALSE),
  ('40000000-0000-0000-0000-000000000010', 'C', 'Julho (t = 7)', TRUE),
  ('40000000-0000-0000-0000-000000000010', 'D', 'Outubro (t = 10)', FALSE),
  ('40000000-0000-0000-0000-000000000010', 'E', 'Dezembro (t = 12)', FALSE),

  -- Q11
  ('40000000-0000-0000-0000-000000000011', 'A', '5/7', FALSE),
  ('40000000-0000-0000-0000-000000000011', 'B', '7/5', TRUE),
  ('40000000-0000-0000-0000-000000000011', 'C', '1/5', FALSE),
  ('40000000-0000-0000-0000-000000000011', 'D', '4/3', FALSE),
  ('40000000-0000-0000-0000-000000000011', 'E', '12/25', FALSE),

  -- Q13
  ('40000000-0000-0000-0000-000000000013', 'A', 'Garantir a alternância periódica de partidos políticos no parlamento.', FALSE),
  ('40000000-0000-0000-0000-000000000013', 'B', 'Abolir toda forma de autoridade estatal em favor da anarquia pacífica.', FALSE),
  ('40000000-0000-0000-0000-000000000013', 'C', 'Transferir o poder a um soberano absoluto capaz de assegurar a paz e a autopreservação dos súditos.', TRUE),
  ('40000000-0000-0000-0000-000000000013', 'D', 'Instituir a democracia direta baseada na vontade geral.', FALSE),
  ('40000000-0000-0000-0000-000000000013', 'E', 'Eliminar a propriedade privada como fonte de todos os males sociais.', FALSE),

  -- Q14
  ('40000000-0000-0000-0000-000000000014', 'A', 'Vida, liberdade e propriedade.', TRUE),
  ('40000000-0000-0000-0000-000000000014', 'B', 'Submissão irrestrita, censura e servidão.', FALSE),
  ('40000000-0000-0000-0000-000000000014', 'C', 'Coletivização agrária, sufrágio censitário e absolutismo.', FALSE),
  ('40000000-0000-0000-0000-000000000014', 'D', 'Direito divino dos reis, monopólio comercial e teocracia.', FALSE),
  ('40000000-0000-0000-0000-000000000014', 'E', 'Igualdade material absoluta e extinção do Estado.', FALSE),

  -- Q15
  ('40000000-0000-0000-0000-000000000015', 'A', 'Representa exclusivamente os interesses econômicos da aristocracia fundiária.', FALSE),
  ('40000000-0000-0000-0000-000000000015', 'B', 'Corresponde à simples soma matemática dos interesses egoístas particulares.', FALSE),
  ('40000000-0000-0000-0000-000000000015', 'C', 'Visa sempre ao bem comum e ao interesse público coletivo, sendo inalienável e indivisível.', TRUE),
  ('40000000-0000-0000-0000-000000000015', 'D', 'É delegada definitivamente a um monarca hereditário sem possibilidade de revogação.', FALSE),
  ('40000000-0000-0000-0000-000000000015', 'E', 'Depende da aprovação prévia das autoridades eclesiásticas.', FALSE),

  -- Q16
  ('40000000-0000-0000-0000-000000000016', 'A', 'O fundamento natural da justiça divina entre os homens.', FALSE),
  ('40000000-0000-0000-0000-000000000016', 'B', 'A origem histórica da sociedade civil e das desigualdades morais e políticas.', TRUE),
  ('40000000-0000-0000-0000-000000000016', 'C', 'A solução definitiva para acabar com a guerra de todos contra todos.', FALSE),
  ('40000000-0000-0000-0000-000000000016', 'D', 'Um direito anterior à própria existência humana no estado de natureza.', FALSE),
  ('40000000-0000-0000-0000-000000000016', 'E', 'Um instrumento que garante a liberdade natural do bom selvagem.', FALSE),

  -- Q17
  ('40000000-0000-0000-0000-000000000017', 'A', 'Direito de resistência e rebelião para destituir o governo tirânico.', TRUE),
  ('40000000-0000-0000-0000-000000000017', 'B', 'Dever de obediência passiva defendido por Thomas Hobbes.', FALSE),
  ('40000000-0000-0000-0000-000000000017', 'C', 'Restabelecimento imediato do absolutismo monárquico.', FALSE),
  ('40000000-0000-0000-0000-000000000017', 'D', 'Confisco estatal de todas as propriedades privadas dos cidadãos.', FALSE),
  ('40000000-0000-0000-0000-000000000017', 'E', 'Exílio voluntário sem questionar a legitimidade do governante.', FALSE),

  -- Q19
  ('40000000-0000-0000-0000-000000000019', 'A', 'Zona de Preferência Tarifária.', FALSE),
  ('40000000-0000-0000-0000-000000000019', 'B', 'Zona de Livre Comércio.', FALSE),
  ('40000000-0000-0000-0000-000000000019', 'C', 'União Aduaneira.', TRUE),
  ('40000000-0000-0000-0000-000000000019', 'D', 'União Econômica e Monetária.', FALSE),
  ('40000000-0000-0000-0000-000000000019', 'E', 'Mercado Comum.', FALSE),

  -- Q20
  ('40000000-0000-0000-0000-000000000020', 'A', 'União Monetária com adoção do dólar como moeda única oficial nos três países.', FALSE),
  ('40000000-0000-0000-0000-000000000020', 'B', 'Mercado Comum com livre circulação irrestrita de trabalhadores entre México e EUA.', FALSE),
  ('40000000-0000-0000-0000-000000000020', 'C', 'Zona de Livre Comércio voltada à redução de barreiras comerciais de bens e serviços.', TRUE),
  ('40000000-0000-0000-0000-000000000020', 'D', 'União Política supranacional com parlamento eleito diretamente pelos cidadãos.', FALSE),
  ('40000000-0000-0000-0000-000000000020', 'E', 'União Aduaneira com Tarifa Externa Comum aplicável a toda a América Latina.', FALSE),

  -- Q21
  ('40000000-0000-0000-0000-000000000021', 'A', 'À recusa britânica em adotar o idioma francês como língua oficial do Parlamento.', FALSE),
  ('40000000-0000-0000-0000-000000000021', 'B', 'Ao desejo de retomar autonomia regulatória e controle sobre fluxos migratórios e fronteiras.', TRUE),
  ('40000000-0000-0000-0000-000000000021', 'C', 'À expulsão do Reino Unido da OTAN por divergências militares com a Alemanha.', FALSE),
  ('40000000-0000-0000-0000-000000000021', 'D', 'Ao ingresso imediato da Inglaterra no Mercosul e na Zona do Euro.', FALSE),
  ('40000000-0000-0000-0000-000000000021', 'E', 'À oposição britânica ao livre comércio global com países da Commonwealth.', FALSE),

  -- Q22
  ('40000000-0000-0000-0000-000000000022', 'A', 'Brasil, Argentina, Uruguai e Paraguai.', TRUE),
  ('40000000-0000-0000-0000-000000000022', 'B', 'Brasil, Chile, Peru e Colômbia.', FALSE),
  ('40000000-0000-0000-0000-000000000022', 'C', 'Brasil, Argentina, Venezuela e Bolívia.', FALSE),
  ('40000000-0000-0000-0000-000000000022', 'D', 'Argentina, Chile, Uruguai e Equador.', FALSE),
  ('40000000-0000-0000-0000-000000000022', 'E', 'Brasil, México, Argentina e Paraguai.', FALSE),

  -- Q23
  ('40000000-0000-0000-0000-000000000023', 'A', 'O protecionismo alfandegário interno entre Alemanha e França.', FALSE),
  ('40000000-0000-0000-0000-000000000023', 'B', 'A extinção de qualquer órgão legislativo ou judicial comunitário.', FALSE),
  ('40000000-0000-0000-0000-000000000023', 'C', 'Uma União Econômica e Monetária com moeda única (Euro) e Banco Central Europeu.', TRUE),
  ('40000000-0000-0000-0000-000000000023', 'D', 'A obrigatoriedade de todos os membros abandonarem suas línguas nacionais.', FALSE),
  ('40000000-0000-0000-0000-000000000023', 'E', 'A proibição de investimentos estrangeiros fora do continente europeu.', FALSE),

  -- Q25
  ('40000000-0000-0000-0000-000000000025', 'A', 'Manifesto dos Pioneiros da Educação Nova.', FALSE),
  ('40000000-0000-0000-0000-000000000025', 'B', 'Plano Cohen, um falso documento forjado sobre uma suposta conspiração comunista no Brasil.', TRUE),
  ('40000000-0000-0000-0000-000000000025', 'C', 'Manifesto dos Mineiros em defesa da abertura democrática.', FALSE),
  ('40000000-0000-0000-0000-000000000025', 'D', 'Tratado de Petrópolis que anexou o território do Acre.', FALSE),
  ('40000000-0000-0000-0000-000000000025', 'E', 'Plano SALTE voltado à saúde e energia.', FALSE),

  -- Q26
  ('40000000-0000-0000-0000-000000000026', 'A', 'Promover a liberdade irrestrita de imprensa e o pluripartidarismo político.', FALSE),
  ('40000000-0000-0000-0000-000000000026', 'B', 'Fiscalizar a autonomia legislativa das assembleias estaduais.', FALSE),
  ('40000000-0000-0000-0000-000000000026', 'C', 'Exercer a censura aos meios de comunicação e coordenar a propaganda oficial e o culto à imagem de Vargas.', TRUE),
  ('40000000-0000-0000-0000-000000000026', 'D', 'Organizar eleições diretas para governadores e prefeitos das capitais.', FALSE),
  ('40000000-0000-0000-0000-000000000026', 'E', 'Financiar campanhas de oposição da União Democrática Nacional (UDN).', FALSE),

  -- Q27
  ('40000000-0000-0000-0000-000000000027', 'A', 'Sistematizou direitos trabalhistas urbanos associando-os à figura protetora do Estado e ao sindicalismo atrelado.', TRUE),
  ('40000000-0000-0000-0000-000000000027', 'B', 'Estendeu imediatamente a reforma agrária e o salário mínimo a todos os trabalhadores rurais.', FALSE),
  ('40000000-0000-0000-0000-000000000027', 'C', 'Garantiu ampla autonomia sindical e o direito irrestrito de greve contra o governo.', FALSE),
  ('40000000-0000-0000-0000-000000000027', 'D', 'Extinguiu a Justiça do Trabalho criada anteriormente.', FALSE),
  ('40000000-0000-0000-0000-000000000027', 'E', 'Substituiu a carteira de trabalho por contratos informais sem contribuição previdenciária.', FALSE),

  -- Q28
  ('40000000-0000-0000-0000-000000000028', 'A', 'Petrobras e Eletrobras.', FALSE),
  ('40000000-0000-0000-0000-000000000028', 'B', 'Embraer e Telebras.', FALSE),
  ('40000000-0000-0000-0000-000000000028', 'C', 'Companhia Siderúrgica Nacional (CSN) e Companhia Vale do Rio Doce.', TRUE),
  ('40000000-0000-0000-0000-000000000028', 'D', 'Banco Central do Brasil e BNDES.', FALSE),
  ('40000000-0000-0000-0000-000000000028', 'E', 'Correios e Casa da Moeda.', FALSE),

  -- Q29
  ('40000000-0000-0000-0000-000000000029', 'A', 'A ampliação do federalismo e a autonomia plena dos governadores eleitos.', FALSE),
  ('40000000-0000-0000-0000-000000000029', 'B', 'A extinção dos partidos políticos, a nomeação de interventores estaduais e a centralização do poder no Executivo.', TRUE),
  ('40000000-0000-0000-0000-000000000029', 'C', 'A instituição do voto secreto feminino pela primeira vez no Brasil.', FALSE),
  ('40000000-0000-0000-0000-000000000029', 'D', 'A adoção do parlamentarismo com primeiro-ministro eleito pelo Congresso.', FALSE),
  ('40000000-0000-0000-0000-000000000029', 'E', 'A proibição de qualquer intervenção federal na economia nacional.', FALSE),

  -- Q31
  ('40000000-0000-0000-0000-000000000031', 'A', 'O Fundo Monetário Internacional (FMI) e o Banco Internacional para Reconstrução e Desenvolvimento (BIRD).', TRUE),
  ('40000000-0000-0000-0000-000000000031', 'B', 'A Organização dos Países Exportadores de Petróleo (OPEP) e o Mercosul.', FALSE),
  ('40000000-0000-0000-0000-000000000031', 'C', 'O Pacto de Varsóvia e o COMECON.', FALSE),
  ('40000000-0000-0000-0000-000000000031', 'D', 'A Liga das Nações e o Tribunal de Haia.', FALSE),
  ('40000000-0000-0000-0000-000000000031', 'E', 'A Organização Mundial do Comércio (OMC) e o NAFTA.', FALSE);


-- Avaliações

INSERT INTO assessment (id, title, description, assessment_date, start_time, end_time, teacher_id, class_group_id) VALUES
  ('50000000-0000-0000-0000-000000000001',
   'Avaliação 1 - Segunda Guerra Mundial (História)',
   'Avaliação bimestral baseada em questões de vestibulares (ENEM, VUNESP, FUVEST e UNICAMP) sobre antecedentes, conflitos e consequências da Segunda Guerra Mundial.',
   '2026-09-10', '08:00:00', '10:00:00',
   '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001'),

  ('50000000-0000-0000-0000-000000000002',
   'Avaliação 2 - Álgebra com Funções Trigonométricas (Matemática)',
   'Avaliação de Matemática com foco em modelagem periódica, identidades e equações trigonométricas de vestibulares.',
   '2026-09-17', '10:00:00', '12:00:00',
   '10000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001'),

  ('50000000-0000-0000-0000-000000000003',
   'Avaliação 3 - Filósofos do Contrato Social (Filosofia)',
   'Avaliação sobre o contratualismo moderno em Thomas Hobbes, John Locke e Jean-Jacques Rousseau.',
   '2026-09-24', '14:00:00', '16:00:00',
   '10000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001'),

  ('50000000-0000-0000-0000-000000000004',
   'Avaliação 4 - Blocos Econômicos (Geografia)',
   'Avaliação sobre graus de integração regional, União Europeia, USMCA e Mercosul com questões de vestibulares.',
   '2026-10-08', '08:00:00', '10:00:00',
   '10000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000002'),

  ('50000000-0000-0000-0000-000000000005',
   'Avaliação 5 - Brasil: Estado Novo (História)',
   'Avaliação sobre o golpe de 1937, DIP, CLT, industrialização e crise do Estado Novo (1937-1945).',
   '2026-10-15', '10:00:00', '12:00:00',
   '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002');


-- Itens das avaliações

INSERT INTO assessment_item (assessment_id, question_id, points, position) VALUES
  -- Avaliação 1: Segunda Guerra Mundial (Total = 10.00)
  ('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 1.50, 1),
  ('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', 1.50, 2),
  ('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000003', 1.50, 3),
  ('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000004', 1.50, 4),
  ('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000005', 1.50, 5),
  ('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000006', 2.50, 6),

  -- Avaliação 2: Álgebra com Funções Trigonométricas (Total = 10.00)
  ('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000007', 1.50, 1),
  ('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000008', 1.50, 2),
  ('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000009', 1.50, 3),
  ('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000010', 1.50, 4),
  ('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000011', 1.50, 5),
  ('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000012', 2.50, 6),

  -- Avaliação 3: Filósofos do Contrato Social (Total = 10.00)
  ('50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000013', 1.50, 1),
  ('50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000014', 1.50, 2),
  ('50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000015', 1.50, 3),
  ('50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000016', 1.50, 4),
  ('50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000017', 1.50, 5),
  ('50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000018', 2.50, 6),

  -- Avaliação 4: Blocos Econômicos (Total = 10.00)
  ('50000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000019', 1.50, 1),
  ('50000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000020', 1.50, 2),
  ('50000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000021', 1.50, 3),
  ('50000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000022', 1.50, 4),
  ('50000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000023', 1.50, 5),
  ('50000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000024', 2.50, 6),

  -- Avaliação 5: Brasil: Estado Novo (Total = 11.00, incluindo Q05 reutilizada sobre a FEB!)
  ('50000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000025', 1.50, 1),
  ('50000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000026', 1.50, 2),
  ('50000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000027', 1.50, 3),
  ('50000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000028', 1.50, 4),
  ('50000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000029', 1.50, 5),
  ('50000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000005', 1.00, 6),
  ('50000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000030', 2.50, 7);


-- Realização das avaliações
--  A maioria dos alunos possui nota fechada, com notas variadas, em GRADED,
--  outros em status de SUBMITTED, outros em ASSIGNED.

-- Avaliação 1
-- Iniciar realização (ASSIGNED -> IN_PROGRESS)
UPDATE assignment
SET status = 'IN_PROGRESS',
    started_at = '2026-09-10 08:05:00'
WHERE assessment_id = '50000000-0000-0000-0000-000000000001'
  AND student_id IN (
  '20000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000004',
  '20000000-0000-0000-0000-000000000005',
  '20000000-0000-0000-0000-000000000006',
  '20000000-0000-0000-0000-000000000007',
  '20000000-0000-0000-0000-000000000008',
  '20000000-0000-0000-0000-000000000009'
);

-- Registrar respostas dos alunos (enquanto IN_PROGRESS)
INSERT INTO answer (assessment_id, student_id, question_id, chosen_letter, answer_text, score) VALUES
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000003', 'D', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000004', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000005', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000006', NULL, 'Os EUA entraram na guerra após o ataque japonês a Pearl Harbor em dezembro de 1941 e devido aos ataques de submarinos alemães no Atlântico, mudando o equilíbrio industrial e militar no Pacífico e na Europa.', NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000003', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000004', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000005', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000006', NULL, 'O ataque a Pearl Harbor pelo Japão e a guerra submarina da Alemanha motivaram os EUA, fortalecendo os Aliados com grande produção bélica e tropas na Europa e no Pacífico.', NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000001', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000002', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000003', 'D', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000004', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000005', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000006', NULL, 'A entrada ocorreu por causa de Pearl Harbor em 1941, o que ajudou os Aliados a vencerem o Japão no Pacífico.', NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000001', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000002', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000003', 'D', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000004', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000005', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000006', NULL, 'Os EUA entraram na guerra após o ataque japonês a Pearl Harbor em dezembro de 1941 e devido aos ataques de submarinos alemães no Atlântico, mudando o equilíbrio industrial e militar no Pacífico e na Europa.', NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000001', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000002', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000003', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000004', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000005', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000006', NULL, 'O ataque a Pearl Harbor pelo Japão e a guerra submarina da Alemanha motivaram os EUA, fortalecendo os Aliados com grande produção bélica e tropas na Europa e no Pacífico.', NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000001', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000002', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000003', 'D', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000004', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000005', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000006', NULL, 'A entrada ocorreu por causa de Pearl Harbor em 1941, o que ajudou os Aliados a vencerem o Japão no Pacífico.', NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000001', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000002', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000003', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000004', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000005', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000006', NULL, 'Os EUA entraram na guerra após o ataque japonês a Pearl Harbor em dezembro de 1941 e devido aos ataques de submarinos alemães no Atlântico, mudando o equilíbrio industrial e militar no Pacífico e na Europa.', NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000001', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000002', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000003', 'D', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000004', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000005', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000006', NULL, 'O ataque a Pearl Harbor pelo Japão e a guerra submarina da Alemanha motivaram os EUA, fortalecendo os Aliados com grande produção bélica e tropas na Europa e no Pacífico.', NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000001', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000002', 'C', NULL, NULL);

-- Submeter avaliações finalizadas (IN_PROGRESS -> SUBMITTED)
UPDATE assignment
SET status = 'SUBMITTED',
    submitted_at = '2026-09-10 09:40:00'
WHERE assessment_id = '50000000-0000-0000-0000-000000000001'
  AND student_id IN (
  '20000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000004',
  '20000000-0000-0000-0000-000000000005',
  '20000000-0000-0000-0000-000000000006',
  '20000000-0000-0000-0000-000000000007',
  '20000000-0000-0000-0000-000000000008'
);

-- Lançar notas das questões discursivas (enquanto SUBMITTED)
UPDATE answer SET score = 2.50 WHERE assessment_id = '50000000-0000-0000-0000-000000000001' AND student_id = '20000000-0000-0000-0000-000000000001' AND question_id = '40000000-0000-0000-0000-000000000006';
UPDATE answer SET score = 2.00 WHERE assessment_id = '50000000-0000-0000-0000-000000000001' AND student_id = '20000000-0000-0000-0000-000000000002' AND question_id = '40000000-0000-0000-0000-000000000006';
UPDATE answer SET score = 1.50 WHERE assessment_id = '50000000-0000-0000-0000-000000000001' AND student_id = '20000000-0000-0000-0000-000000000003' AND question_id = '40000000-0000-0000-0000-000000000006';
UPDATE answer SET score = 2.25 WHERE assessment_id = '50000000-0000-0000-0000-000000000001' AND student_id = '20000000-0000-0000-0000-000000000004' AND question_id = '40000000-0000-0000-0000-000000000006';
UPDATE answer SET score = 1.00 WHERE assessment_id = '50000000-0000-0000-0000-000000000001' AND student_id = '20000000-0000-0000-0000-000000000005' AND question_id = '40000000-0000-0000-0000-000000000006';
UPDATE answer SET score = 2.00 WHERE assessment_id = '50000000-0000-0000-0000-000000000001' AND student_id = '20000000-0000-0000-0000-000000000006' AND question_id = '40000000-0000-0000-0000-000000000006';
UPDATE answer SET score = 1.25 WHERE assessment_id = '50000000-0000-0000-0000-000000000001' AND student_id = '20000000-0000-0000-0000-000000000007' AND question_id = '40000000-0000-0000-0000-000000000006';

-- Concluir correção das avaliações (SUBMITTED -> GRADED)
UPDATE assignment
SET status = 'GRADED'
WHERE assessment_id = '50000000-0000-0000-0000-000000000001'
  AND student_id IN (
  '20000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000004',
  '20000000-0000-0000-0000-000000000005',
  '20000000-0000-0000-0000-000000000006',
  '20000000-0000-0000-0000-000000000007'
);


-- Avaliação 2
-- Iniciar realização (ASSIGNED -> IN_PROGRESS)
UPDATE assignment
SET status = 'IN_PROGRESS',
    started_at = '2026-09-17 10:05:00'
WHERE assessment_id = '50000000-0000-0000-0000-000000000002'
  AND student_id IN (
  '20000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000004',
  '20000000-0000-0000-0000-000000000005',
  '20000000-0000-0000-0000-000000000006',
  '20000000-0000-0000-0000-000000000007',
  '20000000-0000-0000-0000-000000000008',
  '20000000-0000-0000-0000-000000000009',
  '20000000-0000-0000-0000-000000000010'
);

-- Registrar respostas dos alunos (enquanto IN_PROGRESS)
INSERT INTO answer (assessment_id, student_id, question_id, chosen_letter, answer_text, score) VALUES
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000007', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000008', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000009', 'D', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000010', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000011', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000012', NULL, 'Substituindo sen(x) = y, obtemos 2y² - y - 1 = 0, logo y = 1 ou y = -1/2. No intervalo [0, 2*pi], as soluções são x = pi/2, x = 7*pi/6 e x = 11*pi/6.', NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000007', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000008', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000009', 'D', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000010', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000011', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000012', NULL, 'Resolvendo a equação do segundo grau em sen(x), encontramos sen(x) = 1 (x = pi/2) e sen(x) = -1/2 (x = 7*pi/6 e 11*pi/6).', NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000007', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000008', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000009', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000010', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000011', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000012', NULL, 'Pela fórmula de Bhaskara, sen(x) = 1 ou sen(x) = -1/2, dando x = pi/2 e x = 7*pi/6.', NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000007', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000008', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000009', 'D', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000010', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000011', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000012', NULL, 'Substituindo sen(x) = y, obtemos 2y² - y - 1 = 0, logo y = 1 ou y = -1/2. No intervalo [0, 2*pi], as soluções são x = pi/2, x = 7*pi/6 e x = 11*pi/6.', NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000007', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000008', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000009', 'D', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000010', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000011', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000012', NULL, 'Resolvendo a equação do segundo grau em sen(x), encontramos sen(x) = 1 (x = pi/2) e sen(x) = -1/2 (x = 7*pi/6 e 11*pi/6).', NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000007', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000008', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000009', 'D', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000010', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000011', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000012', NULL, 'Pela fórmula de Bhaskara, sen(x) = 1 ou sen(x) = -1/2, dando x = pi/2 e x = 7*pi/6.', NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000007', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000008', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000009', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000010', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000011', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000012', NULL, 'Substituindo sen(x) = y, obtemos 2y² - y - 1 = 0, logo y = 1 ou y = -1/2. No intervalo [0, 2*pi], as soluções são x = pi/2, x = 7*pi/6 e x = 11*pi/6.', NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000007', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000008', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000009', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000010', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000011', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000012', NULL, 'Resolvendo a equação do segundo grau em sen(x), encontramos sen(x) = 1 (x = pi/2) e sen(x) = -1/2 (x = 7*pi/6 e 11*pi/6).', NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000007', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000008', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000009', 'D', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000010', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000011', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000012', NULL, 'Pela fórmula de Bhaskara, sen(x) = 1 ou sen(x) = -1/2, dando x = pi/2 e x = 7*pi/6.', NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000010', '40000000-0000-0000-0000-000000000007', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000010', '40000000-0000-0000-0000-000000000008', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000010', '40000000-0000-0000-0000-000000000009', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000010', '40000000-0000-0000-0000-000000000010', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000010', '40000000-0000-0000-0000-000000000011', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000010', '40000000-0000-0000-0000-000000000012', NULL, 'Substituindo sen(x) = y, obtemos 2y² - y - 1 = 0, logo y = 1 ou y = -1/2. No intervalo [0, 2*pi], as soluções são x = pi/2, x = 7*pi/6 e x = 11*pi/6.', NULL);

-- Submeter avaliações finalizadas (IN_PROGRESS -> SUBMITTED)
UPDATE assignment
SET status = 'SUBMITTED',
    submitted_at = '2026-09-17 11:45:00'
WHERE assessment_id = '50000000-0000-0000-0000-000000000002'
  AND student_id IN (
  '20000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000004',
  '20000000-0000-0000-0000-000000000005',
  '20000000-0000-0000-0000-000000000006',
  '20000000-0000-0000-0000-000000000007',
  '20000000-0000-0000-0000-000000000008',
  '20000000-0000-0000-0000-000000000009',
  '20000000-0000-0000-0000-000000000010'
);

-- Lançar notas das questões discursivas (enquanto SUBMITTED)
UPDATE answer SET score = 2.50 WHERE assessment_id = '50000000-0000-0000-0000-000000000002' AND student_id = '20000000-0000-0000-0000-000000000001' AND question_id = '40000000-0000-0000-0000-000000000012';
UPDATE answer SET score = 2.25 WHERE assessment_id = '50000000-0000-0000-0000-000000000002' AND student_id = '20000000-0000-0000-0000-000000000002' AND question_id = '40000000-0000-0000-0000-000000000012';
UPDATE answer SET score = 2.00 WHERE assessment_id = '50000000-0000-0000-0000-000000000002' AND student_id = '20000000-0000-0000-0000-000000000003' AND question_id = '40000000-0000-0000-0000-000000000012';
UPDATE answer SET score = 1.75 WHERE assessment_id = '50000000-0000-0000-0000-000000000002' AND student_id = '20000000-0000-0000-0000-000000000004' AND question_id = '40000000-0000-0000-0000-000000000012';
UPDATE answer SET score = 1.50 WHERE assessment_id = '50000000-0000-0000-0000-000000000002' AND student_id = '20000000-0000-0000-0000-000000000005' AND question_id = '40000000-0000-0000-0000-000000000012';
UPDATE answer SET score = 2.50 WHERE assessment_id = '50000000-0000-0000-0000-000000000002' AND student_id = '20000000-0000-0000-0000-000000000006' AND question_id = '40000000-0000-0000-0000-000000000012';
UPDATE answer SET score = 1.50 WHERE assessment_id = '50000000-0000-0000-0000-000000000002' AND student_id = '20000000-0000-0000-0000-000000000007' AND question_id = '40000000-0000-0000-0000-000000000012';
UPDATE answer SET score = 1.75 WHERE assessment_id = '50000000-0000-0000-0000-000000000002' AND student_id = '20000000-0000-0000-0000-000000000008' AND question_id = '40000000-0000-0000-0000-000000000012';
UPDATE answer SET score = 1.00 WHERE assessment_id = '50000000-0000-0000-0000-000000000002' AND student_id = '20000000-0000-0000-0000-000000000010' AND question_id = '40000000-0000-0000-0000-000000000012';

-- Concluir correção das avaliações (SUBMITTED -> GRADED)
UPDATE assignment
SET status = 'GRADED'
WHERE assessment_id = '50000000-0000-0000-0000-000000000002'
  AND student_id IN (
  '20000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000004',
  '20000000-0000-0000-0000-000000000005',
  '20000000-0000-0000-0000-000000000006',
  '20000000-0000-0000-0000-000000000007',
  '20000000-0000-0000-0000-000000000008',
  '20000000-0000-0000-0000-000000000010'
);

-- Avaliação 3
-- Iniciar realização (ASSIGNED -> IN_PROGRESS)
UPDATE assignment
SET status = 'IN_PROGRESS',
    started_at = '2026-09-24 14:05:00'
WHERE assessment_id = '50000000-0000-0000-0000-000000000003'
  AND student_id IN (
  '20000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000004',
  '20000000-0000-0000-0000-000000000005',
  '20000000-0000-0000-0000-000000000006',
  '20000000-0000-0000-0000-000000000007',
  '20000000-0000-0000-0000-000000000008',
  '20000000-0000-0000-0000-000000000009'
);

-- Registrar respostas dos alunos (enquanto IN_PROGRESS)
INSERT INTO answer (assessment_id, student_id, question_id, chosen_letter, answer_text, score) VALUES
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000013', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000014', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000015', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000016', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000017', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000018', NULL, 'Em Hobbes, o estado de natureza é de guerra de todos contra todos e o pacto institui um Estado absolutista. Em Rousseau, o homem é naturalmente bom, mas a propriedade privada gera desigualdade, e o pacto funda uma república guiada pela vontade geral.', NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000013', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000014', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000015', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000016', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000017', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000018', NULL, 'Hobbes defende que o homem é o lobo do homem e precisa de um soberano absoluto; já Rousseau acredita na bondade natural humana e na soberania popular.', NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000013', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000014', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000015', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000016', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000017', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000018', NULL, 'Hobbes propõe o absolutismo para evitar o caos natural, enquanto Rousseau defende a democracia direta.', NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000013', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000014', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000015', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000016', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000017', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000018', NULL, 'Em Hobbes, o estado de natureza é de guerra de todos contra todos e o pacto institui um Estado absolutista. Em Rousseau, o homem é naturalmente bom, mas a propriedade privada gera desigualdade, e o pacto funda uma república guiada pela vontade geral.', NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000013', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000014', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000015', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000016', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000017', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000018', NULL, 'Hobbes defende que o homem é o lobo do homem e precisa de um soberano absoluto; já Rousseau acredita na bondade natural humana e na soberania popular.', NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000013', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000014', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000015', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000016', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000017', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000018', NULL, 'Hobbes propõe o absolutismo para evitar o caos natural, enquanto Rousseau defende a democracia direta.', NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000013', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000014', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000015', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000016', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000017', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000018', NULL, 'Em Hobbes, o estado de natureza é de guerra de todos contra todos e o pacto institui um Estado absolutista. Em Rousseau, o homem é naturalmente bom, mas a propriedade privada gera desigualdade, e o pacto funda uma república guiada pela vontade geral.', NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000013', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000014', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000015', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000016', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000017', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000018', NULL, 'Hobbes defende que o homem é o lobo do homem e precisa de um soberano absoluto; já Rousseau acredita na bondade natural humana e na soberania popular.', NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000013', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000014', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000015', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000016', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000017', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000018', NULL, 'Hobbes propõe o absolutismo para evitar o caos natural, enquanto Rousseau defende a democracia direta.', NULL);

-- Submeter avaliações finalizadas (IN_PROGRESS -> SUBMITTED)
UPDATE assignment
SET status = 'SUBMITTED',
    submitted_at = '2026-09-24 15:40:00'
WHERE assessment_id = '50000000-0000-0000-0000-000000000003'
  AND student_id IN (
  '20000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000004',
  '20000000-0000-0000-0000-000000000005',
  '20000000-0000-0000-0000-000000000006',
  '20000000-0000-0000-0000-000000000007',
  '20000000-0000-0000-0000-000000000008',
  '20000000-0000-0000-0000-000000000009'
);

-- Lançar notas das questões discursivas (enquanto SUBMITTED)
UPDATE answer SET score = 2.50 WHERE assessment_id = '50000000-0000-0000-0000-000000000003' AND student_id = '20000000-0000-0000-0000-000000000001' AND question_id = '40000000-0000-0000-0000-000000000018';
UPDATE answer SET score = 2.00 WHERE assessment_id = '50000000-0000-0000-0000-000000000003' AND student_id = '20000000-0000-0000-0000-000000000002' AND question_id = '40000000-0000-0000-0000-000000000018';
UPDATE answer SET score = 2.50 WHERE assessment_id = '50000000-0000-0000-0000-000000000003' AND student_id = '20000000-0000-0000-0000-000000000003' AND question_id = '40000000-0000-0000-0000-000000000018';
UPDATE answer SET score = 2.25 WHERE assessment_id = '50000000-0000-0000-0000-000000000003' AND student_id = '20000000-0000-0000-0000-000000000004' AND question_id = '40000000-0000-0000-0000-000000000018';
UPDATE answer SET score = 2.00 WHERE assessment_id = '50000000-0000-0000-0000-000000000003' AND student_id = '20000000-0000-0000-0000-000000000005' AND question_id = '40000000-0000-0000-0000-000000000018';
UPDATE answer SET score = 2.00 WHERE assessment_id = '50000000-0000-0000-0000-000000000003' AND student_id = '20000000-0000-0000-0000-000000000006' AND question_id = '40000000-0000-0000-0000-000000000018';
UPDATE answer SET score = 2.00 WHERE assessment_id = '50000000-0000-0000-0000-000000000003' AND student_id = '20000000-0000-0000-0000-000000000007' AND question_id = '40000000-0000-0000-0000-000000000018';
UPDATE answer SET score = 2.25 WHERE assessment_id = '50000000-0000-0000-0000-000000000003' AND student_id = '20000000-0000-0000-0000-000000000008' AND question_id = '40000000-0000-0000-0000-000000000018';
UPDATE answer SET score = 1.50 WHERE assessment_id = '50000000-0000-0000-0000-000000000003' AND student_id = '20000000-0000-0000-0000-000000000009' AND question_id = '40000000-0000-0000-0000-000000000018';

-- Concluir correção das avaliações (SUBMITTED -> GRADED)
UPDATE assignment
SET status = 'GRADED'
WHERE assessment_id = '50000000-0000-0000-0000-000000000003'
  AND student_id IN (
  '20000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000004',
  '20000000-0000-0000-0000-000000000005',
  '20000000-0000-0000-0000-000000000006',
  '20000000-0000-0000-0000-000000000007',
  '20000000-0000-0000-0000-000000000008',
  '20000000-0000-0000-0000-000000000009'
);

-- Avaliação 4
-- Iniciar realização (ASSIGNED -> IN_PROGRESS)
UPDATE assignment
SET status = 'IN_PROGRESS',
    started_at = '2026-10-08 08:05:00'
WHERE assessment_id = '50000000-0000-0000-0000-000000000004'
  AND student_id IN (
  '20000000-0000-0000-0000-000000000011',
  '20000000-0000-0000-0000-000000000012',
  '20000000-0000-0000-0000-000000000013',
  '20000000-0000-0000-0000-000000000014',
  '20000000-0000-0000-0000-000000000015',
  '20000000-0000-0000-0000-000000000016',
  '20000000-0000-0000-0000-000000000017',
  '20000000-0000-0000-0000-000000000018',
  '20000000-0000-0000-0000-000000000019'
);

-- Registrar respostas dos alunos (enquanto IN_PROGRESS)
INSERT INTO answer (assessment_id, student_id, question_id, chosen_letter, answer_text, score) VALUES
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000019', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000020', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000021', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000022', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000023', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000024', NULL, 'A Zona de Livre Comércio elimina apenas tarifas alfandegárias entre os países-membros (ex.: USMCA). Já o Mercado Comum garante também a livre circulação de pessoas, capitais e serviços, além da Tarifa Externa Comum (ex.: União Europeia).', NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000019', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000020', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000021', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000022', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000023', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000024', NULL, 'Zona de Livre Comércio reduz impostos de importação internos (ex.: NAFTA/USMCA); Mercado Comum libera também trabalhadores e capitais (ex.: União Europeia).', NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000019', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000020', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000021', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000022', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000023', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000024', NULL, 'Na zona de livre comércio circulam apenas mercadorias sem tarifa (USMCA), enquanto no mercado comum circulam pessoas e capitais (UE).', NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000014', '40000000-0000-0000-0000-000000000019', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000014', '40000000-0000-0000-0000-000000000020', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000014', '40000000-0000-0000-0000-000000000021', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000014', '40000000-0000-0000-0000-000000000022', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000014', '40000000-0000-0000-0000-000000000023', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000014', '40000000-0000-0000-0000-000000000024', NULL, 'A Zona de Livre Comércio elimina apenas tarifas alfandegárias entre os países-membros (ex.: USMCA). Já o Mercado Comum garante também a livre circulação de pessoas, capitais e serviços, além da Tarifa Externa Comum (ex.: União Europeia).', NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000015', '40000000-0000-0000-0000-000000000019', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000015', '40000000-0000-0000-0000-000000000020', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000015', '40000000-0000-0000-0000-000000000021', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000015', '40000000-0000-0000-0000-000000000022', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000015', '40000000-0000-0000-0000-000000000023', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000015', '40000000-0000-0000-0000-000000000024', NULL, 'Zona de Livre Comércio reduz impostos de importação internos (ex.: NAFTA/USMCA); Mercado Comum libera também trabalhadores e capitais (ex.: União Europeia).', NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000016', '40000000-0000-0000-0000-000000000019', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000016', '40000000-0000-0000-0000-000000000020', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000016', '40000000-0000-0000-0000-000000000021', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000016', '40000000-0000-0000-0000-000000000022', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000016', '40000000-0000-0000-0000-000000000023', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000016', '40000000-0000-0000-0000-000000000024', NULL, 'Na zona de livre comércio circulam apenas mercadorias sem tarifa (USMCA), enquanto no mercado comum circulam pessoas e capitais (UE).', NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000017', '40000000-0000-0000-0000-000000000019', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000017', '40000000-0000-0000-0000-000000000020', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000017', '40000000-0000-0000-0000-000000000021', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000017', '40000000-0000-0000-0000-000000000022', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000017', '40000000-0000-0000-0000-000000000023', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000017', '40000000-0000-0000-0000-000000000024', NULL, 'A Zona de Livre Comércio elimina apenas tarifas alfandegárias entre os países-membros (ex.: USMCA). Já o Mercado Comum garante também a livre circulação de pessoas, capitais e serviços, além da Tarifa Externa Comum (ex.: União Europeia).', NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000018', '40000000-0000-0000-0000-000000000019', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000018', '40000000-0000-0000-0000-000000000020', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000018', '40000000-0000-0000-0000-000000000021', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000018', '40000000-0000-0000-0000-000000000022', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000018', '40000000-0000-0000-0000-000000000023', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000018', '40000000-0000-0000-0000-000000000024', NULL, 'Zona de Livre Comércio reduz impostos de importação internos (ex.: NAFTA/USMCA); Mercado Comum libera também trabalhadores e capitais (ex.: União Europeia).', NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000019', '40000000-0000-0000-0000-000000000019', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000019', '40000000-0000-0000-0000-000000000020', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000019', '40000000-0000-0000-0000-000000000021', 'B', NULL, NULL);

-- Submeter avaliações finalizadas (IN_PROGRESS -> SUBMITTED)
UPDATE assignment
SET status = 'SUBMITTED',
    submitted_at = '2026-10-08 09:45:00'
WHERE assessment_id = '50000000-0000-0000-0000-000000000004'
  AND student_id IN (
  '20000000-0000-0000-0000-000000000011',
  '20000000-0000-0000-0000-000000000012',
  '20000000-0000-0000-0000-000000000013',
  '20000000-0000-0000-0000-000000000014',
  '20000000-0000-0000-0000-000000000015',
  '20000000-0000-0000-0000-000000000016',
  '20000000-0000-0000-0000-000000000017',
  '20000000-0000-0000-0000-000000000018'
);

-- Lançar notas das questões discursivas (enquanto SUBMITTED)
UPDATE answer SET score = 2.50 WHERE assessment_id = '50000000-0000-0000-0000-000000000004' AND student_id = '20000000-0000-0000-0000-000000000011' AND question_id = '40000000-0000-0000-0000-000000000024';
UPDATE answer SET score = 2.00 WHERE assessment_id = '50000000-0000-0000-0000-000000000004' AND student_id = '20000000-0000-0000-0000-000000000012' AND question_id = '40000000-0000-0000-0000-000000000024';
UPDATE answer SET score = 1.50 WHERE assessment_id = '50000000-0000-0000-0000-000000000004' AND student_id = '20000000-0000-0000-0000-000000000013' AND question_id = '40000000-0000-0000-0000-000000000024';
UPDATE answer SET score = 2.25 WHERE assessment_id = '50000000-0000-0000-0000-000000000004' AND student_id = '20000000-0000-0000-0000-000000000014' AND question_id = '40000000-0000-0000-0000-000000000024';
UPDATE answer SET score = 1.00 WHERE assessment_id = '50000000-0000-0000-0000-000000000004' AND student_id = '20000000-0000-0000-0000-000000000015' AND question_id = '40000000-0000-0000-0000-000000000024';
UPDATE answer SET score = 2.00 WHERE assessment_id = '50000000-0000-0000-0000-000000000004' AND student_id = '20000000-0000-0000-0000-000000000016' AND question_id = '40000000-0000-0000-0000-000000000024';
UPDATE answer SET score = 1.75 WHERE assessment_id = '50000000-0000-0000-0000-000000000004' AND student_id = '20000000-0000-0000-0000-000000000017' AND question_id = '40000000-0000-0000-0000-000000000024';

-- Concluir correção das avaliações (SUBMITTED -> GRADED)
UPDATE assignment
SET status = 'GRADED'
WHERE assessment_id = '50000000-0000-0000-0000-000000000004'
  AND student_id IN (
  '20000000-0000-0000-0000-000000000011',
  '20000000-0000-0000-0000-000000000012',
  '20000000-0000-0000-0000-000000000013',
  '20000000-0000-0000-0000-000000000014',
  '20000000-0000-0000-0000-000000000015',
  '20000000-0000-0000-0000-000000000016',
  '20000000-0000-0000-0000-000000000017'
);

-- Avaliação 5
-- Iniciar realização (ASSIGNED -> IN_PROGRESS)
UPDATE assignment
SET status = 'IN_PROGRESS',
    started_at = '2026-10-15 10:05:00'
WHERE assessment_id = '50000000-0000-0000-0000-000000000005'
  AND student_id IN (
  '20000000-0000-0000-0000-000000000011',
  '20000000-0000-0000-0000-000000000012',
  '20000000-0000-0000-0000-000000000013',
  '20000000-0000-0000-0000-000000000014',
  '20000000-0000-0000-0000-000000000015',
  '20000000-0000-0000-0000-000000000016',
  '20000000-0000-0000-0000-000000000017',
  '20000000-0000-0000-0000-000000000018',
  '20000000-0000-0000-0000-000000000019'
);

-- Registrar respostas dos alunos (enquanto IN_PROGRESS)
INSERT INTO answer (assessment_id, student_id, question_id, chosen_letter, answer_text, score) VALUES
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000025', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000026', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000027', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000028', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000029', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000005', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000030', NULL, 'A contradição estava em o Brasil enviar a FEB para combater regimes totalitários na Europa ao lado das democracias aliadas, enquanto mantinha internamente uma ditadura sem eleições e com censura do DIP, o que acelerou a redemocratização em 1945.', NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000025', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000026', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000027', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000028', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000029', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000005', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000030', NULL, 'Vargas lutou contra o fascismo na Itália com a FEB, mas governava como ditador no Brasil, gerando pressão popular pelo fim do Estado Novo.', NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000025', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000026', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000027', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000028', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000029', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000005', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000030', NULL, 'O Brasil defendia a democracia na guerra na Europa enquanto vivia sob censura e autoritarismo internamente.', NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000014', '40000000-0000-0000-0000-000000000025', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000014', '40000000-0000-0000-0000-000000000026', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000014', '40000000-0000-0000-0000-000000000027', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000014', '40000000-0000-0000-0000-000000000028', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000014', '40000000-0000-0000-0000-000000000029', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000014', '40000000-0000-0000-0000-000000000005', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000014', '40000000-0000-0000-0000-000000000030', NULL, 'A contradição estava em o Brasil enviar a FEB para combater regimes totalitários na Europa ao lado das democracias aliadas, enquanto mantinha internamente uma ditadura sem eleições e com censura do DIP, o que acelerou a redemocratização em 1945.', NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000015', '40000000-0000-0000-0000-000000000025', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000015', '40000000-0000-0000-0000-000000000026', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000015', '40000000-0000-0000-0000-000000000027', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000015', '40000000-0000-0000-0000-000000000028', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000015', '40000000-0000-0000-0000-000000000029', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000015', '40000000-0000-0000-0000-000000000005', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000015', '40000000-0000-0000-0000-000000000030', NULL, 'Vargas lutou contra o fascismo na Itália com a FEB, mas governava como ditador no Brasil, gerando pressão popular pelo fim do Estado Novo.', NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000016', '40000000-0000-0000-0000-000000000025', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000016', '40000000-0000-0000-0000-000000000026', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000016', '40000000-0000-0000-0000-000000000027', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000016', '40000000-0000-0000-0000-000000000028', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000016', '40000000-0000-0000-0000-000000000029', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000016', '40000000-0000-0000-0000-000000000005', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000016', '40000000-0000-0000-0000-000000000030', NULL, 'O Brasil defendia a democracia na guerra na Europa enquanto vivia sob censura e autoritarismo internamente.', NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000017', '40000000-0000-0000-0000-000000000025', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000017', '40000000-0000-0000-0000-000000000026', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000017', '40000000-0000-0000-0000-000000000027', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000017', '40000000-0000-0000-0000-000000000028', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000017', '40000000-0000-0000-0000-000000000029', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000017', '40000000-0000-0000-0000-000000000005', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000017', '40000000-0000-0000-0000-000000000030', NULL, 'A contradição estava em o Brasil enviar a FEB para combater regimes totalitários na Europa ao lado das democracias aliadas, enquanto mantinha internamente uma ditadura sem eleições e com censura do DIP, o que acelerou a redemocratização em 1945.', NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000018', '40000000-0000-0000-0000-000000000025', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000018', '40000000-0000-0000-0000-000000000026', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000018', '40000000-0000-0000-0000-000000000027', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000018', '40000000-0000-0000-0000-000000000028', 'C', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000018', '40000000-0000-0000-0000-000000000029', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000018', '40000000-0000-0000-0000-000000000005', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000018', '40000000-0000-0000-0000-000000000030', NULL, 'Vargas lutou contra o fascismo na Itália com a FEB, mas governava como ditador no Brasil, gerando pressão popular pelo fim do Estado Novo.', NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000019', '40000000-0000-0000-0000-000000000025', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000019', '40000000-0000-0000-0000-000000000026', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000019', '40000000-0000-0000-0000-000000000027', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000019', '40000000-0000-0000-0000-000000000028', 'E', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000019', '40000000-0000-0000-0000-000000000029', 'B', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000019', '40000000-0000-0000-0000-000000000005', 'A', NULL, NULL),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000019', '40000000-0000-0000-0000-000000000030', NULL, 'O Brasil defendia a democracia na guerra na Europa enquanto vivia sob censura e autoritarismo internamente.', NULL);

-- Submeter avaliações finalizadas (IN_PROGRESS -> SUBMITTED)
UPDATE assignment
SET status = 'SUBMITTED',
    submitted_at = '2026-10-15 11:50:00'
WHERE assessment_id = '50000000-0000-0000-0000-000000000005'
  AND student_id IN (
  '20000000-0000-0000-0000-000000000011',
  '20000000-0000-0000-0000-000000000012',
  '20000000-0000-0000-0000-000000000013',
  '20000000-0000-0000-0000-000000000014',
  '20000000-0000-0000-0000-000000000015',
  '20000000-0000-0000-0000-000000000016',
  '20000000-0000-0000-0000-000000000017',
  '20000000-0000-0000-0000-000000000018',
  '20000000-0000-0000-0000-000000000019'
);

-- Lançar notas das questões discursivas (enquanto SUBMITTED)
UPDATE answer SET score = 2.50 WHERE assessment_id = '50000000-0000-0000-0000-000000000005' AND student_id = '20000000-0000-0000-0000-000000000011' AND question_id = '40000000-0000-0000-0000-000000000030';
UPDATE answer SET score = 2.25 WHERE assessment_id = '50000000-0000-0000-0000-000000000005' AND student_id = '20000000-0000-0000-0000-000000000012' AND question_id = '40000000-0000-0000-0000-000000000030';
UPDATE answer SET score = 2.00 WHERE assessment_id = '50000000-0000-0000-0000-000000000005' AND student_id = '20000000-0000-0000-0000-000000000013' AND question_id = '40000000-0000-0000-0000-000000000030';
UPDATE answer SET score = 2.50 WHERE assessment_id = '50000000-0000-0000-0000-000000000005' AND student_id = '20000000-0000-0000-0000-000000000014' AND question_id = '40000000-0000-0000-0000-000000000030';
UPDATE answer SET score = 1.50 WHERE assessment_id = '50000000-0000-0000-0000-000000000005' AND student_id = '20000000-0000-0000-0000-000000000015' AND question_id = '40000000-0000-0000-0000-000000000030';
UPDATE answer SET score = 2.00 WHERE assessment_id = '50000000-0000-0000-0000-000000000005' AND student_id = '20000000-0000-0000-0000-000000000016' AND question_id = '40000000-0000-0000-0000-000000000030';
UPDATE answer SET score = 1.75 WHERE assessment_id = '50000000-0000-0000-0000-000000000005' AND student_id = '20000000-0000-0000-0000-000000000017' AND question_id = '40000000-0000-0000-0000-000000000030';
UPDATE answer SET score = 2.25 WHERE assessment_id = '50000000-0000-0000-0000-000000000005' AND student_id = '20000000-0000-0000-0000-000000000018' AND question_id = '40000000-0000-0000-0000-000000000030';

-- Concluir correção das avaliações (SUBMITTED -> GRADED)
UPDATE assignment
SET status = 'GRADED'
WHERE assessment_id = '50000000-0000-0000-0000-000000000005'
  AND student_id IN (
  '20000000-0000-0000-0000-000000000011',
  '20000000-0000-0000-0000-000000000012',
  '20000000-0000-0000-0000-000000000013',
  '20000000-0000-0000-0000-000000000014',
  '20000000-0000-0000-0000-000000000015',
  '20000000-0000-0000-0000-000000000016',
  '20000000-0000-0000-0000-000000000017',
  '20000000-0000-0000-0000-000000000018'
);

COMMIT;
