import { useState, useEffect, useMemo } from 'react'
import { Tile, Dropdown, Tag, InlineLoading, InlineNotification, StructuredListWrapper, StructuredListHead, StructuredListRow, StructuredListCell, StructuredListBody, Stack } from '@carbon/react'
import { GroupedBarChart } from '@carbon/charts-react'
import { ScaleTypes, type BarChartOptions } from '@carbon/charts'
import { getStudentVsClassAverage, ApiError, type StudentVsClassAverageReport, type UUID } from '../../api'
import { useUserMode } from '../../context/UserModeContext'

interface StudentDropdownItem {
  id: UUID;
  label: string;
}

export const StudentVsClassSection = () => {
  const { mode, students, selectedStudent } = useUserMode();
  const [targetStudentId, setTargetStudentId] = useState<UUID>('');
  const [rows, setRows] = useState<StudentVsClassAverageReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'STUDENT' && selectedStudent) {
      setTargetStudentId(selectedStudent.id);
    } else if (!targetStudentId && students.length > 0) {
      setTargetStudentId(students[0].id);
    }
  }, [mode, selectedStudent, students, targetStudentId]);

  useEffect(() => {
    if (!targetStudentId) return;

    let cancelled = false;
    const loadComparison = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getStudentVsClassAverage(targetStudentId);
        if (!cancelled) setRows(result);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? `${err.code}: ${err.message}` : 'Failed to load student comparison.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadComparison();
    return () => {
      cancelled = true;
    }
  }, [targetStudentId]);

  const studentItems = useMemo<StudentDropdownItem[]>(() =>
    students.map((s) => ({
      id: s.id,
      label: `${s.name} (${s.enrollmentNumber})`,
    })),
    [students]
  );

  const activeStudentItem = useMemo(
    () => studentItems.find((item) => item.id === targetStudentId) ?? null,
    [studentItems, targetStudentId]
  );

  const chartData = useMemo(() =>
    rows.flatMap((row) => {
      const label = `${row.title} (${row.assessmentDate})`;
      return [
        { group: 'Student Score', key: label, value: Number(row.studentScore) },
        { group: 'Class Average', key: label, value: Number(row.classAverage) },
      ];
    }),
    [rows]
  );

  const chartOptions = useMemo<BarChartOptions>(() => ({
    title: 'Student Score vs. Class Average',
    axes: {
      left: {
        mapsTo: 'value',
        title: 'Score (pts)',
        scaleType: ScaleTypes.LINEAR,
      },
      bottom: {
        mapsTo: 'key',
        title: 'Assessment',
        scaleType: ScaleTypes.LABELS,
      },
    },
    height: '340px',
    toolbar: { enabled: false },
  }), []);

  return (
    <Tile>
      <Stack gap={5}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h4>2. Student vs. Class Average</h4>
            <p style={{ color: 'var(--cds-text-secondary)' }}>
              Side-by-side comparison of an individual student&apos;s scores against class averages.
            </p>
          </div>

          <div style={{ width: '22rem' }}>
            <Dropdown
              id="report-student-comparison"
              titleText="Student"
              label="Select student"
              items={studentItems}
              selectedItem={activeStudentItem}
              itemToString={(item) => (item ? item.label : '')}
              onChange={(data) => setTargetStudentId(data.selectedItem?.id ?? '')}
              disabled={mode === 'STUDENT' || studentItems.length === 0}
            />
          </div>
        </div>

        {error && (
          <InlineNotification
            kind="error"
            title="Report Error"
            subtitle={error}
            onCloseButtonClick={() => setError(null)}
          />
        )}

        {loading ? (
          <InlineLoading description="Loading student comparison..." />
        ) : !targetStudentId ? (
          <p>No students available.</p>
        ) : rows.length === 0 ? (
          <p>No graded assessments found for this student.</p>
        ) : (
          <>
            <GroupedBarChart data={chartData} options={chartOptions} />

            <StructuredListWrapper isCondensed>
              <StructuredListHead>
                <StructuredListRow head>
                  <StructuredListCell head>Date</StructuredListCell>
                  <StructuredListCell head>Assessment</StructuredListCell>
                  <StructuredListCell head>Student Score</StructuredListCell>
                  <StructuredListCell head>Class Average</StructuredListCell>
                  <StructuredListCell head>Difference</StructuredListCell>
                </StructuredListRow>
              </StructuredListHead>
              <StructuredListBody>
                {rows.map((row, idx) => {
                  const diff = Number(row.difference);
                  const sign = diff > 0 ? '+' : '';
                  return (
                    <StructuredListRow key={`${row.assessmentDate}-${row.title}-${idx}`}>
                      <StructuredListCell>{row.assessmentDate}</StructuredListCell>
                      <StructuredListCell>{row.title}</StructuredListCell>
                      <StructuredListCell><strong>{row.studentScore.toFixed(2)}</strong></StructuredListCell>
                      <StructuredListCell>{row.classAverage.toFixed(2)}</StructuredListCell>
                      <StructuredListCell>
                        <Tag type={diff > 0 ? 'green' : diff < 0 ? 'red' : 'gray'}>
                          {sign}{diff.toFixed(2)}
                        </Tag>
                      </StructuredListCell>
                    </StructuredListRow>
                  );
                })}
              </StructuredListBody>
            </StructuredListWrapper>
          </>
        )}
      </Stack>
    </Tile>
  )
}