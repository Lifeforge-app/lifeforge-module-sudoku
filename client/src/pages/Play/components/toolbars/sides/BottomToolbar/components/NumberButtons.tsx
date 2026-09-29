/* eslint-disable react-compiler/react-compiler */
import { Flex, createViewMode, surface } from '@lifeforge/ui'

import { useInputMode } from '@/pages/Play/providers'

import NumberGrid from '../../../components/NumberGrid'

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

function NumberButtons() {
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
    <Flex direction="column" gap="sm">
      <CandidateMode.Root
        currentMode={isCandidate ? 'candidate' : 'normal'}
        onModeChange={handleModeChange}
      >
        <CandidateMode.Selector bg={surface.light} width="100%" />
      </CandidateMode.Root>

      <NumberGrid showDeleteButton size="sm" />
    </Flex>
  )
}

export default NumberButtons
