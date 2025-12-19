import type { SudokuBoard } from '@'
import forgeAPI from '@/utils/forgeAPI'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef
} from 'react'
import { toast } from 'react-toastify'
import { usePromiseLoading } from 'shared'

const SYNC_INTERVAL_MS = 30000 // 30 seconds

interface SyncContextType {
  syncLoading: boolean
  onSyncToDB: () => void
  syncToDatabaseHandler: () => Promise<void>
  resetBoardMutation: {
    isPending: boolean
    mutate: (params: { sessionId: string; boardIndex: number }) => void
  }
  handleRetry: () => void
}

export function candidatesToArrays(candidates: Set<number>[][]): number[][][] {
  return candidates.map(board => board.map(cell => Array.from(cell)))
}

// Sync game state to database
export async function syncToDatabase(params: {
  sessionId: string
  boards: SudokuBoard[]
  userInputs: string[][]
  candidates: number[][][]
  currentBoardIndex: number
  difficulty: string
  durationsElapsed: number[]
}): Promise<void> {
  await forgeAPI.sudoku.sessions.save.mutate({
    sessionId: params.sessionId,
    currentBoardIndex: params.currentBoardIndex,
    difficulty: params.difficulty,
    boards: params.boards,
    userInputs: params.userInputs,
    candidates: params.candidates,
    durationsElapsed: params.durationsElapsed
  })
}

const SyncContext = createContext<SyncContextType | null>(null)

interface SyncProviderProps {
  children: ReactNode
  sessionId: string | undefined
  boards: SudokuBoard[]
  allUserInputs: string[][]
  allCandidates: Set<number>[][]
  currentBoardIndex: number
  difficulty: string
  allDurationsElapsed: number[]
  currentElapsedTimeRef: React.MutableRefObject<number>
  onResetSuccess: () => void
}

export function SyncProvider({
  children,
  sessionId,
  boards,
  allUserInputs,
  allCandidates,
  currentBoardIndex,
  difficulty,
  allDurationsElapsed,
  currentElapsedTimeRef,
  onResetSuccess
}: SyncProviderProps) {
  const queryClient = useQueryClient()

  const isSyncingRef = useRef(false)

  // Sync to database function
  const syncToDatabaseHandler = useCallback(async () => {
    if (isSyncingRef.current || boards.length === 0 || !sessionId) return
    isSyncingRef.current = true

    try {
      await syncToDatabase({
        sessionId,
        boards,
        userInputs: allUserInputs,
        candidates: candidatesToArrays(allCandidates),
        currentBoardIndex,
        difficulty,
        durationsElapsed: allDurationsElapsed.map((dur, idx) =>
          idx === currentBoardIndex ? currentElapsedTimeRef.current : dur
        )
      })
      await queryClient.invalidateQueries({
        queryKey: ['sudoku', 'sessions', 'list']
      })
    } catch (error) {
      toast.error('Failed to sync session to database.')
      console.error('Database sync failed:', error)
    } finally {
      isSyncingRef.current = false
    }
  }, [
    boards,
    sessionId,
    allUserInputs,
    allCandidates,
    allDurationsElapsed,
    currentBoardIndex,
    difficulty,
    currentElapsedTimeRef
  ])

  const [syncLoading, onSyncToDB] = usePromiseLoading(syncToDatabaseHandler)

  // Reset board mutation
  const resetBoardMutation = useMutation(
    forgeAPI.sudoku.sessions.resetBoard.mutationOptions({
      onSuccess: () => {
        onResetSuccess()
        queryClient.invalidateQueries({ queryKey: ['sudoku', 'sessions'] })
        toast.success('Board reset successfully!')
      }
    })
  )

  const handleRetry = useCallback(() => {
    if (!sessionId) return
    resetBoardMutation.mutate({ sessionId, boardIndex: currentBoardIndex })
  }, [sessionId, currentBoardIndex, resetBoardMutation])

  // Auto sync interval
  useEffect(() => {
    if (boards.length === 0 || !sessionId) return

    const intervalId = setInterval(syncToDatabaseHandler, SYNC_INTERVAL_MS)

    return () => clearInterval(intervalId)
  }, [boards.length, sessionId, syncToDatabaseHandler])

  // Save on unload/visibility change
  useEffect(() => {
    if (boards.length === 0 || !sessionId) return

    const handleBeforeUnload = () => {
      const payload = JSON.stringify({
        sessionId,
        currentBoardIndex,
        difficulty,
        boards,
        userInputs: allUserInputs,
        candidates: candidatesToArrays(allCandidates),
        durationsElapsed: allDurationsElapsed.map((dur, idx) =>
          idx === currentBoardIndex ? currentElapsedTimeRef.current : dur
        )
      })

      navigator.sendBeacon('/api/sudoku/sessions/save', payload)
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        syncToDatabaseHandler()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [
    boards,
    sessionId,
    allUserInputs,
    allCandidates,
    currentBoardIndex,
    difficulty,
    allDurationsElapsed,
    currentElapsedTimeRef,
    syncToDatabaseHandler
  ])

  const value: SyncContextType = {
    syncLoading,
    onSyncToDB,
    syncToDatabaseHandler,
    resetBoardMutation,
    handleRetry
  }

  return <SyncContext value={value}>{children}</SyncContext>
}

export function useSync() {
  const context = useContext(SyncContext)

  if (!context) {
    throw new Error('useSync must be used within a SyncProvider')
  }

  return context
}
