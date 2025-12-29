import { formatTime } from '@/utils/time'
import clsx from 'clsx'

import { useBoardState, useSession, useTimer } from '../../providers'

interface BoardSelectorProps {
  onBoardSwitch: (index: number) => void
}

function BoardSelector({ onBoardSwitch }: BoardSelectorProps) {
  const { boards, currentBoardIndex } = useSession()

  const { allUserInputs } = useBoardState()

  const { allDurationsElapsed } = useTimer()

  if (boards.length <= 1) return null

  // Calculate completion status for each board
  const boardStatuses = boards.map((board, index) => {
    const userInputs = allUserInputs[index] ?? []

    const duration = allDurationsElapsed[index] ?? 0

    let filled = 0
    let total = 0

    // mission is a string of 81 characters, '0' means empty cell
    if (board?.mission) {
      for (let i = 0; i < board.mission.length; i++) {
        if (board.mission[i] === '0') {
          total++

          const userInput = userInputs[i]

          if (userInput && userInput !== '') {
            filled++
          }
        }
      }
    }

    const progress = total > 0 ? Math.round((filled / total) * 100) : 0

    const isCompleted = progress === 100

    return { progress, filled, total, isCompleted, duration }
  })

  return (
    <div className="mt-4 flex flex-col items-center gap-3 px-4">
      <div className="flex max-w-full flex-wrap items-center justify-center gap-2">
        {boards.map((_, index) => {
          const status = boardStatuses[index]

          const isActive = index === currentBoardIndex

          const isCompleted = status.isCompleted

          return (
            <button
              key={index}
              className={clsx(
                'group relative flex w-24 flex-col items-center gap-1 rounded-lg px-3 py-2 transition-all sm:w-28 sm:px-4 md:w-32',
                isActive
                  ? 'bg-custom-500/20 ring-custom-500 ring-2'
                  : 'bg-bg-200/50 dark:bg-bg-700/30 hover:bg-bg-200 dark:hover:bg-bg-700/50'
              )}
              type="button"
              onClick={() => onBoardSwitch(index)}
            >
              <div className="flex items-center gap-2">
                <span
                  className={clsx(
                    'text-xs font-medium sm:text-sm',
                    isActive
                      ? 'text-custom-500'
                      : 'text-bg-600 dark:text-bg-300'
                  )}
                >
                  Board {index + 1}
                </span>
              </div>

              {/* Progress bar */}
              <div className="bg-bg-300 dark:bg-bg-600 h-1 w-full overflow-hidden rounded-full">
                <div
                  className={clsx(
                    'h-full rounded-full transition-all',
                    isCompleted ? 'bg-green-500' : 'bg-custom-500'
                  )}
                  style={{ width: `${status.progress}%` }}
                />
              </div>

              {/* Time indicator */}
              <span className="text-bg-500 text-[10px] sm:text-xs">
                {formatTime(status.duration)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BoardSelector
