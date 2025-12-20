import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'

import { useTimer } from '../../providers'

function PauseOverlay() {
  const { t } = useTranslation('apps.sudoku')

  const { isPaused, togglePause } = useTimer()

  if (!isPaused) return null

  return (
    <div className="bg-bg-50/50 dark:bg-bg-900/50 absolute inset-0 z-20 flex flex-col items-center justify-center">
      <div className="bg-bg-50 dark:bg-bg-900 flex w-full flex-col items-center gap-6 rounded-2xl p-8 shadow-2xl backdrop-blur-sm sm:w-[30vw]">
        <div className="bg-custom-500/20 flex size-20 items-center justify-center rounded-full">
          <Icon
            className="text-custom-500 size-10"
            icon="tabler:player-pause"
          />
        </div>
        <h2 className="text-bg-800 dark:text-bg-100 text-2xl font-bold">
          {t('messages.gamePaused')}
        </h2>
        <button
          className="bg-custom-500 hover:bg-custom-600 flex items-center gap-2 rounded-lg px-6 py-3 text-white transition-colors"
          type="button"
          onClick={togglePause}
        >
          <Icon className="size-5" icon="tabler:player-play" />
          {t('buttons.resume')}
        </button>
      </div>
    </div>
  )
}

export default PauseOverlay
