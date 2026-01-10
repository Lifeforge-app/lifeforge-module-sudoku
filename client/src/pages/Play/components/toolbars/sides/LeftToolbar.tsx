import { Button, Card } from 'lifeforge-ui'
import { ConfirmationModal, useModalStore } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import { useBoardState, useSync, useTimer } from '../../../providers'

function LeftToolbar() {
  const { t } = useTranslation('apps.sudoku')

  const { open } = useModalStore()

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

  const canUseHint = hintsUsed < MAX_HINTS

  return (
    <Card className="flex flex-row gap-2 lg:flex-col">
      <Button
        className="!p-3"
        disabled={!canUndo}
        icon="tabler:arrow-back-up"
        iconClassName="!size-6"
        variant="plain"
        onClick={undo}
      />
      <Button
        className="!p-3"
        disabled={!canRedo}
        icon="tabler:arrow-forward-up"
        iconClassName="!size-6"
        variant="plain"
        onClick={redo}
      />
      <div className="bg-bg-300 dark:bg-bg-600 my-1 hidden h-px w-full lg:block" />
      <Button
        className="!p-3"
        disabled={!canUseHint}
        icon="tabler:bulb"
        iconClassName="!size-6"
        variant="plain"
        onClick={() => {
          useHint()
        }}
      />
      <Button
        className="!p-3"
        icon="mage:stars-c"
        iconClassName="!size-6"
        variant="plain"
        onClick={handleSmartFill}
      />
      <Button
        className="!p-3"
        icon="tabler:eraser"
        iconClassName="!size-6"
        variant="plain"
        onClick={handleClearBoard}
      />
      <Button
        className="!p-3"
        icon="tabler:cloud-upload"
        iconClassName="!size-6"
        loading={syncLoading}
        variant="plain"
        onClick={onSyncToDB}
      />
    </Card>
  )
}

export default LeftToolbar
