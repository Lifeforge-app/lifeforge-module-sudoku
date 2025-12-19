import type { SudokuBoard } from '@'
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react'

interface BoardStateContextType {
  allUserInputs: string[][]
  allCandidates: Set<number>[][]
  userInputs: string[]
  candidates: Set<number>[]
  selectedCell: number | null
  highlightedNumber: string | null
  isBoardCompleted: boolean
  setSelectedCell: (index: number | null) => void
  handleInputChange: (index: number, value: string) => void
  handleCandidateToggle: (index: number, value: number) => void
  handleClearCell: (index: number) => void
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

interface BoardStateProviderProps {
  children: ReactNode
  currentBoardIndex: number
  currentBoard: SudokuBoard | undefined
}

export function BoardStateProvider({
  children,
  currentBoardIndex,
  currentBoard
}: BoardStateProviderProps) {
  const [allUserInputs, setAllUserInputs] = useState<string[][]>([])

  const [allCandidates, setAllCandidates] = useState<Set<number>[][]>([])

  const [selectedCell, setSelectedCell] = useState<number | null>(null)

  const userInputs = allUserInputs[currentBoardIndex] ?? []

  const candidates = allCandidates[currentBoardIndex] ?? []

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
      setAllUserInputs(
        entries.map(
          entry => (entry.user_answers as string[]) || Array(81).fill('')
        )
      )
      setAllCandidates(
        entries.map(entry => {
          const cands =
            (entry.user_candidates as number[][]) || Array(81).fill([])

          return cands.map(cell => new Set(cell))
        })
      )
    },
    []
  )

  const resetCurrentBoard = useCallback(() => {
    setAllUserInputs(prev => {
      const newInputs = [...prev]

      newInputs[currentBoardIndex] = Array(81).fill('')

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
  }, [currentBoardIndex])

  const handleInputChange = useCallback(
    (index: number, value: string) => {
      setAllUserInputs(prev => {
        const newInputs = [...prev]

        newInputs[currentBoardIndex] = [...newInputs[currentBoardIndex]]
        newInputs[currentBoardIndex][index] = value

        return newInputs
      })

      if (value) {
        const numValue = Number(value)

        const row = Math.floor(index / 9)

        const col = index % 9

        const boxRow = Math.floor(row / 3) * 3

        const boxCol = Math.floor(col / 3) * 3

        setAllCandidates(prev => {
          const newCandidates = [...prev]

          newCandidates[currentBoardIndex] = newCandidates[
            currentBoardIndex
          ].map((cellCandidates, cellIndex) => {
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

          return newCandidates
        })
      }
    },
    [currentBoardIndex]
  )

  const handleCandidateToggle = useCallback(
    (index: number, value: number) => {
      setAllCandidates(prev => {
        const newCandidates = [...prev]

        newCandidates[currentBoardIndex] = [...newCandidates[currentBoardIndex]]

        const cellCandidates = new Set(newCandidates[currentBoardIndex][index])

        if (cellCandidates.has(value)) {
          cellCandidates.delete(value)
        } else {
          cellCandidates.add(value)
        }
        newCandidates[currentBoardIndex][index] = cellCandidates

        return newCandidates
      })
    },
    [currentBoardIndex]
  )

  const handleClearCell = useCallback(
    (index: number) => {
      setAllUserInputs(prev => {
        const newInputs = [...prev]

        newInputs[currentBoardIndex] = [...newInputs[currentBoardIndex]]
        newInputs[currentBoardIndex][index] = ''

        return newInputs
      })
      setAllCandidates(prev => {
        const newCandidates = [...prev]

        newCandidates[currentBoardIndex] = [...newCandidates[currentBoardIndex]]
        newCandidates[currentBoardIndex][index] = new Set()

        return newCandidates
      })
    },
    [currentBoardIndex]
  )

  const value: BoardStateContextType = {
    allUserInputs,
    allCandidates,
    userInputs,
    candidates,
    selectedCell,
    highlightedNumber,
    isBoardCompleted,
    setSelectedCell,
    handleInputChange,
    handleCandidateToggle,
    handleClearCell,
    initializeFromSession,
    resetCurrentBoard
  }

  return (
    <BoardStateContext.Provider value={value}>
      {children}
    </BoardStateContext.Provider>
  )
}
