import {
  type ReactNode,
  type RefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

const TIMER_INTERVAL_MS = 1000 // 1 second

interface TimerContextType {
  allDurationsElapsed: number[]
  allDurationsRef: RefObject<number[]>
  currentElapsedTimeRef: RefObject<number>
  elapsedTime: number
  setAllDurationsElapsed: (durations: number[]) => void
  initializeTimers: (durations: number[], currentIndex: number) => void
  resetCurrentTimer: () => void
  switchBoard: (fromIndex: number, toIndex: number) => void
}

const TimerContext = createContext<TimerContextType | null>(null)

interface TimerProviderProps {
  children: ReactNode
  currentBoardIndex: number
  isInitialized: boolean
  isBoardCompleted: boolean
}

export function TimerProvider({
  children,
  currentBoardIndex,
  isInitialized,
  isBoardCompleted
}: TimerProviderProps) {
  const [allDurationsElapsed, setAllDurationsElapsed] = useState<number[]>([])

  const allDurationsRef = useRef<number[]>([])

  const currentElapsedTimeRef = useRef(0)

  const elapsedTime = allDurationsElapsed[currentBoardIndex] || 0

  const initializeTimers = useCallback(
    (durations: number[], currentIndex: number) => {
      setAllDurationsElapsed(durations)
      allDurationsRef.current = [...durations]
      currentElapsedTimeRef.current = durations[currentIndex] || 0
    },
    []
  )

  const resetCurrentTimer = useCallback(() => {
    allDurationsRef.current[currentBoardIndex] = 0
    setAllDurationsElapsed([...allDurationsRef.current])
    currentElapsedTimeRef.current = 0
  }, [currentBoardIndex])

  const switchBoard = useCallback((fromIndex: number, toIndex: number) => {
    // Save current board's elapsed time to ref before switching
    allDurationsRef.current[fromIndex] = currentElapsedTimeRef.current
    // Update state to match
    setAllDurationsElapsed([...allDurationsRef.current])
    // Load new board's elapsed time from ref
    currentElapsedTimeRef.current = allDurationsRef.current[toIndex] || 0
  }, [])

  // Timer interval - increment every second, pause when completed
  useEffect(() => {
    if (!isInitialized || isBoardCompleted) return

    const intervalId = setInterval(() => {
      currentElapsedTimeRef.current += 1
      allDurationsRef.current[currentBoardIndex] = currentElapsedTimeRef.current
      setAllDurationsElapsed([...allDurationsRef.current])
    }, TIMER_INTERVAL_MS)

    return () => clearInterval(intervalId)
  }, [isInitialized, isBoardCompleted, currentBoardIndex])

  const value: TimerContextType = {
    allDurationsElapsed,
    allDurationsRef,
    currentElapsedTimeRef,
    elapsedTime,
    setAllDurationsElapsed,
    initializeTimers,
    resetCurrentTimer,
    switchBoard
  }

  return <TimerContext value={value}>{children}</TimerContext>
}

export function useTimer() {
  const context = useContext(TimerContext)

  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider')
  }

  return context
}
