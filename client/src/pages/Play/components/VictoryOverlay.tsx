import { Icon } from '@iconify/react'
import { Button, ConfirmationModal, useModalStore } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import { useSync } from '../providers'

function VictoryOverlay() {
  const { t } = useTranslation('apps.sudoku')

  const open = useModalStore(state => state.open)

  const { resetBoardMutation, handleRetry } = useSync()

  const handlePlayAgain = () => {
    open(ConfirmationModal, {
      title: t('modals.confirmPlayAgain.title'),
      description: t('modals.confirmPlayAgain.description'),
      confirmButton: 'confirm',
      onConfirm: async () => {
        handleRetry()
      }
    })
  }

  return (
    <div className="bg-bg-50/50 dark:bg-bg-900/50 absolute inset-0 flex items-center justify-center rounded-xl">
      <div className="bg-bg-50 dark:bg-bg-900 flex min-w-[30vw] flex-col items-center gap-6 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        <div className="bg-custom-500/20 flex size-20 items-center justify-center rounded-full">
          <Icon className="text-custom-500 size-10" icon="tabler:trophy" />
        </div>
        <div className="text-center">
          <h2 className="text-bg-800 dark:text-bg-100 text-2xl font-bold">
            {t('messages.congratulations')}
          </h2>
          <p className="text-bg-500 mt-2">{t('messages.puzzleSolved')}</p>
        </div>
        <Button
          icon="tabler:refresh"
          loading={resetBoardMutation.isPending}
          variant="primary"
          onClick={handlePlayAgain}
        >
          {t('buttons.retry')}
        </Button>
      </div>
    </div>
  )
}

export default VictoryOverlay
