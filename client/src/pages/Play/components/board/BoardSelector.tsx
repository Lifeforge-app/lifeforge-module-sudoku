import {
  Box,
  Flex,
  Ring,
  Text,
  Transition,
  colorWithOpacity
} from '@lifeforge/ui'

import { formatTime } from '@/utils/time'

import { useBoardState, useSession, useTimer } from '../../providers'

interface BoardSelectorProps {
  onBoardSwitch: (index: number) => void
}

function BoardSelector({ onBoardSwitch }: BoardSelectorProps) {
  const { boards, currentBoardIndex } = useSession()
  const { allUserInputs } = useBoardState()
  const { allDurationsElapsed } = useTimer()

  if (boards.length <= 1) return null

  // Calculate completion status for each board
  const boardStatuses = boards.map((board, index) => {
    const userInputs = allUserInputs[index] ?? []

    const duration = allDurationsElapsed[index] ?? 0

    let filled = 0
    let total = 0

    // mission is a string of 81 characters, '0' means empty cell
    if (board?.mission) {
      for (let i = 0; i < board.mission.length; i++) {
        if (board.mission[i] === '0') {
          total++

          const userInput = userInputs[i]

          if (userInput && userInput !== '') {
            filled++
          }
        }
      }
    }

    const progress = total > 0 ? Math.round((filled / total) * 100) : 0

    const isCompleted = progress === 100

    return { progress, filled, total, isCompleted, duration }
  })

  return (
    <Flex align="center" direction="column" gap="sm" mt="md" px="md">
      <Flex
        align="center"
        gap="sm"
        justify="center"
        maxWidth="100%"
        wrap="wrap"
      >
        {boards.map((_, index) => {
          const status = boardStatuses[index]

          const isActive = index === currentBoardIndex

          const isCompleted = status.isCompleted

          return (
            <Transition key={index} property="all">
              <Ring asChild ringWidth={isActive ? '2px' : '0px'}>
                <Flex
                  align="center"
                  as="button"
                  bg={
                    isActive
                      ? colorWithOpacity('primary', '20%')
                      : {
                          base: colorWithOpacity('bg-200', '50%'),
                          dark: colorWithOpacity('bg-700', '30%'),
                          hover: 'bg-200',
                          darkHover: colorWithOpacity('bg-700', '50%')
                        }
                  }
                  direction="column"
                  gap="xs"
                  position="relative"
                  px={{ base: 'sm', sm: 'md' }}
                  py="sm"
                  r="lg"
                  type="button"
                  width={{ base: '6rem', sm: '7rem', md: '8rem' }}
                  onClick={() => onBoardSwitch(index)}
                >
                  <Flex align="center" gap="sm">
                    <Text
                      color={
                        isActive
                          ? 'primary'
                          : { base: 'bg-600', dark: 'bg-300' }
                      }
                      size={{ base: 'xs', sm: 'sm' }}
                      weight="medium"
                    >
                      Board {index + 1}
                    </Text>
                  </Flex>

                  {/* Progress bar */}
                  <Box
                    bg={{ base: 'bg-300', dark: 'bg-600' }}
                    height="0.25rem"
                    overflow="hidden"
                    r="full"
                    width="100%"
                  >
                    <Transition property="all">
                      <Box
                        bg={isCompleted ? 'green-500' : 'primary'}
                        height="100%"
                        r="full"
                        style={{ width: `${status.progress}%` }}
                      />
                    </Transition>
                  </Box>

                  {/* Time indicator */}
                  <Text
                    color="muted"
                    style={{ fontSize: 'clamp(0.625rem, 2vw, 0.75rem)' }}
                  >
                    {formatTime(status.duration)}
                  </Text>
                </Flex>
              </Ring>
            </Transition>
          )
        })}
      </Flex>
    </Flex>
  )
}

export default BoardSelector
