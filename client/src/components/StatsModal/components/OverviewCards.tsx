import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'

// Helper to parse play time into hours/minutes/seconds
function parsePlayTime(seconds: number): {
  hours: number
  minutes: number
  seconds: number
} {
  const hours = Math.floor(seconds / 3600)

  const minutes = Math.floor((seconds % 3600) / 60)

  const secs = seconds % 60

  return { hours, minutes, seconds: secs }
}

interface OverviewCardsProps {
  totalBoards: number
  currentStreak: number
  longestStreak: number
  totalPlayTime: number
  daysPlayed: number
}

function OverviewCards({
  totalBoards,
  currentStreak,
  longestStreak,
  totalPlayTime,
  daysPlayed
}: OverviewCardsProps) {
  const { t } = useTranslation('apps.sudoku')

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {/* Total Boards */}
      <div className="component-bg-lighter shadow-custom flex flex-col gap-2 rounded-lg p-3 pb-6 sm:p-6">
        <div className="flex w-full flex-row items-center gap-2 sm:flex-col sm:items-start">
          <div className="bg-bg-50 dark:bg-bg-700/50 shadow-custom flex rounded-lg p-2 sm:p-4">
            <Icon
              className="text-2xl text-blue-500 sm:text-3xl"
              icon="tabler:layout-grid"
            />
          </div>
          <div className="text-bg-500 text-lg whitespace-nowrap">
            {t('stats.totalBoards')}
          </div>
        </div>
        <div className="mt-2 text-4xl font-semibold whitespace-nowrap">
          {totalBoards}
        </div>
      </div>

      {/* Streak Counter */}
      <div className="component-bg-lighter shadow-custom flex flex-col gap-2 rounded-lg p-3 pb-6 sm:p-6">
        <div className="flex w-full flex-row items-center gap-2 sm:flex-col sm:items-start">
          <div className="bg-bg-50 dark:bg-bg-700/50 shadow-custom flex rounded-lg p-2 sm:p-4">
            <Icon
              className="text-2xl text-orange-500 sm:text-3xl"
              icon="tabler:flame"
            />
          </div>
          <div className="text-bg-500 text-lg whitespace-nowrap">
            {t('stats.streak')}
          </div>
        </div>
        <div className="mt-2 text-4xl font-semibold whitespace-nowrap">
          {currentStreak}
          <span className="text-bg-500 pl-1 text-xl font-normal">
            {t('stats.days')}
          </span>
        </div>
        <div className="text-bg-500">
          {t('stats.bestStreak')}: {longestStreak} {t('stats.days')}
        </div>
      </div>

      {/* Total Play Time */}
      <div className="component-bg-lighter shadow-custom flex flex-col gap-2 rounded-lg p-3 pb-6 sm:p-6">
        <div className="flex w-full flex-row items-center gap-2 sm:flex-col sm:items-start">
          <div className="bg-bg-50 dark:bg-bg-700/50 shadow-custom flex rounded-lg p-2 sm:p-4">
            <Icon
              className="text-2xl text-purple-500 sm:text-3xl"
              icon="tabler:clock-play"
            />
          </div>
          <div className="text-bg-500 text-lg whitespace-nowrap">
            {t('stats.totalTime')}
          </div>
        </div>
        <div className="mt-2 text-4xl font-semibold whitespace-nowrap">
          {(() => {
            const time = parsePlayTime(totalPlayTime)

            if (time.hours > 0) {
              return (
                <>
                  {time.hours}
                  <span className="text-bg-500 pl-1 text-xl font-normal">
                    {t('stats.hours')}
                  </span>{' '}
                  {time.minutes}
                  <span className="text-bg-500 pl-1 text-xl font-normal">
                    {t('stats.minutes')}
                  </span>
                </>
              )
            } else if (time.minutes > 0) {
              return (
                <>
                  {time.minutes}
                  <span className="text-bg-500 pl-1 text-xl font-normal">
                    {t('stats.minutes')}
                  </span>
                </>
              )
            } else {
              return (
                <>
                  {time.seconds}
                  <span className="text-bg-500 pl-1 text-xl font-normal">
                    {t('stats.seconds')}
                  </span>
                </>
              )
            }
          })()}
        </div>
        <div className="text-bg-500">
          {daysPlayed} {t('stats.daysPlayed')}
        </div>
      </div>
    </div>
  )
}

export default OverviewCards
