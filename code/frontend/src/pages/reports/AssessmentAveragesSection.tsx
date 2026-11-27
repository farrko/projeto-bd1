import { useState, useEffect, useCallback, useMemo } from 'react'
import { Tile, TextInput, NumberInput, Button, ContentSwitcher, Switch, InlineLoading, InlineNotification, StructuredListWrapper, StructuredListHead, StructuredListRow, StructuredListCell, StructuredListBody, Stack } from '@carbon/react'
import { Filter, Reset } from '@carbon/icons-react'
import { SimpleBarChart } from '@carbon/charts-react'
import { ScaleTypes, type BarChartOptions } from '@carbon/charts'
import { getAssessmentAverages, ApiError, type AssessmentAverageReport } from '../../api'

type MetricMode = 'PERCENT' | 'SCORE';

export const AssessmentAveragesSection = () => {
  const [data, setData] = useState<AssessmentAverageReport[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minGraded, setMinGraded] = useState<number>(1);
  const [metricMode, setMetricMode] = useState<MetricMode>('PERCENT');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async (filters?: { startDate?: string; endDate?: string; minGraded?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAssessmentAverages({
        startDate: filters?.startDate || undefined,
        endDate: filters?.endDate || undefined,
        minGraded: filters?.minGraded ?? 1,
      });
      setData(result);
    } catch (err) {
      setError(err instanceof ApiError ? `${err.code}: ${err.message}` : 'Failed to load assessment averages.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchReport({ startDate: '', endDate: '', minGraded: 1 });
  }, [fetchReport]);

  const handleApplyFilters = () => {
    void fetchReport({ startDate, endDate, minGraded });
  }

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setMinGraded(1);
    void fetchReport({ startDate: '', endDate: '', minGraded: 1 });
  }

  const chartData = useMemo(() =>
    data.map((row) => ({
      group: row.classGroup || 'Extra',
      key: `${row.title} (${row.assessmentDate})`,
      value: metricMode === 'PERCENT' ? Number(row.averagePercent) : Number(row.averageScore),
    })),
    [data, metricMode]
  );

  const chartOptions = useMemo<BarChartOptions>(() => ({
    title: metricMode === 'PERCENT' ? 'Average Score (%) by Assessment' : 'Average Score (Points) by Assessment',
    axes: {
      left: {
        mapsTo: 'value',
        title: metricMode === 'PERCENT' ? 'Average (%)' : 'Average (pts)',
        scaleType: ScaleTypes.LINEAR,
        ...(metricMode === 'PERCENT' ? { domain: [0, 100] } : {}),
      },
      bottom: {
        mapsTo: 'key',
        title: 'Assessment',
        scaleType: ScaleTypes.LABELS,
      },
    },
    height: '340px',
    toolbar: { enabled: false },
  }), [metricMode]);

  return (
    <Tile>
      <Stack gap={5}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h4>1a. Assessment Averages</h4>
            <p style={{ color: 'var(--cds-text-secondary)' }}>
              Graded performance averages ordered by assessment date.
            </p>
          </div>

          <div style={{ width: '16rem' }}>
            <ContentSwitcher
              size="sm"
              selectedIndex={metricMode === 'PERCENT' ? 0 : 1}
              onChange={(e) => setMetricMode(e.name === 'SCORE' ? 'SCORE' : 'PERCENT')}
            >
              <Switch name="PERCENT" text="Percentage (%)" />
              <Switch name="SCORE" text="Points" />
            </ContentSwitcher>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ width: '11rem' }}>
            <TextInput
              id="avg-start-date"
              type="date"
              labelText="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div style={{ width: '11rem' }}>
            <TextInput
              id="avg-end-date"
              type="date"
              labelText="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div style={{ width: '10rem' }}>
            <NumberInput
              id="avg-min-graded"
              label="Min Graded"
              min={0}
              step={1}
              value={minGraded}
              onChange={(_e, d) => {
                if (typeof d.value === 'number') setMinGraded(d.value);
              }}
            />
          </div>

          <Button size="md" renderIcon={Filter} onClick={handleApplyFilters} disabled={loading}>
            Apply
          </Button>
          <Button kind="ghost" size="md" renderIcon={Reset} onClick={handleResetFilters} disabled={loading}>
            Reset
          </Button>
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
          <InlineLoading description="Loading assessment averages..." />
        ) : data.length === 0 ? (
          <p>No graded assessments match the current filters.</p>
        ) : (
          <>
            <SimpleBarChart data={chartData} options={chartOptions} />

            <StructuredListWrapper isCondensed>
              <StructuredListHead>
                <StructuredListRow head>
                  <StructuredListCell head>Assessment</StructuredListCell>
                  <StructuredListCell head>Class Group</StructuredListCell>
                  <StructuredListCell head>Date</StructuredListCell>
                  <StructuredListCell head>Graded</StructuredListCell>
                  <StructuredListCell head>Avg / Max</StructuredListCell>
                  <StructuredListCell head>Avg %</StructuredListCell>
                  <StructuredListCell head>Min – Max</StructuredListCell>
                </StructuredListRow>
              </StructuredListHead>
              <StructuredListBody>
                {data.map((row) => (
                  <StructuredListRow key={row.assessmentId}>
                    <StructuredListCell>{row.title}</StructuredListCell>
                    <StructuredListCell>{row.classGroup || 'Extra'}</StructuredListCell>
                    <StructuredListCell>{row.assessmentDate}</StructuredListCell>
                    <StructuredListCell>{row.gradedCount}</StructuredListCell>
                    <StructuredListCell>{row.averageScore.toFixed(2)} / {row.maxScore.toFixed(2)}</StructuredListCell>
                    <StructuredListCell><strong>{row.averagePercent.toFixed(1)}%</strong></StructuredListCell>
                    <StructuredListCell>{row.lowestScore.toFixed(2)} – {row.highestScore.toFixed(2)}</StructuredListCell>
                  </StructuredListRow>
                ))}
              </StructuredListBody>
            </StructuredListWrapper>
          </>
        )}
      </Stack>
    </Tile>
  )
}