import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableToolbar, TableToolbarContent, TableToolbarSearch, Button, Tag, DataTableSkeleton } from '@carbon/react'
import { Add, Edit, ArrowRight } from '@carbon/icons-react'
import type { Assessment } from '../../api'

interface AssessmentsTableProps {
  assessments: Assessment[];
  teacherNameMap: Map<string, string>;
  classNameMap: Map<string, string>;
  loading: boolean;
  onAdd: () => void;
  onEdit: (assessment: Assessment) => void;
}

const HEADERS = [
  { key: 'title', header: 'Title' },
  { key: 'scope', header: 'Class Group' },
  { key: 'teacher', header: 'Teacher' },
  { key: 'date', header: 'Date' },
  { key: 'window', header: 'Time Window' },
  { key: 'actions', header: 'Actions' },
];

export const AssessmentsTable = ({ assessments, teacherNameMap, classNameMap, loading, onAdd, onEdit }: AssessmentsTableProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAssessments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return assessments;

    return assessments.filter((a) => {
      const teacher = teacherNameMap.get(a.teacherId) ?? '';
      const className = a.classGroupId ? classNameMap.get(a.classGroupId) ?? '' : 'extra';
      return (a.title.toLowerCase().includes(query) || teacher.toLowerCase().includes(query) || className.toLowerCase().includes(query))
    })
  }, [assessments, searchTerm, teacherNameMap, classNameMap]);

  const rows = useMemo(() =>
    filteredAssessments.map((a) => ({
      id: a.id,
      title: a.title,
      scope: a.classGroupId,
      teacher: teacherNameMap.get(a.teacherId) ?? a.teacherId,
      date: a.assessmentDate,
      window: `${a.startTime} - ${a.endTime}`,
      actions: a.id,
    })
  ), [filteredAssessments, teacherNameMap]);

  const assessmentMap = useMemo(() => {
    const map = new Map<string, Assessment>();
    assessments.forEach((a) => map.set(a.id, a));
    return map;
  }, [assessments]);

  if (loading) {
    return (
      <DataTableSkeleton
        headers={HEADERS}
        rowCount={5}
        columnCount={HEADERS.length}
      />
    )
  }

  return (
    <DataTable rows={rows} headers={HEADERS} isSortable>
      {({
        rows: tableRows,
        headers: tableHeaders,
        getHeaderProps,
        getRowProps,
        getTableProps,
        getTableContainerProps,
      }) => (
        <TableContainer
          title="Assessments"
          description="Create evaluations, inspect question composition, and assign extra assessments."
          {...getTableContainerProps()}
        >
          <TableToolbar>
            <TableToolbarContent>
              <TableToolbarSearch
                persistent
                placeholder="Filter by title, class, or teacher..."
                value={searchTerm}
                onChange={(e) => {
                  if (typeof e === 'string') {
                    setSearchTerm(e);
                  } else {
                    setSearchTerm(e.target.value);
                  }
                }}
              />
              <Button renderIcon={Add} onClick={onAdd}>
                New Assessment
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
                    No assessments found.
                  </TableCell>
                </TableRow>
              ) : (
                tableRows.map((row) => {
                  const { key, ...rowProps } = getRowProps({ row });
                  const rawAssessment = assessmentMap.get(row.id);

                  return (
                    <TableRow key={key} {...rowProps}>
                      {row.cells.map((cell) => {
                        if (cell.info.header === 'scope') {
                          const classId = cell.value as string | null;
                          if (!classId) {
                            return (
                              <TableCell key={cell.id}>
                                <Tag type="magenta">Extra (Individual)</Tag>
                              </TableCell>
                            );
                          }
                          return (
                            <TableCell key={cell.id}>
                              <Tag type="blue">
                                {classNameMap.get(classId) ?? classId}
                              </Tag>
                            </TableCell>
                          );
                        }
                        if (cell.info.header === 'actions' && rawAssessment) {
                          return (
                            <TableCell key={cell.id}>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Button
                                  kind="ghost"
                                  size="sm"
                                  renderIcon={ArrowRight}
                                  onClick={() =>
                                    navigate(`/assessments/${rawAssessment.id}`)
                                  }
                                >
                                  Items & Assignments
                                </Button>
                                <Button
                                  kind="ghost"
                                  size="sm"
                                  hasIconOnly
                                  renderIcon={Edit}
                                  iconDescription="Edit assessment"
                                  onClick={() => onEdit(rawAssessment)}
                                />
                              </div>
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
