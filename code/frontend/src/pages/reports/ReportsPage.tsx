import { useState, useEffect, useCallback } from 'react'
import { InlineNotification, Stack } from '@carbon/react'
import '@carbon/charts-react/styles.css'
import { getAssessments, ApiError, type Assessment } from '../../api'
import { AssessmentAveragesSection } from './AssessmentAveragesSection'
import { ScoreDistributionSection } from './ScoreDistributionSection'
import { StudentVsClassSection } from './StudentVsClassSection'
import { MostMissedQuestionsSection } from './MostMissedQuestionsSection'

export const ReportsPage = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadAssessments = useCallback(async () => {
    try {
      const data = await getAssessments();
      setAssessments(data);
    } catch (err) {
      setError(err instanceof ApiError ? `${err.code}: ${err.message}` : 'Failed to load assessments for reports.');
    }
  }, []);

  useEffect(() => {
    void loadAssessments();
  }, [loadAssessments]);

  return (
    <Stack gap={6}>
      <div>
        <h2>Analytics & Reports</h2>
        <p style={{ color: 'var(--cds-text-secondary)' }}>
          Statistical performance metrics across assessments, class groups, students, and questions.
        </p>
      </div>

      {error && (
        <InlineNotification
          kind="error"
          title="Error"
          subtitle={error}
          onCloseButtonClick={() => setError(null)}
        />
      )}

      <AssessmentAveragesSection />
      <ScoreDistributionSection assessments={assessments} />
      <StudentVsClassSection />
      <MostMissedQuestionsSection />
    </Stack>
  )
}