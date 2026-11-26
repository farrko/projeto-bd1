import { useState, useMemo } from 'react'
import { DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableToolbar, TableToolbarContent, TableToolbarSearch, Button, DataTableSkeleton } from '@carbon/react'
import { Add, Edit, View } from '@carbon/icons-react'
import type { Teacher, Student, Role } from '../../api'

type UserRecord = Teacher | Student;

interface UsersTableProps {
  role: Role;
  users: UserRecord[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (user: UserRecord) => void;
  onInspect: (user: UserRecord) => void;
}

export const UsersTable = ({ role, users, loading, onAdd, onEdit, onInspect }: UsersTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const isTeacher = role === 'TEACHER';
  const codeLabel = isTeacher ? 'Staff Number' : 'Enrollment Number';

  const headers = useMemo(() =>
    [
      { key: 'name', header: 'Name' },
      { key: 'email', header: 'Email' },
      { key: 'registrationCode', header: codeLabel },
      { key: 'actions', header: 'Actions' },
    ], [codeLabel]);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return users;

    return users.filter((u) => {
      const code = u.role === 'TEACHER' ? u.staffNumber : u.enrollmentNumber;

      return (u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query) || code.toLowerCase().includes(query));
    });
  }, [users, searchTerm]);

  const rows = useMemo(() =>
      filteredUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        registrationCode: u.role === 'TEACHER' ? u.staffNumber : u.enrollmentNumber,
        actions: u.id,
      })), [filteredUsers]
  );

  const userMap = useMemo(() => {
    const map = new Map<string, UserRecord>();
    users.forEach((u) => map.set(u.id, u));
    return map;
  }, [users]);

  if (loading) return <DataTableSkeleton headers={headers} rowCount={5} columnCount={4} />

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
          title={isTeacher ? 'Teachers' : 'Students'}
          description={
            isTeacher
              ? 'Manage faculty accounts and inspect authored assessments.'
              : 'Manage student accounts and inspect assigned evaluations.'
          }
          {...getTableContainerProps()}
        >
          <TableToolbar>
            <TableToolbarContent>
              <TableToolbarSearch
                persistent
                placeholder={`Filter ${isTeacher ? 'teachers' : 'students'}...`}
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
                Add {isTeacher ? 'Teacher' : 'Student'}
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
                    No {isTeacher ? 'teachers' : 'students'} found.
                  </TableCell>
                </TableRow>
              ) : (
                tableRows.map((row) => {
                  const { key, ...rowProps } = getRowProps({ row });
                  const rawUser = userMap.get(row.id);

                  return (
                    <TableRow key={key} {...rowProps}>
                      {row.cells.map((cell) => {
                        if (cell.info.header === 'actions' && rawUser) {
                          return (
                            <TableCell key={cell.id}>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Button
                                  kind="ghost"
                                  size="sm"
                                  hasIconOnly
                                  renderIcon={View}
                                  iconDescription="Inspect activity"
                                  onClick={() => onInspect(rawUser)}
                                />
                                <Button
                                  kind="ghost"
                                  size="sm"
                                  hasIconOnly
                                  renderIcon={Edit}
                                  iconDescription="Edit user"
                                  onClick={() => onEdit(rawUser)}
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