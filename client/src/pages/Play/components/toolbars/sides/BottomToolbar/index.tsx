import { Card } from 'lifeforge-ui'

import ActionButtons from './components/ActionButtons'
import NumberButtons from './components/NumberButtons'

function BottomToolbar() {
  return (
    <Card className="mt-4 flex w-full flex-col gap-4 rounded-xl border shadow-lg backdrop-blur-sm lg:mt-0 lg:w-auto lg:gap-6">
      <NumberButtons />
      <ActionButtons />
    </Card>
  )
}

export default BottomToolbar
