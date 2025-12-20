import { useEffect } from 'react'

import { useBoardState } from '../providers/BoardStateProvider'
import { useSession } from '../providers/SessionProvider'
import { useTimer } from '../providers/TimerProvider'

/**
 * Hook that handles initialization of game state from session data.
 * Should be called once in the main Play component after all providers are available.
 */
export function useGameInitializer() {
  const {
    sessionQuery,
    setCurrentBoardIndex,
    isInitialized,
    setIsInitialized
  } = useSession()

  const { initializeFromSession } = useBoardState()

  const { initializeTimers } = useTimer()

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
}
