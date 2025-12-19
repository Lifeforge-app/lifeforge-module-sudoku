import { Icon } from '@iconify/react'

import { formatTime } from '../../../utils/time'
import { useTimer } from '../providers'

function TimerDisplay() {
  const { elapsedTime } = useTimer()

  return (
    <div className="flex-center mt-4 gap-2">
      <Icon className="text-bg-500 size-5" icon="tabler:clock" />
      <span className="text-bg-500 font-mono text-lg">
        {formatTime(elapsedTime)}
      </span>
    </div>
  )
}

export default TimerDisplay
