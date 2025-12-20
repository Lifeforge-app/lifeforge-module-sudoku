/* eslint-disable react-compiler/react-compiler */
import { useInputMode } from '@/pages/Play/providers'
import { ViewModeSelector } from 'lifeforge-ui'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import NumberGrid from '../../../components/NumberGrid'

function NumberButtons() {
  const { t } = useTranslation('apps.sudoku')

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
        className="component-bg-lighter w-full"
        currentMode={isCandidate ? 'candidate' : 'normal'}
        options={modeOptions}
        onModeChange={handleModeChange}
      />

      <NumberGrid showDeleteButton size="sm" />
    </div>
  )
}

export default NumberButtons
