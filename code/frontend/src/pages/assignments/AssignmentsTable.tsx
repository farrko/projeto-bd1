import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableToolbar, TableToolbarContent, TableToolbarSearch, Button, Tag, DataTableSkeleton } from '@carbon/react'
import { ArrowRight, Play, CheckmarkOutline } from '@carbon/icons-react'
import type { Assignment, AssignmentStatus } from '../../api'
import type { ViewMode } from '../../context/UserModeContext'

interface AssignmentsTableProps {
  assignments: Assignment[];
  assessmentTitleMap: Map<string, string>;
  studentNameMap: Map<string, string>;
  mode: ViewMode;
  loading: boolean;
}

const STATUS_TAG_TYPE: Record<AssignmentStatus, 'gray' | 'blue' | 'teal' | 'green'> = {
  ASSIGNED: 'gray',
  IN_PROGRESS: 'blue',
  SUBMITTED: 'teal',
  GRADED: 'green',
}

const HEADERS = [
  { key: 'assessment', header: 'Assessment' },
  { key: 'student', header: 'Student' },
  { key: 'status', header: 'Status' },
  { key: 'startedAt', header: 'Started At' },
  { key: 'submittedAt', header: 'Submitted At' },
  { key: 'actions', header: 'Actions' },
];

const formatDateTime = (iso: string | null): string => (iso ? new Date(iso).toLocaleString() : '—');

export const AssignmentsTable = ({ assignments, assessmentTitleMap, studentNameMap, mode, loading }: AssignmentsTableProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAssignments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return assignments;

    return assignments.filter((asg) => {
      const title = assessmentTitleMap.get(asg.assessmentId) ?? '';
      const student = studentNameMap.get(asg.studentId) ?? '';
      return title.toLowerCase().includes(query) || student.toLowerCase().includes(query) || asg.status.toLowerCase().includes(query);
    });
  }, [assignments, searchTerm, assessmentTitleMap, studentNameMap]);

  const rows = useMemo(() =>
    filteredAssignments.map((asg) => ({
      id: `${asg.assessmentId}::${asg.studentId}`,
      assessment: assessmentTitleMap.get(asg.assessmentId) ?? asg.assessmentId,
      student: studentNameMap.get(asg.studentId) ?? asg.studentId,
      status: asg.status,
      startedAt: formatDateTime(asg.startedAt),
      submittedAt: formatDateTime(asg.submittedAt),
      actions: `${asg.assessmentId}::${asg.studentId}`,
    })
  ), [filteredAssignments, assessmentTitleMap, studentNameMap]);

  const assignmentMap = useMemo(() => {
    const map = new Map<string, Assignment>();
    assignments.forEach((asg) => map.set(`${asg.assessmentId}::${asg.studentId}`, asg));
    return map;
  }, [assignments]);

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
          title="Assignments"
          description="Track assignment progress, take evaluations, and grade student submissions."
          {...getTableContainerProps()}
        >
          <TableToolbar>
            <TableToolbarContent>
              <TableToolbarSearch
                persistent
                placeholder="Filter by assessment, student, or status..."
                value={searchTerm}
                onChange={(e) => {
                  if (typeof e === 'string') {
                    setSearchTerm(e);
                  } else {
                    setSearchTerm(e.target.value);
                  }
                }}
              />
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
                    No assignments found.
                  </TableCell>
                </TableRow>
              ) : (
                tableRows.map((row) => {
                  const { key, ...rowProps } = getRowProps({ row });
                  const rawAsg = assignmentMap.get(row.id);

                  return (
                    <TableRow key={key} {...rowProps}>
                      {row.cells.map((cell) => {
                        if (cell.info.header === 'status') {
                          const status = cell.value as AssignmentStatus;
                          return (
                            <TableCell key={cell.id}>
                              <Tag type={STATUS_TAG_TYPE[status]}>{status}</Tag>
                            </TableCell>
                          );
                        }
                        if (cell.info.header === 'actions' && rawAsg) {
                          const actionLabel =
                            mode === 'STUDENT'
                              ? rawAsg.status === 'ASSIGNED'
                                ? 'Start Exam'
                                : rawAsg.status === 'IN_PROGRESS'
                                ? 'Continue Exam'
                                : 'View Results'
                              : mode === 'TEACHER' && rawAsg.status === 'SUBMITTED'
                              ? 'Grade Submission'
                              : 'Open';

                          const ActionIcon =
                            mode === 'STUDENT' && (rawAsg.status === 'ASSIGNED' || rawAsg.status === 'IN_PROGRESS')
                              ? Play
                              : mode === 'TEACHER' && rawAsg.status === 'SUBMITTED'
                              ? CheckmarkOutline
                              : ArrowRight;

                          return (
                            <TableCell key={cell.id}>
                              <Button
                                kind="ghost"
                                size="sm"
                                renderIcon={ActionIcon}
                                onClick={() => navigate(`/assignments/${rawAsg.assessmentId}/${rawAsg.studentId}`)}
                              >
                                {actionLabel}
                              </Button>
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
