import { DIFFICULTY_COLORS } from '@/constants/constants'
import { formatTime } from '@/utils/time'
import { Widget } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

interface DifficultyStat {
  difficulty: string
  bestTime: number | null
}

interface BestTimesProps {
  stats: DifficultyStat[]
}

function BestTimes({ stats }: BestTimesProps) {
  const { t } = useTranslation('apps.sudoku')

  const statsWithBestTime = stats.filter(stat => stat.bestTime !== null)

  return (
    <Widget
      className="component-bg-lighter"
      icon="tabler:trophy"
      namespace="apps.sudoku"
      title={t('stats.bestTimes')}
    >
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {statsWithBestTime.map(stat => (
          <div
            key={stat.difficulty}
            className="bg-bg-200/50 dark:bg-bg-700/50 flex items-center justify-between rounded-lg p-3"
          >
            <div className="flex items-center gap-2">
              <div
                className="size-3 rounded-full"
                style={{
                  backgroundColor: DIFFICULTY_COLORS[stat.difficulty]
                }}
              />
              <span className="text-bg-800 dark:text-bg-100 font-medium capitalize">
                {t(`difficulties.${stat.difficulty}`)}
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono text-lg font-semibold">
              {formatTime(stat.bestTime!)}
            </div>
          </div>
        ))}
        {statsWithBestTime.length === 0 && (
          <div className="text-bg-500 col-span-full py-4 text-center text-sm">
            {t('stats.noBestTimes')}
          </div>
        )}
      </div>
    </Widget>
  )
}

export default BestTimes
