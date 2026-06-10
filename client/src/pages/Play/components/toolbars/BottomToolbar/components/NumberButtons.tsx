/* eslint-disable react-compiler/react-compiler */
import { useMemo } from 'react'
import { useModuleTranslation } from '@lifeforge/localization'

import { ViewModeSelector } from '@lifeforge/ui'

import { useInputMode } from '@/pages/Play/providers'

import NumberGrid from '../../components/NumberGrid'

function NumberButtons() {
  const { t } = useModuleTranslation()

  const { isCandidate, setIsCandidate, isCandidateModeLockedRef } =
    useInputMode()

  const modeOptions = useMemo(
    () =>
      [
        { value: 'normal', icon: 'tabler:pencil', text: t('buttons.normal') },
        {
          value: 'candidate',
          icon: 'tabler:notes',
          text: t('buttons.candidate')
        }
      ] as const,
    [t]
  )

  const handleModeChange = (value: 'normal' | 'candidate') => {
    if (value === 'candidate') {
      isCandidateModeLockedRef.current = true
      setIsCandidate(true)
    } else {
      isCandidateModeLockedRef.current = false
      setIsCandidate(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <ViewModeSelector
        className="component-bg-lighter bg-bg-100! w-full"
        currentMode={isCandidate ? 'candidate' : 'normal'}
        options={modeOptions}
        onModeChange={handleModeChange}
      />

      <NumberGrid showDeleteButton size="sm" />
    </div>
  )
}

export default NumberButtons
