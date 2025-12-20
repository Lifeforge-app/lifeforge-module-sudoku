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

import { useBoardState } from './BoardStateProvider'
import { useSession } from './SessionProvider'

const TIMER_INTERVAL_MS = 1000 // 1 second

interface TimerContextType {
  allDurationsElapsed: number[]
  allDurationsRef: RefObject<number[]>
  currentElapsedTimeRef: RefObject<number>
  elapsedTime: number
  isPaused: boolean
  setAllDurationsElapsed: (durations: number[]) => void
  initializeTimers: (durations: number[], currentIndex: number) => void
  resetCurrentTimer: () => void
  switchBoard: (fromIndex: number, toIndex: number) => void
  togglePause: () => void
}

const TimerContext = createContext<TimerContextType | null>(null)

interface TimerProviderProps {
  children: ReactNode
}

export function TimerProvider({ children }: TimerProviderProps) {
  const { currentBoardIndex, isInitialized } = useSession()

  const { isBoardCompleted } = useBoardState()

  const [allDurationsElapsed, setAllDurationsElapsed] = useState<number[]>([])

  const [isPaused, setIsPaused] = useState(false)

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

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev)
  }, [])

  // Timer interval - increment every second, pause when completed or paused
  useEffect(() => {
    if (!isInitialized || isBoardCompleted || isPaused) return

    const intervalId = setInterval(() => {
      currentElapsedTimeRef.current += 1
      allDurationsRef.current[currentBoardIndex] = currentElapsedTimeRef.current
      setAllDurationsElapsed([...allDurationsRef.current])
    }, TIMER_INTERVAL_MS)

    return () => clearInterval(intervalId)
  }, [isInitialized, isBoardCompleted, isPaused, currentBoardIndex])

  const value: TimerContextType = {
    allDurationsElapsed,
    allDurationsRef,
    currentElapsedTimeRef,
    elapsedTime,
    isPaused,
    setAllDurationsElapsed,
    initializeTimers,
    resetCurrentTimer,
    switchBoard,
    togglePause
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
