/* eslint-disable react-compiler/react-compiler */
import { Button, ConfirmationModal, useModalStore } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import {
  useBoardState,
  useInputMode,
  useSync,
  useTimer
} from '../../../providers'

function ActionButtons() {
  const { t } = useTranslation('apps.sudoku')

  const open = useModalStore(state => state.open)

  const { resetCurrentBoard } = useBoardState()

  const { resetCurrentTimer } = useTimer()

  const { isCandidate, setIsCandidate, isCandidateModeLockedRef } =
    useInputMode()

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

  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        className="flex-1 sm:flex-none"
        icon="tabler:pencil"
        namespace="apps.sudoku"
        variant={!isCandidate ? 'primary' : 'secondary'}
        onClick={() => {
          isCandidateModeLockedRef.current = false
          setIsCandidate(false)
        }}
      >
        normal
      </Button>
      <Button
        className="flex-1 sm:flex-none"
        icon="tabler:notes"
        namespace="apps.sudoku"
        variant={isCandidate ? 'primary' : 'secondary'}
        onClick={() => {
          isCandidateModeLockedRef.current = true
          setIsCandidate(true)
        }}
      >
        candidate
      </Button>
      <div className="bg-bg-300 dark:bg-bg-600 mx-2 hidden h-8 w-px sm:block" />
      <Button
        className="flex-1 sm:flex-none"
        icon="tabler:eraser"
        namespace="apps.sudoku"
        variant="secondary"
        onClick={handleClearBoard}
      >
        clearBoard
      </Button>
      <div className="bg-bg-300 dark:bg-bg-600 mx-2 hidden h-8 w-px sm:block" />
      <Button
        className="flex-1 sm:flex-none"
        icon="tabler:cloud-upload"
        loading={syncLoading}
        namespace="apps.sudoku"
        variant="secondary"
        onClick={onSyncToDB}
      >
        sync
      </Button>
    </div>
  )
}

export default ActionButtons
