import { Box, Flex, Icon, Text, Transition } from '@lifeforge/ui'

import { formatTime } from '../../../utils/time'
import { useBoardState, useTimer } from '../providers'

function TimerDisplay() {
  const { elapsedTime, isPaused, togglePause } = useTimer()
  const { isBoardCompleted } = useBoardState()

  return (
    <Flex centered gap="sm" mt="md">
      {!isBoardCompleted && (
        <Box as="button" type="button" onClick={togglePause}>
          <Transition property="color">
            <Icon
              color={{ base: 'muted', hover: 'primary' }}
              icon={
                isPaused
                  ? 'tabler:player-play-filled'
                  : 'tabler:player-pause-filled'
              }
              size="1.25rem"
            />
          </Transition>
        </Box>
      )}
      <Flex centered gap="sm">
        <Icon color="muted" icon="tabler:clock" size="1.25rem" />
        <Text color="muted" size="lg" style={{ fontFamily: 'monospace' }}>
          {formatTime(elapsedTime)}
        </Text>
      </Flex>
    </Flex>
  )
}

export default TimerDisplay
