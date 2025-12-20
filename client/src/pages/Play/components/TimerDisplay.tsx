import { Icon } from '@iconify/react'

import { formatTime } from '../../../utils/time'
import { useBoardState, useTimer } from '../providers'

function TimerDisplay() {
  const { elapsedTime, isPaused, togglePause } = useTimer()

  const { isBoardCompleted } = useBoardState()

  return (
    <div className="flex-center mt-4 gap-3">
      {!isBoardCompleted && (
        <button
          className="text-bg-500 hover:text-custom-500 transition-colors"
          type="button"
          onClick={togglePause}
        >
          <Icon
            className="size-5"
            icon={
              isPaused
                ? 'tabler:player-play-filled'
                : 'tabler:player-pause-filled'
            }
          />
        </button>
      )}
      <div className="flex-center gap-2">
        <Icon className="text-bg-500 size-5" icon="tabler:clock" />
        <span className="text-bg-500 font-mono text-lg">
          {formatTime(elapsedTime)}
        </span>
      </div>
    </div>
  )
}

export default TimerDisplay
