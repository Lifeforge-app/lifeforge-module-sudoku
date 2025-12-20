import { Card, ViewModeSelector } from 'lifeforge-ui'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useInputMode } from '../../../providers'
import NumberGrid from '../components/NumberGrid'

function RightToolbar() {
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
    <Card className="flex flex-col gap-3">
      <ViewModeSelector
        className="component-bg-lighter bg-bg-100!"
        currentMode={isCandidate ? 'candidate' : 'normal'}
        options={modeOptions}
        onModeChange={handleModeChange}
      />

      <NumberGrid showDeleteButton />
    </Card>
  )
}

export default RightToolbar
