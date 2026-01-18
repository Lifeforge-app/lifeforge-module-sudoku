import { useQuery } from '@tanstack/react-query'
import { ModalHeader, WithQuery } from 'lifeforge-ui'

import forgeAPI from '@/utils/forgeAPI'

import ActivityCalendar from './components/ActivityCalendar'
import BestTimes from './components/BestTimes'
import DetailedStats from './components/DetailedStats'
import OverviewCards from './components/OverviewCards'
import TimeDistribution from './components/TimeDistribution'

function StatsModal({ onClose }: { onClose: () => void }) {
  const statsQuery = useQuery(forgeAPI.sessions.stats.queryOptions())

  return (
    <div className="min-w-[70vw]">
      <ModalHeader
        icon="tabler:chart-bar"
        namespace="apps.sudoku"
        title="stats.title"
        onClose={onClose}
      />
      <WithQuery query={statsQuery}>
        {data => (
          <div className="space-y-6">
            <OverviewCards
              currentStreak={data.streak.current}
              daysPlayed={data.overall.daysPlayed}
              longestStreak={data.streak.longest}
              totalBoards={data.overall.totalBoards}
              totalPlayTime={data.overall.totalPlayTime}
            />
            <ActivityCalendar />
            <BestTimes stats={data.byDifficulty} />
            <TimeDistribution stats={data.byDifficulty} />
            <DetailedStats stats={data.byDifficulty} />
          </div>
        )}
      </WithQuery>
    </div>
  )
}

export default StatsModal
