import { Bordered, Card } from '@lifeforge/ui'

import ActionButtons from './components/ActionButtons'
import NumberButtons from './components/NumberButtons'

function BottomToolbar() {
  return (
    <Bordered asChild>
      <Card
        gap={{ base: 'md', lg: 'lg' }}
        mt={{ base: 'md', lg: 'none' }}
        r="xl"
        style={{ backdropFilter: 'blur(4px)' }}
        width={{ base: '100%', lg: 'auto' }}
      >
        <NumberButtons />
        <ActionButtons />
      </Card>
    </Bordered>
  )
}

export default BottomToolbar
