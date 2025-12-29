import { getValidCandidates } from '@/constants/constants'
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react'

import { useBoardHistory } from './BoardHistoryProvider'
import { useSession } from './SessionProvider'

interface BoardStateContextType {
  allUserInputs: string[][]
  allCandidates: Set<number>[][]
  userInputs: string[]
  candidates: Set<number>[]
  selectedCell: number | null
  highlightedNumber: string | null
  isBoardCompleted: boolean
  hintsUsed: number
  canUndo: boolean
  canRedo: boolean
  setSelectedCell: (index: number | null) => void
  handleInputChange: (index: number, value: string) => void
  handleCandidateToggle: (index: number, value: number) => void
  handleClearCell: (index: number) => void
  useHint: () => boolean
  smartFillCandidates: () => void
  undo: () => void
  redo: () => void
  initializeFromSession: (
    entries: Array<{
      user_answers: unknown
      user_candidates: unknown
    }>
  ) => void
  resetCurrentBoard: () => void
}

const BoardStateContext = createContext<BoardStateContextType | null>(null)

export function useBoardState() {
  const context = useContext(BoardStateContext)

  if (!context) {
    throw new Error('useBoardState must be used within a BoardStateProvider')
  }

  return context
}

// Helper to convert Set<number>[] to number[][] for history storage
function candidatesToArrays(candidates: Set<number>[]): number[][] {
  return candidates.map(s => (s ? Array.from(s) : []))
}

// Helper to convert number[][] back to Set<number>[]
function arraysToCandidates(arrays: number[][]): Set<number>[] {
  return Array(81)
    .fill(null)
    .map((_, i) => new Set(arrays[i] ?? []))
}

