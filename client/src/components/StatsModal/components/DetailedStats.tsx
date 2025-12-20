import { DIFFICULTY_COLORS } from '@/constants/constants'
import { formatTime } from '@/utils/time'
import { Widget } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

interface DifficultyStat {
  difficulty: string
  totalBoards: number
  avgTime: number | null
  bestTime: number | null
}

interface DetailedStatsProps {
  stats: DifficultyStat[]
}

function DetailedStats({ stats }: DetailedStatsProps) {
  const { t } = useTranslation('apps.sudoku')

  return (
    <Widget
      className="component-bg-lighter"
      icon="tabler:list-details"
      namespace="apps.sudoku"
      title={t('stats.byDifficulty')}
    >
      {/* Mobile: Cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {stats.map(stat => (
          <div
            key={stat.difficulty}
            className="bg-bg-200/50 dark:bg-bg-700/50 rounded-lg p-3"
          >
            <div className="mb-2 flex items-center gap-2">
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
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-bg-500">{t('stats.played')}</span>
                <span className="text-bg-800 dark:text-bg-100 font-semibold">
                  {stat.totalBoards}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-bg-500">{t('stats.avgTime')}</span>
                <span className="text-bg-600 dark:text-bg-400 font-mono">
                  {stat.avgTime ? formatTime(stat.avgTime) : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-bg-500">{t('stats.bestTime')}</span>
                <span className="font-mono text-yellow-500">
                  {stat.bestTime ? formatTime(stat.bestTime) : '-'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="text-bg-500 border-bg-200 dark:border-bg-700 border-b-2! text-left">
              <th className="px-2 py-4 font-medium">{t('stats.difficulty')}</th>
              <th className="py-4 text-center font-medium">
                {t('stats.played')}
              </th>
              <th className="pb-2 text-center font-medium">
                {t('stats.avgTime')}
              </th>
              <th className="pb-2 text-center font-medium">
                {t('stats.bestTime')}
              </th>
            </tr>
          </thead>
          <tbody>
            {stats.map(stat => (
              <tr
                key={stat.difficulty}
                className="border-bg-200 dark:border-bg-700/50 border-b last:border-0"
              >
                <td className="px-2 py-4">
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
                </td>
                <td className="text-bg-800 dark:text-bg-100 py-4 text-center font-semibold">
                  {stat.totalBoards}
                </td>
                <td className="text-bg-600 dark:text-bg-400 py-4 text-center font-mono">
                  {stat.avgTime ? formatTime(stat.avgTime) : '-'}
                </td>
                <td className="py-4 text-center font-mono text-yellow-500">
                  {stat.bestTime ? formatTime(stat.bestTime) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Widget>
  )
}

export default DetailedStats
