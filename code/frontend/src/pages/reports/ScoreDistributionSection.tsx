import { useState, useEffect, useMemo } from 'react'
import { Tile, Dropdown, InlineLoading, InlineNotification, Stack } from '@carbon/react'
import { SimpleBarChart } from '@carbon/charts-react'
import { ScaleTypes, type BarChartOptions } from '@carbon/charts'
import { getScoreDistribution, ApiError, type Assessment, type ScoreDistributionBand, type UUID } from '../../api'

interface AssessmentDropdownItem {
  id: UUID;
  label: string;
}

interface ScoreDistributionSectionProps {
  assessments: Assessment[];
}

export const ScoreDistributionSection = ({ assessments }: ScoreDistributionSectionProps) => {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<UUID>('');
  const [bands, setBands] = useState<ScoreDistributionBand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedAssessmentId && assessments.length > 0) {
      setSelectedAssessmentId(assessments[0].id);
    }
  }, [assessments, selectedAssessmentId]);

  useEffect(() => {
    if (!selectedAssessmentId) return;

    let cancelled = false;
    const loadDistribution = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getScoreDistribution(selectedAssessmentId);
        if (!cancelled) setBands(result);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? `${err.code}: ${err.message}` : 'Failed to load score distribution.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadDistribution();
    return () => {
      cancelled = true;
    }
  }, [selectedAssessmentId]);

  const dropdownItems = useMemo<AssessmentDropdownItem[]>(() =>
    assessments.map((a) => ({
      id: a.id,
      label: `${a.title} (${a.assessmentDate})`,
    })),
    [assessments]
  );

  const selectedItem = useMemo(
    () => dropdownItems.find((item) => item.id === selectedAssessmentId) ?? null,
    [dropdownItems, selectedAssessmentId]
  );

  const chartData = useMemo(() =>
    bands.map((band) => ({
      group: 'Students',
      key: band.scoreRange,
      value: band.studentCount,
    })),
    [bands]
  );

  const chartOptions = useMemo<BarChartOptions>(() => ({
    title: 'Student Count by Score Percentage Band',
    axes: {
      left: {
        mapsTo: 'value',
        title: 'Students',
        scaleType: ScaleTypes.LINEAR,
      },
      bottom: {
        mapsTo: 'key',
        title: 'Score Range',
        scaleType: ScaleTypes.LABELS,
      },
    },
    height: '320px',
    legend: { enabled: false },
    toolbar: { enabled: false },
  }), []);

  return (
    <Tile>
      <Stack gap={5}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h4>1b. Score Distribution by Percentage Bands</h4>
            <p style={{ color: 'var(--cds-text-secondary)' }}>
              Breakdown of student scores across four percentage intervals for a selected assessment.
            </p>
          </div>

          <div style={{ width: '22rem' }}>
            <Dropdown
              id="report-distribution-assessment"
              titleText="Assessment"
              label="Select assessment"
              items={dropdownItems}
              selectedItem={selectedItem}
              itemToString={(item) => (item ? item.label : '')}
              onChange={(data) => setSelectedAssessmentId(data.selectedItem?.id ?? '')}
              disabled={dropdownItems.length === 0}
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
          <InlineLoading description="Loading score distribution..." />
        ) : !selectedAssessmentId ? (
          <p>No assessments available.</p>
        ) : bands.length === 0 ? (
          <p>No distribution data available for this assessment.</p>
        ) : (
          <SimpleBarChart data={chartData} options={chartOptions} />
        )}
      </Stack>
    </Tile>
  )
}
