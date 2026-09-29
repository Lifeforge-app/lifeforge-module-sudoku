import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  Button,
  Card,
  ConfirmationModal,
  useModalStore
} from '@lifeforge/ui'

import { useBoardState, useSync, useTimer } from '../../../providers'

function LeftToolbar() {
  const { t } = useModuleTranslation()
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
    <Card direction={{ base: 'row', lg: 'column' }} gap="sm">
      <Button
        disabled={!canUndo}
        icon="tabler:arrow-back-up"
        iconProps={{ size: '1.5rem' }}
        p="sm"
        variant="plain"
        onClick={undo}
      />
      <Button
        disabled={!canRedo}
        icon="tabler:arrow-forward-up"
        iconProps={{ size: '1.5rem' }}
        p="sm"
        variant="plain"
        onClick={redo}
      />
      <Box
        bg={{ base: 'bg-300', dark: 'bg-600' }}
        display={{ base: 'none', lg: 'block' }}
        height="1px"
        my="xs"
        width="100%"
      />
      <Button
        disabled={!canUseHint}
        icon="tabler:bulb"
        iconProps={{ size: '1.5rem' }}
        p="sm"
        variant="plain"
        onClick={() => {
          useHint()
        }}
      />
      <Button
        icon="mage:stars-c"
        iconProps={{ size: '1.5rem' }}
        p="sm"
        variant="plain"
        onClick={handleSmartFill}
      />
      <Button
        icon="tabler:eraser"
        iconProps={{ size: '1.5rem' }}
        p="sm"
        variant="plain"
        onClick={handleClearBoard}
      />
      <Button
        icon="tabler:cloud-upload"
        iconProps={{ size: '1.5rem' }}
        loading={syncLoading}
        p="sm"
        variant="plain"
        onClick={onSyncToDB}
      />
    </Card>
  )
}

export default LeftToolbar
