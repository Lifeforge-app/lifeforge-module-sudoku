import { type ReactNode, createContext, useContext, useState } from 'react'

interface SettingsContextType {
  autoCheckMode: boolean
  setAutoCheckMode: (value: boolean) => void
}

const SettingsContext = createContext<SettingsContextType | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [autoCheckMode, setAutoCheckMode] = useState(false)

  const value: SettingsContextType = {
    autoCheckMode,
    setAutoCheckMode
  }

  return <SettingsContext value={value}>{children}</SettingsContext>
}

export function useSettings() {
  const context = useContext(SettingsContext)

  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }

  return context
}
