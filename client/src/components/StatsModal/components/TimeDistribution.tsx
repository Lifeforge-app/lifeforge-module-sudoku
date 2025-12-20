import { DIFFICULTY_COLORS } from '@/constants/constants'
import { Widget } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

interface TimeDistributionData {
  under2min: number
  under5min: number
  under10min: number
  under20min: number
  over20min: number
}

interface DifficultyStat {
  difficulty: string
  totalBoards: number
  timeDistribution: TimeDistributionData
}

interface TimeDistributionProps {
  stats: DifficultyStat[]
}

function TimeDistribution({ stats }: TimeDistributionProps) {
  const { t } = useTranslation('apps.sudoku')

  const statsWithBoards = stats.filter(stat => stat.totalBoards > 0)

  return (
    <Widget
      className="component-bg-lighter"
      icon="tabler:chart-histogram"
      namespace="apps.sudoku"
      title={t('stats.timeDistribution')}
    >
      <div className="space-y-4">
        {statsWithBoards.map(stat => {
          const dist = stat.timeDistribution

          const total =
            dist.under2min +
            dist.under5min +
            dist.under10min +
            dist.under20min +
            dist.over20min

          return (
            <div key={stat.difficulty}>
              <div className="mb-2 flex items-center gap-2">
                <div
                  className="size-3 rounded-md"
                  style={{
                    backgroundColor: DIFFICULTY_COLORS[stat.difficulty]
                  }}
                />
                <span className="text-bg-800 dark:text-bg-100 font-medium capitalize">
                  {t(`difficulties.${stat.difficulty}`)}
                </span>
                <span className="text-bg-500 text-sm">
                  ({stat.totalBoards} {t('stats.completed').toLowerCase()})
                </span>
              </div>
              <div className="flex h-6 overflow-hidden rounded-full">
                {dist.under2min > 0 && (
                  <div
                    className="flex items-center justify-center bg-green-500 text-[10px] font-bold text-white"
                    style={{
                      width: `${(dist.under2min / total) * 100}%`
                    }}
                    title="<2min"
                  >
                    {dist.under2min > 1 && '<2m'}
                  </div>
                )}
                {dist.under5min > 0 && (
                  <div
                    className="flex items-center justify-center bg-teal-500 text-[10px] font-bold text-white"
                    style={{
                      width: `${(dist.under5min / total) * 100}%`
                    }}
                    title="2-5min"
                  >
                    {dist.under5min > 1 && '2-5m'}
                  </div>
                )}
                {dist.under10min > 0 && (
                  <div
                    className="flex items-center justify-center bg-yellow-500 text-[10px] font-bold text-white"
                    style={{
                      width: `${(dist.under10min / total) * 100}%`
                    }}
                    title="5-10min"
                  >
                    {dist.under10min > 1 && '5-10m'}
                  </div>
                )}
                {dist.under20min > 0 && (
                  <div
                    className="flex items-center justify-center bg-orange-500 text-[10px] font-bold text-white"
                    style={{
                      width: `${(dist.under20min / total) * 100}%`
                    }}
                    title="10-20min"
                  >
                    {dist.under20min > 1 && '10-20m'}
                  </div>
                )}
                {dist.over20min > 0 && (
                  <div
                    className="flex items-center justify-center bg-red-500 text-[10px] font-bold text-white"
                    style={{
                      width: `${(dist.over20min / total) * 100}%`
                    }}
                    title=">20min"
                  >
                    {dist.over20min > 1 && '>20m'}
                  </div>
                )}
              </div>
            </div>
          )
        })}
        {stats.length === 0 && (
          <div className="text-bg-500 py-4 text-center text-sm">
            {t('stats.noTimeData')}
          </div>
        )}
      </div>
      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-md bg-green-500" />
          <span className="text-bg-500">&lt;2min</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-md bg-teal-500" />
          <span className="text-bg-500">2-5min</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-md bg-yellow-500" />
          <span className="text-bg-500">5-10min</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-md bg-orange-500" />
          <span className="text-bg-500">10-20min</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-md bg-red-500" />
          <span className="text-bg-500">&gt;20min</span>
        </div>
      </div>
    </Widget>
  )
}

export default TimeDistribution
