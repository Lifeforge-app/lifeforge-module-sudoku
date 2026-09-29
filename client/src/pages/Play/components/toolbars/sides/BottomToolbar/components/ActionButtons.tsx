/* eslint-disable react-compiler/react-compiler */
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  ConfirmationModal,
  Flex,
  Text,
  useModalStore
} from '@lifeforge/ui'

import { useBoardState, useSync, useTimer } from '@/pages/Play/providers'

function ActionButtons() {
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

  // Can use hint if hints remaining (hint will pick random unfilled cell)
  const canUseHint = hintsUsed < MAX_HINTS

  return (
    <Flex gap="sm" wrap="wrap">
      {/* Undo/Redo buttons */}
      <Button
        disabled={!canUndo}
        flex="1"
        icon="tabler:arrow-back-up"
        minWidth="8rem"
        variant="secondary"
        onClick={undo}
      >
        <Text truncate>{t('buttons.undo')}</Text>
      </Button>
      <Button
        disabled={!canRedo}
        flex="1"
        icon="tabler:arrow-forward-up"
        minWidth="8rem"
        variant="secondary"
        onClick={redo}
      >
        <Text truncate>{t('buttons.redo')}</Text>
      </Button>

      {/* Other action buttons */}
      <Button
        disabled={!canUseHint}
        flex="1"
        icon="tabler:bulb"
        minWidth="12rem"
        variant="secondary"
        onClick={() => {
          useHint()
        }}
      >
        <Text truncate>
          {t('buttons.hint')}{' '}
          <Text color="muted" size="xs">
            ({MAX_HINTS - hintsUsed}/{MAX_HINTS})
          </Text>
        </Text>
      </Button>
      <Button
        flex="1"
        icon="mage:stars-c"
        minWidth="8rem"
        variant="secondary"
        onClick={handleSmartFill}
      >
        <Text truncate>{t('buttons.smartFill')}</Text>
      </Button>
      <Button
        flex="1"
        icon="tabler:eraser"
        minWidth="8rem"
        variant="secondary"
        onClick={handleClearBoard}
      >
        <Text truncate>{t('buttons.clearBoard')}</Text>
      </Button>
      <Button
        flex="1"
        icon="tabler:cloud-upload"
        loading={syncLoading}
        minWidth="8rem"
        variant="secondary"
        onClick={onSyncToDB}
      >
        <Text truncate>{t('buttons.sync')}</Text>
      </Button>
    </Flex>
  )
}

export default ActionButtons
