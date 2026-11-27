import { useState, useEffect, useCallback, useMemo } from 'react'
import { Tile, TextInput, NumberInput, Button, Tag, InlineLoading, InlineNotification, StructuredListWrapper, StructuredListHead, StructuredListRow, StructuredListCell, StructuredListBody, Stack } from '@carbon/react'
import { Filter, Reset } from '@carbon/icons-react'
import { SimpleBarChart } from '@carbon/charts-react'
import { ScaleTypes, type BarChartOptions } from '@carbon/charts'
import { getMostMissedQuestions, ApiError, type MostMissedQuestionReport } from '../../api'

const truncateLabel = (text: string, maxLen = 48): string =>
  text.length > maxLen ? `${text.slice(0, maxLen - 1)}…` : text;

export const MostMissedQuestionsSection = () => {
  const [questions, setQuestions] = useState<MostMissedQuestionReport[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAnswers, setMinAnswers] = useState<number>(1);
  const [top, setTop] = useState<number>(10);
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async (filters?: {
    startDate?: string;
    endDate?: string;
    minAnswers?: number;
    top?: number;
    search?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMostMissedQuestions({
        startDate: filters?.startDate || undefined,
        endDate: filters?.endDate || undefined,
        minAnswers: filters?.minAnswers ?? 1,
        top: filters?.top ?? 10,
        search: filters?.search?.trim() || undefined,
      });
      setQuestions([...result].sort((a, b) => a.errorRank - b.errorRank));
    } catch (err) {
      setError(err instanceof ApiError ? `${err.code}: ${err.message}` : 'Failed to load most missed questions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchReport({ startDate: '', endDate: '', minAnswers: 1, top: 10, search: '' });
  }, [fetchReport]);

  const handleApply = () => {
    void fetchReport({ startDate, endDate, minAnswers, top, search });
  }

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setMinAnswers(1);
    setTop(10);
    setSearch('');
    void fetchReport({ startDate: '', endDate: '', minAnswers: 1, top: 10, search: '' });
  }

  const chartData = useMemo(() =>
    questions.map((q) => ({
      group: 'Error Rate',
      key: `#${q.errorRank} ${truncateLabel(q.statement)}`,
      value: Number(q.errorPercent),
    })),
    [questions]
  );

  const chartHeight = useMemo(() => `${Math.max(260, questions.length * 42 + 90)}px`, [questions.length]);

  const chartOptions = useMemo<BarChartOptions>(() => ({
    title: 'Most Missed Questions Ranking (Error %)',
    axes: {
      left: {
        mapsTo: 'key',
        title: 'Ranked Question',
        scaleType: ScaleTypes.LABELS,
      },
      bottom: {
        mapsTo: 'value',
        title: 'Error Rate (%)',
        scaleType: ScaleTypes.LINEAR,
        domain: [0, 100],
      },
    },
    height: chartHeight,
    legend: { enabled: false },
    toolbar: { enabled: false },
  }), [chartHeight]);

  return (
    <Tile>
      <Stack gap={5}>
        <div>
          <h4>3. Most Missed Multiple-Choice Questions</h4>
          <p style={{ color: 'var(--cds-text-secondary)' }}>
            Questions ranked by highest error percentage across submitted answers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ width: '14rem' }}>
            <TextInput
              id="missed-search"
              labelText="Keyword Search"
              placeholder="Filter statement..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ width: '10.5rem' }}>
            <TextInput
              id="missed-start-date"
              type="date"
              labelText="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div style={{ width: '10.5rem' }}>
            <TextInput
              id="missed-end-date"
              type="date"
              labelText="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div style={{ width: '9rem' }}>
            <NumberInput
              id="missed-min-answers"
              label="Min Answers"
              min={1}
              step={1}
              value={minAnswers}
              onChange={(_e, d) => {
                if (typeof d.value === 'number') setMinAnswers(d.value);
              }}
            />
          </div>

          <div style={{ width: '8rem' }}>
            <NumberInput
              id="missed-top"
              label="Top N"
              min={1}
              step={1}
              value={top}
              onChange={(_e, d) => {
                if (typeof d.value === 'number') setTop(d.value);
              }}
            />
          </div>

          <Button size="md" renderIcon={Filter} onClick={handleApply} disabled={loading}>
            Apply
          </Button>
          <Button kind="ghost" size="md" renderIcon={Reset} onClick={handleReset} disabled={loading}>
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
          <InlineLoading description="Loading most missed questions..." />
        ) : questions.length === 0 ? (
          <p>No question error statistics match the current filters.</p>
        ) : (
          <>
            <SimpleBarChart data={chartData} options={chartOptions} />

            <StructuredListWrapper isCondensed>
              <StructuredListHead>
                <StructuredListRow head>
                  <StructuredListCell head>Rank</StructuredListCell>
                  <StructuredListCell head>Question Statement</StructuredListCell>
                  <StructuredListCell head>Wrong / Total</StructuredListCell>
                  <StructuredListCell head>Error Rate</StructuredListCell>
                </StructuredListRow>
              </StructuredListHead>
              <StructuredListBody>
                {questions.map((q) => (
                  <StructuredListRow key={q.questionId}>
                    <StructuredListCell><strong>#{q.errorRank}</strong></StructuredListCell>
                    <StructuredListCell>{q.statement}</StructuredListCell>
                    <StructuredListCell>{q.wrongCount} / {q.answerCount}</StructuredListCell>
                    <StructuredListCell>
                      <Tag type={q.errorPercent >= 70 ? 'red' : q.errorPercent >= 40 ? 'warm-gray' : 'blue'}>
                        {q.errorPercent.toFixed(1)}%
                      </Tag>
                    </StructuredListCell>
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