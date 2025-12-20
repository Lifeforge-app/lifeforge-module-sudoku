import { GoBackButton, WithQuery } from 'lifeforge-ui'
import { useEffect } from 'react'
import { useNavigate } from 'shared'

import BoardSelector from './components/BoardSelector'
import BottomToolbar from './components/BottomToolbar'
import InteractiveBoard from './components/InteractiveBoard'
import TimerDisplay from './components/TimerDisplay'
import VictoryOverlay from './components/VictoryOverlay'
import {
  BoardStateProvider,
  InputModeProvider,
  SessionProvider,
  SyncProvider,
  TimerProvider,
  useBoardState,
  useSession,
  useSync,
  useTimer
} from './providers'

// Main Play component - sets up the provider hierarchy
function Play() {
  return (
    <SessionProvider>
      <BoardStateProviderWrapper />
    </SessionProvider>
  )
}

// Wrapper that has access to SessionProvider and sets up remaining providers
function BoardStateProviderWrapper() {
  const { currentBoardIndex, currentBoard, isInitialized } = useSession()

  return (
    <BoardStateProvider
      currentBoard={currentBoard}
      currentBoardIndex={currentBoardIndex}
    >
      <TimerProviderWrapper isInitialized={isInitialized} />
    </BoardStateProvider>
  )
}

function TimerProviderWrapper({ isInitialized }: { isInitialized: boolean }) {
  const { currentBoardIndex } = useSession()

  const { isBoardCompleted } = useBoardState()

  return (
    <TimerProvider
      currentBoardIndex={currentBoardIndex}
      isBoardCompleted={isBoardCompleted}
      isInitialized={isInitialized}
    >
      <SyncProviderWrapper />
    </TimerProvider>
  )
}

function SyncProviderWrapper() {
  const { sessionId, boards, currentBoardIndex, difficulty } = useSession()

  const { allUserInputs, allCandidates, resetCurrentBoard } = useBoardState()

  const { allDurationsElapsed, currentElapsedTimeRef, resetCurrentTimer } =
    useTimer()

  const handleResetSuccess = () => {
    resetCurrentBoard()
    resetCurrentTimer()
  }

  return (
    <SyncProvider
      allCandidates={allCandidates}
      allDurationsElapsed={allDurationsElapsed}
      allUserInputs={allUserInputs}
      boards={boards}
      currentBoardIndex={currentBoardIndex}
      currentElapsedTimeRef={currentElapsedTimeRef}
      difficulty={difficulty}
      sessionId={sessionId}
      onResetSuccess={handleResetSuccess}
    >
      <InputModeProviderWrapper />
    </SyncProvider>
  )
}

function InputModeProviderWrapper() {
  const { onSyncToDB } = useSync()

  return (
    <InputModeProvider onSyncToDB={onSyncToDB}>
      <PlayContent />
    </InputModeProvider>
  )
}

// The actual UI component that uses all the providers
function PlayContent() {
  const navigate = useNavigate()

  const {
    sessionQuery,
    boards,
    currentBoardIndex,
    setCurrentBoardIndex,
    isInitialized,
    setIsInitialized
  } = useSession()

  const { isBoardCompleted, setSelectedCell, initializeFromSession } =
    useBoardState()

  const { initializeTimers, switchBoard } = useTimer()

  const { syncToDatabaseHandler } = useSync()

  // Initialize from session data when it loads
  useEffect(() => {
    if (sessionQuery.data && !isInitialized) {
      const { session, entries } = sessionQuery.data

      setCurrentBoardIndex(session.current_board_index || 0)
      initializeFromSession(entries)

      const durations = entries.map(
        (entry: { duration_elapsed: unknown }) =>
          (entry.duration_elapsed as number) || 0
      )

      initializeTimers(durations, session.current_board_index || 0)

      setIsInitialized(true)
    }
  }, [
    sessionQuery.data,
    isInitialized,
    setCurrentBoardIndex,
    initializeFromSession,
    initializeTimers,
    setIsInitialized
  ])

  const handleBoardSwitch = (index: number) => {
    switchBoard(currentBoardIndex, index)
    setCurrentBoardIndex(index)
    setSelectedCell(null)
  }

  return (
    <div className="flex flex-1 flex-col">
      <GoBackButton
        onClick={() => {
          syncToDatabaseHandler()
          navigate('/sudoku')
        }}
      />
      <WithQuery query={sessionQuery}>
        {() =>
          isInitialized && boards.length > 0 ? (
            <>
              <BoardSelector onBoardSwitch={handleBoardSwitch} />
              <TimerDisplay />
              <div className="flex-center relative mb-4 flex-1 flex-col sm:mb-8 md:mb-12">
                <div className="flex-center w-full flex-1">
                  <InteractiveBoard />
                  {isBoardCompleted && (
                    <VictoryOverlay onBoardSwitch={handleBoardSwitch} />
                  )}
                </div>
                {!isBoardCompleted && <BottomToolbar />}
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

export default Play
