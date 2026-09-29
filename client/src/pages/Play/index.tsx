import { useNavigate } from 'react-router'

import {
  Box,
  Button,
  Flex,
  GoBackButton,
  Stack,
  WithQuery,
  useModalStore
} from '@lifeforge/ui'

import TimerDisplay from './components/TimerDisplay'
import BoardSelector from './components/board/BoardSelector'
import InteractiveBoard from './components/board/InteractiveBoard'
import SettingsModal from './components/modals/SettingsModal'
import PauseOverlay from './components/overlays/PauseOverlay'
import VictoryOverlay from './components/overlays/VictoryOverlay'
import BottomToolbar from './components/toolbars/sides/BottomToolbar'
import LeftToolbar from './components/toolbars/sides/LeftToolbar'
import RightToolbar from './components/toolbars/sides/RightToolbar'
import { useGameInitializer } from './hooks/useGameInitializer'
import {
  BoardHistoryProvider,
  BoardStateProvider,
  InputModeProvider,
  SessionProvider,
  SettingsProvider,
  SyncProvider,
  TimerProvider,
  useBoardState,
  useSession,
  useSettings,
  useSync,
  useTimer
} from './providers'

// The actual UI component that uses all the providers
function PlayContent() {
  useGameInitializer()
  const navigate = useNavigate()
  const { open } = useModalStore()

  const {
    sessionQuery,
    boards,
    currentBoardIndex,
    setCurrentBoardIndex,
    isInitialized
  } = useSession()

  const { isBoardCompleted, setSelectedCell } = useBoardState()
  const { switchBoard } = useTimer()
  const { syncToDatabaseHandler } = useSync()
  const { autoCheckMode, setAutoCheckMode } = useSettings()

  const handleBoardSwitch = (index: number) => {
    switchBoard(currentBoardIndex, index)
    setCurrentBoardIndex(index)
    setSelectedCell(null)
  }

  return (
    <Flex direction="column" flex="1">
      <Flex justify="between">
        <GoBackButton
          onClick={() => {
            syncToDatabaseHandler()
            navigate('/sudoku')
          }}
        />
        <Button
          icon="tabler:settings"
          variant="plain"
          onClick={() =>
            open(SettingsModal, { autoCheckMode, setAutoCheckMode })
          }
        />
      </Flex>
      <WithQuery query={sessionQuery}>
        {() =>
          isInitialized && boards.length > 0 ? (
            <>
              <BoardSelector onBoardSwitch={handleBoardSwitch} />
              <Flex centered flex="1">
                <Flex
                  align={{ base: 'center', lg: 'start' }}
                  direction={{ base: 'column', lg: 'row' }}
                  flex="1"
                  gap={{ lg: 'md' }}
                  justify="center"
                  mb={{ base: 'md', sm: 'xl', lg: 'none' }}
                  position="relative"
                  width="100%"
                >
                  {/* Left toolbar - action buttons (icon only, vertical) */}
                  {!isBoardCompleted && (
                    <Box
                      display={{ base: 'none', lg: 'block' }}
                      style={{ marginTop: '3.5rem' }}
                    >
                      <LeftToolbar />
                    </Box>
                  )}

                  <Stack
                    gap="md"
                    minWidth={{ md: '36rem' }}
                    width={{ base: '100%', md: 'auto' }}
                  >
                    <TimerDisplay />
                    <Flex centered position="relative">
                      <InteractiveBoard />
                      <PauseOverlay />
                      {isBoardCompleted && (
                        <VictoryOverlay onBoardSwitch={handleBoardSwitch} />
                      )}
                    </Flex>
                  </Stack>

                  {/* Right toolbar - mode toggle, 3x3 numbers, delete */}
                  {!isBoardCompleted && (
                    <Box
                      display={{ base: 'none', lg: 'block' }}
                      style={{ marginTop: '3.5rem' }}
                    >
                      <RightToolbar />
                    </Box>
                  )}

                  {/* Mobile: bottom toolbar (combined) */}
                  {!isBoardCompleted && (
                    <Box display={{ base: 'block', lg: 'none' }} width="100%">
                      <BottomToolbar />
                    </Box>
                  )}
                </Flex>
              </Flex>
            </>
          ) : (
            <></>
          )
        }
      </WithQuery>
    </Flex>
  )
}

function Play() {
  return (
    <SessionProvider>
      <SettingsProvider>
        <BoardHistoryProvider>
          <BoardStateProvider>
            <TimerProvider>
              <SyncProvider>
                <InputModeProvider>
                  <PlayContent />
                </InputModeProvider>
              </SyncProvider>
            </TimerProvider>
          </BoardStateProvider>
        </BoardHistoryProvider>
      </SettingsProvider>
    </SessionProvider>
  )
}

export default Play
