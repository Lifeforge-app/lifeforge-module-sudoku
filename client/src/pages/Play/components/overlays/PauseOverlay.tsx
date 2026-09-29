import { useModuleTranslation } from '@lifeforge/localization'
import { Button, Flex, Icon, Text, colorWithOpacity } from '@lifeforge/ui'

import { useTimer } from '../../providers'

function PauseOverlay() {
  const { t } = useModuleTranslation()
  const { isPaused, togglePause } = useTimer()

  if (!isPaused) return null

  return (
    <Flex
      align="center"
      bg={{
        base: colorWithOpacity('bg-50', '50%'),
        dark: colorWithOpacity('bg-900', '50%')
      }}
      direction="column"
      inset="0"
      justify="center"
      position="absolute"
      zIndex="20"
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
          <Icon color="primary" icon="tabler:player-pause" size="2.5rem" />
        </Flex>
        <Text
          as="h2"
          color={{ base: 'bg-800', dark: 'bg-100' }}
          size="2xl"
          weight="bold"
        >
          {t('messages.gamePaused')}
        </Text>
        <Button icon="tabler:player-play" onClick={togglePause}>
          {t('buttons.resume')}
        </Button>
      </Flex>
    </Flex>
  )
}

export default PauseOverlay
