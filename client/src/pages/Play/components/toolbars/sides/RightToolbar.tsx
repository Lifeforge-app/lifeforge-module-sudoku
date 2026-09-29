import { Card, createViewMode, surface } from '@lifeforge/ui'

import { useInputMode } from '../../../providers'
import NumberGrid from '../components/NumberGrid'

const CandidateMode = createViewMode({
  modes: [
    { value: 'normal', icon: 'tabler:pencil', text: 'buttons.normal' },
    { value: 'candidate', icon: 'tabler:notes', text: 'buttons.candidate' }
  ],
  namespace: 'apps.sudoku',
  persistInLocalStorage: false,
  useNuqs: false,
  defaultValue: 'normal'
})

function RightToolbar() {
  const { isCandidate, setIsCandidate, isCandidateModeLockedRef } =
    useInputMode()

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
    <Card direction="column" gap="sm">
      <CandidateMode.Root
        currentMode={isCandidate ? 'candidate' : 'normal'}
        onModeChange={handleModeChange}
      >
        <CandidateMode.Selector bg={surface.light} />
      </CandidateMode.Root>

      <NumberGrid showDeleteButton />
    </Card>
  )
}

export default RightToolbar
