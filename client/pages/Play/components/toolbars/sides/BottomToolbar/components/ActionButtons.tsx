/* eslint-disable react-compiler/react-compiler */
import { useBoardState, useSync, useTimer } from '@/pages/Play/providers'
import { Button, ConfirmationModal, useModalStore } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

function ActionButtons() {
  const { t } = useTranslation('apps.sudoku')

  const open = useModalStore(state => state.open)

  const {
    resetCurrentBoard,
    useHint,
    hintsUsed,
    canUndo,
    canRedo,
    undo,
    redo,
    smartFillCandidates
  } = useBoardState()

  const { resetCurrentTimer } = useTimer()

  const { syncLoading, onSyncToDB } = useSync()

  const handleClearBoard = () => {
    open(ConfirmationModal, {
      title: t('modals.confirmClearBoard.title'),
      description: t('modals.confirmClearBoard.description'),
      confirmButton: 'delete',
      onConfirm: async () => {
        resetCurrentBoard()
        resetCurrentTimer()
      }
    })
  }

  const handleSmartFill = () => {
    open(ConfirmationModal, {
      title: t('modals.confirmSmartFill.title'),
      description: t('modals.confirmSmartFill.description'),
      confirmButton: 'confirm',
      onConfirm: async () => {
        smartFillCandidates()
      }
    })
  }

  const MAX_HINTS = 3

  // Can use hint if hints remaining (hint will pick random unfilled cell)
  const canUseHint = hintsUsed < MAX_HINTS

  return (
    <div className="flex flex-wrap gap-2">
      {/* Undo/Redo buttons */}
      <Button
        className="min-w-32 flex-1"
        disabled={!canUndo}
        icon="tabler:arrow-back-up"
        variant="secondary"
        onClick={undo}
      >
        <span className="truncate">{t('buttons.undo')}</span>
      </Button>
      <Button
        className="min-w-32 flex-1"
        disabled={!canRedo}
        icon="tabler:arrow-forward-up"
        variant="secondary"
        onClick={redo}
      >
        <span className="truncate">{t('buttons.redo')}</span>
      </Button>

      {/* Other action buttons */}
      <Button
        className="min-w-48 flex-1"
        disabled={!canUseHint}
        icon="tabler:bulb"
        variant="secondary"
        onClick={() => {
          useHint()
        }}
      >
        <span className="truncate">
          {t('buttons.hint')}{' '}
          <span className="text-bg-500 text-xs">
            ({MAX_HINTS - hintsUsed}/{MAX_HINTS})
          </span>
        </span>
      </Button>
      <Button
        className="min-w-32 flex-1"
        icon="mage:stars-c"
        variant="secondary"
        onClick={handleSmartFill}
      >
        <span className="truncate">{t('buttons.smartFill')}</span>
      </Button>
      <Button
        className="min-w-32 flex-1"
        icon="tabler:eraser"
        variant="secondary"
        onClick={handleClearBoard}
      >
        <span className="truncate">{t('buttons.clearBoard')}</span>
      </Button>
      <Button
        className="min-w-32 flex-1"
        icon="tabler:cloud-upload"
        loading={syncLoading}
        variant="secondary"
        onClick={onSyncToDB}
      >
        <span className="truncate">{t('buttons.sync')}</span>
      </Button>
    </div>
  )
}

export default ActionButtons