export function BoardStateProvider({ children }: { children: ReactNode }) {
  const { currentBoardIndex, currentBoard } = useSession()

  const [allUserInputs, setAllUserInputs] = useState<string[][]>([])

  const [allCandidates, setAllCandidates] = useState<Set<number>[][]>([])

  const [selectedCell, setSelectedCell] = useState<number | null>(null)

  const [hintsUsed, setHintsUsed] = useState(0)

  const {
    pushState,
    undo: historyUndo,
    redo: historyRedo,
    canUndo,
    canRedo,
    resetHistory,
    initializeHistory
  } = useBoardHistory()

  const userInputs = allUserInputs[currentBoardIndex] ?? []

  const candidates = allCandidates[currentBoardIndex] ?? []

  // Undo functionality
  const undo = useCallback(() => {
    const previousState = historyUndo()

    if (!previousState) return

    setAllUserInputs(prev => {
      const newInputs = [...prev]

      newInputs[currentBoardIndex] = [...previousState.userInputs]

      return newInputs
    })

    setAllCandidates(prev => {
      const newCandidates = [...prev]

      newCandidates[currentBoardIndex] = arraysToCandidates(
        previousState.candidates
      )

      return newCandidates
    })

    // Refocus the selected cell after state change
    const currentSelected = selectedCell

    if (currentSelected !== null) {
      setSelectedCell(null)
      setTimeout(() => setSelectedCell(currentSelected), 0)
    }
  }, [historyUndo, currentBoardIndex, selectedCell])

  // Redo functionality
  const redo = useCallback(() => {
    const nextState = historyRedo()

    if (!nextState) return

    setAllUserInputs(prev => {
      const newInputs = [...prev]

      newInputs[currentBoardIndex] = [...nextState.userInputs]

      return newInputs
    })

    setAllCandidates(prev => {
      const newCandidates = [...prev]

      newCandidates[currentBoardIndex] = arraysToCandidates(
        nextState.candidates
      )

      return newCandidates
    })

    // Refocus the selected cell after state change
    const currentSelected = selectedCell

    if (currentSelected !== null) {
      setSelectedCell(null)
      setTimeout(() => setSelectedCell(currentSelected), 0)
    }
  }, [historyRedo, currentBoardIndex, selectedCell])

  // Calculate the highlighted number based on the selected cell
  const highlightedNumber =
    selectedCell !== null && currentBoard
      ? currentBoard.mission[selectedCell] !== '0'
        ? currentBoard.mission[selectedCell]
        : userInputs[selectedCell] || null
      : null

  // Check if current board is completed
  const isBoardCompleted = useMemo(() => {
    if (!currentBoard || userInputs.length === 0) return false

    for (let i = 0; i < 81; i++) {
      const missionValue = currentBoard.mission[i]

      const solutionValue = currentBoard.solution[i]

      if (missionValue === '0' && userInputs[i] !== solutionValue) {
        return false
      }
    }

    return true
  }, [currentBoard, userInputs])

  const initializeFromSession = useCallback(
    (
      entries: Array<{
        user_answers: unknown
        user_candidates: unknown
      }>
    ) => {
      const inputs = entries.map(
        entry => (entry.user_answers as string[]) || Array(81).fill('')
      )

      const cands = entries.map(entry => {
        const c = (entry.user_candidates as number[][]) || Array(81).fill([])

        return c.map(cell => new Set(cell ?? []))
      })

      setAllUserInputs(inputs)
      setAllCandidates(cands)

      // Initialize history for each board
      entries.forEach((entry, index) => {
        const userAnswers =
          (entry.user_answers as string[]) || Array(81).fill('')

        const userCands =
          (entry.user_candidates as number[][]) || Array(81).fill([])

        initializeHistory(index, {
          userInputs: userAnswers,
          candidates: userCands
        })
      })
    },
    [initializeHistory]
  )

  const resetCurrentBoard = useCallback(() => {
    const emptyInputs = Array(81).fill('')

    const emptyCands: number[][] = Array(81).fill([])

    setAllUserInputs(prev => {
      const newInputs = [...prev]

      newInputs[currentBoardIndex] = emptyInputs

      return newInputs
    })
    setAllCandidates(prev => {
      const newCandidates = [...prev]

      newCandidates[currentBoardIndex] = Array(81)
        .fill(null)
        .map(() => new Set<number>())

      return newCandidates
    })
    setSelectedCell(null)
    setHintsUsed(0)

    resetHistory({
      userInputs: emptyInputs,
      candidates: emptyCands
    })
  }, [currentBoardIndex, resetHistory])

  // Smart fill all valid candidates for empty cells
  const smartFillCandidates = useCallback(() => {
    if (!currentBoard) return

    const currentInputs = allUserInputs[currentBoardIndex] ?? Array(81).fill('')

    const currentCands = allCandidates[currentBoardIndex] ?? []

    // Calculate new candidates for all empty cells
    const newCands: Set<number>[] = Array(81)
      .fill(null)
      .map((_, idx) => {
        // Skip cells that already have a value (original or user input)
        const isOriginal = currentBoard.mission[idx] !== '0'

        const hasUserInput = currentInputs[idx] !== ''

        if (isOriginal || hasUserInput) {
          return currentCands[idx] ?? new Set<number>()
        }

        // Get valid candidates for this cell
        return getValidCandidates(idx, currentBoard.mission, currentInputs)
      })

    // Push to history
    pushState({
      userInputs: currentInputs,
      candidates: candidatesToArrays(newCands)
    })

    // Update state
    setAllCandidates(prev => {
      const updated = [...prev]

      updated[currentBoardIndex] = newCands

      return updated
    })
  }, [currentBoard, currentBoardIndex, allUserInputs, allCandidates, pushState])

  // Use hint to reveal correct value for a random unfilled cell
  const useHint = useCallback(() => {
    if (!currentBoard) return false

    const currentInputs = allUserInputs[currentBoardIndex] ?? []

    const currentCands = allCandidates[currentBoardIndex] ?? []

    // Find all unfilled cells
    const unfilledCells: number[] = []

    for (let i = 0; i < 81; i++) {
      if (currentBoard.mission[i] === '0' && !currentInputs[i]) {
        unfilledCells.push(i)
      }
    }

    if (unfilledCells.length === 0) return false

    const randomIndex = Math.floor(Math.random() * unfilledCells.length)

    const cellToHint = unfilledCells[randomIndex]

    const correctValue = currentBoard.solution[cellToHint]

    // Compute new state
    const newInputs = [...currentInputs]

    newInputs[cellToHint] = correctValue

    const newCands = currentCands.map((s, i) =>
      i === cellToHint ? new Set<number>() : s
    )

    // Push NEW state to history
    pushState({
      userInputs: newInputs,
      candidates: candidatesToArrays(newCands)
    })

    // Update React state
    setAllUserInputs(prev => {
      const inputs = [...prev]

      inputs[currentBoardIndex] = newInputs

      return inputs
    })

    setAllCandidates(prev => {
      const cands = [...prev]

      cands[currentBoardIndex] = newCands

      return cands
    })

    setSelectedCell(cellToHint)
    setHintsUsed(prev => prev + 1)

    return true
  }, [currentBoard, currentBoardIndex, allUserInputs, allCandidates, pushState])

  const handleInputChange = useCallback(
    (index: number, value: string) => {
      const currentInputs =
        allUserInputs[currentBoardIndex] ?? Array(81).fill('')

      const currentCands =
        allCandidates[currentBoardIndex] ??
        Array(81)
          .fill(null)
          .map(() => new Set<number>())

      // Compute new inputs
      const newInputs = [...currentInputs]

      newInputs[index] = value

      // Compute new candidates (clear candidates in same row/col/box if entering a number)
      let newCands = [...currentCands]

      if (value) {
        const numValue = Number(value)

        const row = Math.floor(index / 9)

        const col = index % 9

        const boxRow = Math.floor(row / 3) * 3

        const boxCol = Math.floor(col / 3) * 3

        newCands = currentCands.map((cellCandidates, cellIndex) => {
          const cellRow = Math.floor(cellIndex / 9)

          const cellCol = cellIndex % 9

          const cellBoxRow = Math.floor(cellRow / 3) * 3

          const cellBoxCol = Math.floor(cellCol / 3) * 3

          if (cellIndex === index) {
            return new Set<number>()
          }

          const inSameRow = cellRow === row

          const inSameCol = cellCol === col

          const inSameBox = cellBoxRow === boxRow && cellBoxCol === boxCol

          if (inSameRow || inSameCol || inSameBox) {
            const updatedCandidates = new Set(cellCandidates)

            updatedCandidates.delete(numValue)

            return updatedCandidates
          }

          return cellCandidates
        })
      }

      // Push NEW state to history
      pushState({
        userInputs: newInputs,
        candidates: candidatesToArrays(newCands)
      })

      // Update React state
      setAllUserInputs(prev => {
        const inputs = [...prev]

        inputs[currentBoardIndex] = newInputs

        return inputs
      })

      setAllCandidates(prev => {
        const cands = [...prev]

        cands[currentBoardIndex] = newCands

        return cands
      })
    },
    [currentBoardIndex, allUserInputs, allCandidates, pushState]
  )

  const handleCandidateToggle = useCallback(
    (index: number, value: number) => {
      const currentInputs =
        allUserInputs[currentBoardIndex] ?? Array(81).fill('')

      const currentCands =
        allCandidates[currentBoardIndex] ??
        Array(81)
          .fill(null)
          .map(() => new Set<number>())

      // Compute new candidates
      const newCands = [...currentCands]

      const cellCandidates = new Set(newCands[index])

      if (cellCandidates.has(value)) {
        cellCandidates.delete(value)
      } else {
        cellCandidates.add(value)
      }
      newCands[index] = cellCandidates

      // Push NEW state to history
      pushState({
        userInputs: currentInputs,
        candidates: candidatesToArrays(newCands)
      })

      // Update React state
      setAllCandidates(prev => {
        const cands = [...prev]

        cands[currentBoardIndex] = newCands

        return cands
      })
    },
    [currentBoardIndex, allUserInputs, allCandidates, pushState]
  )

  const handleClearCell = useCallback(
    (index: number) => {
      const currentInputs =
        allUserInputs[currentBoardIndex] ?? Array(81).fill('')

      const currentCands =
        allCandidates[currentBoardIndex] ??
        Array(81)
          .fill(null)
          .map(() => new Set<number>())

      // Compute new state
      const newInputs = [...currentInputs]

      newInputs[index] = ''

      const newCands = [...currentCands]

      newCands[index] = new Set()

      // Push NEW state to history
      pushState({
        userInputs: newInputs,
        candidates: candidatesToArrays(newCands)
      })

      // Update React state
      setAllUserInputs(prev => {
        const inputs = [...prev]

        inputs[currentBoardIndex] = newInputs

        return inputs
      })

      setAllCandidates(prev => {
        const cands = [...prev]

        cands[currentBoardIndex] = newCands

        return cands
      })
    },
    [currentBoardIndex, allUserInputs, allCandidates, pushState]
  )

  const value: BoardStateContextType = {
    allUserInputs,
    allCandidates,
    userInputs,
    candidates,
    selectedCell,
    highlightedNumber,
    isBoardCompleted,
    hintsUsed,
    canUndo,
    canRedo,
    setSelectedCell,
    handleInputChange,
    handleCandidateToggle,
    handleClearCell,
    useHint,
    smartFillCandidates,
    undo,
    redo,
    initializeFromSession,
    resetCurrentBoard
  }

  return <BoardStateContext value={value}>{children}</BoardStateContext>
}
