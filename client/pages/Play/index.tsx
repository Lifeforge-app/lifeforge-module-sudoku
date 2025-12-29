import { Button, GoBackButton, WithQuery, useModalStore } from 'lifeforge-ui'
import { useNavigate } from 'shared'

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

  const open = useModalStore(state => state.open)

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
    <div className="flex flex-1 flex-col">
      <div className="flex-between">
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
      </div>
      <WithQuery query={sessionQuery}>
        {() =>
          isInitialized && boards.length > 0 ? (
            <>
              <BoardSelector onBoardSwitch={handleBoardSwitch} />
              <div className="flex-center flex-1">
                <div className="flex-center relative mb-4 w-full flex-1 flex-col sm:mb-8 lg:mb-0 lg:flex-row lg:items-start lg:justify-center lg:gap-4">
                  {/* Left toolbar - action buttons (icon only, vertical) */}
                  {!isBoardCompleted && (
                    <div className="mt-14 hidden lg:block">
                      <LeftToolbar />
                    </div>
                  )}

                  <div className="w-full space-y-4 md:w-auto md:min-w-xl">
                    <TimerDisplay />
                    <div className="flex-center relative">
                      <InteractiveBoard />
                      <PauseOverlay />
                      {isBoardCompleted && (
                        <VictoryOverlay onBoardSwitch={handleBoardSwitch} />
                      )}
                    </div>
                  </div>

                  {/* Right toolbar - mode toggle, 3x3 numbers, delete */}
                  {!isBoardCompleted && (
                    <div className="mt-14 hidden lg:block">
                      <RightToolbar />
                    </div>
                  )}

                  {/* Mobile: bottom toolbar (combined) */}
                  {!isBoardCompleted && (
                    <div className="w-full lg:hidden">
                      <BottomToolbar />
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <></>
          )
        }
      </WithQuery>
    </div>
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
