import { useState, useMemo } from 'react'
import { DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableToolbar, TableToolbarContent, TableToolbarSearch, Button, Tag, DataTableSkeleton } from '@carbon/react'
import { Add, Edit, UserMultiple } from '@carbon/icons-react'
import type { ClassGroup } from '../../api'

interface ClassGroupsTableProps {
  classGroups: ClassGroup[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (classGroup: ClassGroup) => void;
  onManageRoster: (classGroup: ClassGroup) => void;
}

const HEADERS = [
  { key: 'name', header: 'Name' },
  { key: 'year', header: 'Year' },
  { key: 'semester', header: 'Semester' },
  { key: 'actions', header: 'Actions' },
];

export const ClassGroupsTable = ({ classGroups, loading, onAdd, onEdit, onManageRoster }: ClassGroupsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return classGroups;

    return classGroups.filter(
      (cg) =>
        cg.name.toLowerCase().includes(query) ||
        String(cg.year).includes(query) ||
        `semester ${cg.semester}`.includes(query)
    );
  }, [classGroups, searchTerm]);

  const rows = useMemo(() =>
    filteredGroups.map((cg) => ({
      id: cg.id,
      name: cg.name,
      year: String(cg.year),
      semester: cg.semester,
      actions: cg.id,
    })), [filteredGroups]
  );

  const groupMap = useMemo(() => {
    const map = new Map<string, ClassGroup>();
    classGroups.forEach((cg) => map.set(cg.id, cg));
    return map;
  }, [classGroups]);

  if (loading) return <DataTableSkeleton headers={HEADERS} rowCount={5} columnCount={4} />

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
          title="Class Groups"
          description="Manage academic classes, student enrollments, and linked assessments."
          {...getTableContainerProps()}
        >
          <TableToolbar>
            <TableToolbarContent>
              <TableToolbarSearch
                persistent
                placeholder="Filter class groups..."
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
                Add Class Group
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
                    No class groups found.
                  </TableCell>
                </TableRow>
              ) : (
                tableRows.map((row) => {
                  const { key, ...rowProps } = getRowProps({ row });
                  const rawGroup = groupMap.get(row.id);

                  return (
                    <TableRow key={key} {...rowProps}>
                      {row.cells.map((cell) => {
                        if (cell.info.header === 'semester') {
                          return (
                            <TableCell key={cell.id}>
                              <Tag type={cell.value === 1 ? 'blue' : 'teal'}>
                                {cell.value === 1 ? '1st Semester' : '2nd Semester'}
                              </Tag>
                            </TableCell>
                          );
                        }
                        if (cell.info.header === 'actions' && rawGroup) {
                          return (
                            <TableCell key={cell.id}>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Button
                                  kind="ghost"
                                  size="sm"
                                  renderIcon={UserMultiple}
                                  onClick={() => onManageRoster(rawGroup)}
                                >
                                  Roster & Assessments
                                </Button>
                                <Button
                                  kind="ghost"
                                  size="sm"
                                  hasIconOnly
                                  renderIcon={Edit}
                                  iconDescription="Edit class group"
                                  onClick={() => onEdit(rawGroup)}
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