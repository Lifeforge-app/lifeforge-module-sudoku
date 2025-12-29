import type { SudokuBoard } from '@'
import forgeAPI from '@/utils/forgeAPI'
import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState
} from 'react'
import { type InferOutput, useParams } from 'shared'

interface SessionContextType {
  sessionId: string | undefined
  sessionQuery: UseQueryResult<InferOutput<typeof forgeAPI.sudoku.sessions.get>>
  boards: SudokuBoard[]
  currentBoard: SudokuBoard | undefined
  currentBoardIndex: number
  setCurrentBoardIndex: (index: number) => void
  difficulty: string
  isInitialized: boolean
  setIsInitialized: (value: boolean) => void
}

const SessionContext = createContext<SessionContextType | null>(null)

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  const { sessionId } = useParams<{ sessionId: string }>()

  const sessionQuery = useQuery({
    ...forgeAPI.sudoku.sessions.get.input({ id: sessionId! }).queryOptions(),
    enabled: !!sessionId
  })

  const [currentBoardIndex, setCurrentBoardIndex] = useState(0)

  const [isInitialized, setIsInitialized] = useState(false)

  // Get boards from session data
  const boards: SudokuBoard[] = useMemo(
    () =>
      sessionQuery.data?.entries.map(entry => entry.board as SudokuBoard) || [],
    [sessionQuery.data]
  )

  const currentBoard = boards[currentBoardIndex]

  const difficulty = sessionQuery.data?.entries[0]?.difficulty || 'unknown'

  const value: SessionContextType = {
    sessionId,
    sessionQuery,
    boards,
    currentBoard,
    currentBoardIndex,
    setCurrentBoardIndex,
    difficulty,
    isInitialized,
    setIsInitialized
  }

  return <SessionContext value={value}>{children}</SessionContext>
}

export function useSession() {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }

  return context
}
