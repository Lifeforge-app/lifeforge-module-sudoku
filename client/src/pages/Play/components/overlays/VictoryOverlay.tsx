import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  ConfirmationModal,
  Flex,
  Icon,
  Text,
  colorWithOpacity,
  useModalStore
} from '@lifeforge/ui'

import { useSession, useSync } from '../../providers'

interface VictoryOverlayProps {
  onBoardSwitch: (index: number) => void
}

function VictoryOverlay({ onBoardSwitch }: VictoryOverlayProps) {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()
  const { boards, currentBoardIndex } = useSession()
  const { resetBoardMutation, handleRetry } = useSync()

  const hasNextBoard = currentBoardIndex < boards.length - 1

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

  const handleNextBoard = () => {
    onBoardSwitch(currentBoardIndex + 1)
  }

  return (
    <Flex
      align="center"
      bg={{
        base: colorWithOpacity('bg-50', '50%'),
        dark: colorWithOpacity('bg-900', '50%')
      }}
      inset="0"
      justify="center"
      position="absolute"
    >
      <Flex
        shadow
        align="center"
        bg={{ base: 'bg-50', dark: 'bg-900' }}
        direction="column"
        gap="lg"
        p="xl"
        r="2xl"
        style={{ backdropFilter: 'blur(4px)' }}
        width={{ base: '100%', sm: '30vw' }}
      >
        <Flex
          centered
          bg={colorWithOpacity('primary', '20%')}
          height="5rem"
          r="full"
          width="5rem"
        >
          <Icon color="primary" icon="tabler:trophy" size="2.5rem" />
        </Flex>
        <Flex align="center" direction="column">
          <Text
            align="center"
            as="h2"
            color={{ base: 'bg-800', dark: 'bg-100' }}
            size="2xl"
            weight="bold"
          >
            {t('messages.congratulations')}
          </Text>
          <Text align="center" as="p" color="muted" mt="sm">
            {t('messages.puzzleSolved')}
          </Text>
        </Flex>
        <Flex align="center" gap="sm">
          <Button
            icon="tabler:refresh"
            loading={resetBoardMutation.isPending}
            variant="secondary"
            onClick={handlePlayAgain}
          >
            retry
          </Button>
          {hasNextBoard && (
            <Button
              icon="tabler:arrow-right"
              variant="primary"
              onClick={handleNextBoard}
            >
              Next Board
            </Button>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default VictoryOverlay
