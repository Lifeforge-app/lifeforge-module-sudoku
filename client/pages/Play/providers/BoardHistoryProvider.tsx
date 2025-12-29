import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState
} from 'react'

import { useSession } from './SessionProvider'

// Type for a single move in history
export interface MoveState {
  userInputs: string[]
  candidates: number[][]
}

interface HistoryData {
  states: MoveState[]
  index: number
}

interface BoardHistoryContextType {
  // Push a new state to history (call BEFORE making changes)
  pushState: (state: MoveState) => void
  // Undo - returns previous state or null
  undo: () => MoveState | null
  // Redo - returns next state or null
  redo: () => MoveState | null
  // Whether undo/redo is available
  canUndo: boolean
  canRedo: boolean
  // Reset history for current board
  resetHistory: (initialState: MoveState) => void
  // Initialize history for a specific board
  initializeHistory: (boardIndex: number, initialState: MoveState) => void
}

const BoardHistoryContext = createContext<BoardHistoryContextType | null>(null)

export function useBoardHistory() {
  const context = useContext(BoardHistoryContext)

  if (!context) {
    throw new Error(
      'useBoardHistory must be used within a BoardHistoryProvider'
    )
  }

  return context
}

export function BoardHistoryProvider({ children }: { children: ReactNode }) {
  const { currentBoardIndex } = useSession()

  const historyMapRef = useRef<Map<number, HistoryData>>(new Map())

  // State just for triggering re-renders
  const [updateCounter, setUpdateCounter] = useState(0)

  const triggerUpdate = useCallback(() => {
    setUpdateCounter(c => c + 1)
  }, [])

  const getHistoryData = useCallback((): HistoryData => {
    if (!historyMapRef.current.has(currentBoardIndex)) {
      historyMapRef.current.set(currentBoardIndex, { states: [], index: -1 })
    }

    return historyMapRef.current.get(currentBoardIndex)!
  }, [currentBoardIndex])

  // Push a new state to history (call BEFORE making changes)
  const pushState = useCallback(
    (state: MoveState) => {
      const data = getHistoryData()

      // Remove any redo states if we're not at the end
      if (data.index < data.states.length - 1) {
        data.states = data.states.slice(0, data.index + 1)
      }

      // Add new state
      data.states.push({
        userInputs: [...state.userInputs],
        candidates: state.candidates.map(c => [...c])
      })

      // Limit to 100 states
      if (data.states.length > 100) {
        data.states.shift()
        data.index = data.states.length - 1
      } else {
        data.index = data.states.length - 1
      }

      historyMapRef.current.set(currentBoardIndex, data)
      triggerUpdate()
    },
    [currentBoardIndex, getHistoryData, triggerUpdate]
  )

  // Undo - go back one state
  const undo = useCallback((): MoveState | null => {
    const data = getHistoryData()

    if (data.index <= 0) return null

    data.index = data.index - 1
    historyMapRef.current.set(currentBoardIndex, data)
    triggerUpdate()

    const state = data.states[data.index]

    return {
      userInputs: [...state.userInputs],
      candidates: state.candidates.map(c => [...c])
    }
  }, [currentBoardIndex, getHistoryData, triggerUpdate])

  // Redo - go forward one state
  const redo = useCallback((): MoveState | null => {
    const data = getHistoryData()

    if (data.index >= data.states.length - 1) return null

    data.index = data.index + 1
    historyMapRef.current.set(currentBoardIndex, data)
    triggerUpdate()

    const state = data.states[data.index]

    return {
      userInputs: [...state.userInputs],
      candidates: state.candidates.map(c => [...c])
    }
  }, [currentBoardIndex, getHistoryData, triggerUpdate])

  const historyData = getHistoryData()

  const canUndo = historyData.index > 0

  const canRedo = historyData.index < historyData.states.length - 1

  const resetHistory = useCallback(
    (initialState: MoveState) => {
      historyMapRef.current.set(currentBoardIndex, {
        states: [
          {
            userInputs: [...initialState.userInputs],
            candidates: initialState.candidates.map(c => [...c])
          }
        ],
        index: 0
      })
      triggerUpdate()
    },
    [currentBoardIndex, triggerUpdate]
  )

  const initializeHistory = useCallback(
    (boardIndex: number, initialState: MoveState) => {
      historyMapRef.current.set(boardIndex, {
        states: [
          {
            userInputs: [...initialState.userInputs],
            candidates: initialState.candidates.map(c => [...c])
          }
        ],
        index: 0
      })
      triggerUpdate()
    },
    [triggerUpdate]
  )

  // Force read of updateCounter to ensure we re-render
  void updateCounter

  const value: BoardHistoryContextType = {
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
    initializeHistory
  }

  return <BoardHistoryContext value={value}>{children}</BoardHistoryContext>
}
