import { useState, useMemo } from 'react';
import { DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableToolbar, TableToolbarContent, TableToolbarSearch, Button, Tag, DataTableSkeleton } from '@carbon/react'
import { Add, Edit } from '@carbon/icons-react'
import type { Question, FreeTextQuestion, MultipleChoiceQuestion } from '../../api'

export type QuestionFilterType = 'ALL' | 'MULTIPLE_CHOICE' | 'FREE_TEXT';

type AnyQuestion = Question | FreeTextQuestion | MultipleChoiceQuestion;

interface QuestionsTableProps {
  questions: AnyQuestion[];
  filterType: QuestionFilterType;
  teacherNameMap: Map<string, string>;
  loading: boolean;
  onAddMc: () => void;
  onAddFt: () => void;
  onEdit: (question: AnyQuestion) => void;
}

export const QuestionsTable = ({ questions, filterType, teacherNameMap, loading, onAddMc, onAddFt, onEdit }: QuestionsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const headers = useMemo(() => {
    const base = [
      { key: 'statement', header: 'Statement' },
      { key: 'type', header: 'Type' },
      { key: 'author', header: 'Author' },
    ];

    if (filterType === 'FREE_TEXT') {
      base.push({ key: 'expectedAnswer', header: 'Expected Answer' });
    }

    base.push({ key: 'createdAt', header: 'Created' });
    base.push({ key: 'actions', header: 'Actions' });
    return base;
  }, [filterType]);

  const filteredQuestions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return questions;

    return questions.filter((q) => {
      const author = teacherNameMap.get(q.teacherId) ?? '';
      return (q.statement.toLowerCase().includes(query) || author.toLowerCase().includes(query));
    });
  }, [questions, searchTerm, teacherNameMap]);

  const rows = useMemo(() =>
      filteredQuestions.map((q) => ({
        id: q.id,
        statement: q.statement,
        type: q.type,
        author: teacherNameMap.get(q.teacherId) ?? q.teacherId,
        expectedAnswer: 'expectedAnswer' in q && q.expectedAnswer ? q.expectedAnswer : '—',
        createdAt: new Date(q.createdAt).toLocaleDateString(),
        actions: q.id,
      })),
    [filteredQuestions, teacherNameMap]
  );

  const questionMap = useMemo(() => {
    const map = new Map<string, AnyQuestion>();
    questions.forEach((q) => map.set(q.id, q));
    return map;
  }, [questions]);

  if (loading) {
    return (
      <DataTableSkeleton
        headers={headers}
        rowCount={5}
        columnCount={headers.length}
      />
    )
  }

  return (
    <DataTable rows={rows} headers={headers} isSortable>
      {({
        rows: tableRows,
        headers: tableHeaders,
        getHeaderProps,
        getRowProps,
        getTableProps,
        getTableContainerProps,
      }) => (
        <TableContainer
          title="Question Bank"
          description="Browse, create, and update multiple-choice and free-text questions."
          {...getTableContainerProps()}
        >
          <TableToolbar>
            <TableToolbarContent>
              <TableToolbarSearch
                persistent
                placeholder="Filter by statement or author..."
                value={searchTerm}
                onChange={(e) => {
                  if (typeof e === 'string') {
                    setSearchTerm(e);
                  } else {
                    setSearchTerm(e.target.value);
                  }
                }}
              />
              <Button kind="secondary" renderIcon={Add} onClick={onAddFt}>
                New Free-Text
              </Button>
              <Button kind="primary" renderIcon={Add} onClick={onAddMc}>
                New Multiple-Choice
              </Button>
            </TableToolbarContent>
          </TableToolbar>

          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {tableHeaders.map((header) => {
                  const { key, ...headerProps } = getHeaderProps({ header });
                  return (
                    <TableHeader key={key} {...headerProps}>
                      {header.header}
                    </TableHeader>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={tableHeaders.length}>
                    No questions found.
                  </TableCell>
                </TableRow>
              ) : (
                tableRows.map((row) => {
                  const { key, ...rowProps } = getRowProps({ row });
                  const rawQuestion = questionMap.get(row.id);

                  return (
                    <TableRow key={key} {...rowProps}>
                      {row.cells.map((cell) => {
                        if (cell.info.header === 'type') {
                          const isMc = cell.value === 'MULTIPLE_CHOICE';
                          return (
                            <TableCell key={cell.id}>
                              <Tag type={isMc ? 'purple' : 'cyan'}>
                                {isMc ? 'Multiple Choice' : 'Free Text'}
                              </Tag>
                            </TableCell>
                          );
                        }
                        if (cell.info.header === 'actions' && rawQuestion) {
                          return (
                            <TableCell key={cell.id}>
                              <Button
                                kind="ghost"
                                size="sm"
                                hasIconOnly
                                renderIcon={Edit}
                                iconDescription="Edit question"
                                onClick={() => onEdit(rawQuestion)}
                              />
                            </TableCell>
                          );
                        }
                        return <TableCell key={cell.id}>{cell.value}</TableCell>;
                      })}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
  )
}
