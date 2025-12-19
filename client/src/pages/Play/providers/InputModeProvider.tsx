import {
  type ReactNode,
  type RefObject,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

interface InputModeContextType {
  isCandidate: boolean
  setIsCandidate: (value: boolean) => void
  isCandidateModeLockedRef: RefObject<boolean>
}

const InputModeContext = createContext<InputModeContextType | null>(null)

interface InputModeProviderProps {
  children: ReactNode
  onSyncToDB: () => void
}

export function InputModeProvider({
  children,
  onSyncToDB
}: InputModeProviderProps) {
  const [isCandidate, setIsCandidate] = useState(false)

  const isCandidateModeLockedRef = useRef(false)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        onSyncToDB()

        return
      }

      // Prevent Cmd/Ctrl + number from switching browser tabs
      if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '9') {
        e.preventDefault()
      }

      if ((e.ctrlKey || e.metaKey) && !isCandidateModeLockedRef.current) {
        setIsCandidate(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        (e.key === 'Control' || e.key === 'Meta') &&
        !isCandidateModeLockedRef.current
      ) {
        setIsCandidate(false)
      }
    }

    // Prevent context menu when ctrl+click (used for candidate mode)
    const handleContextMenu = (e: MouseEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('contextmenu', handleContextMenu)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [onSyncToDB])

  const value: InputModeContextType = {
    isCandidate,
    setIsCandidate,
    isCandidateModeLockedRef
  }

  return <InputModeContext value={value}>{children}</InputModeContext>
}

export function useInputMode() {
  const context = useContext(InputModeContext)

  if (!context) {
    throw new Error('useInputMode must be used within an InputModeProvider')
  }

  return context
}
