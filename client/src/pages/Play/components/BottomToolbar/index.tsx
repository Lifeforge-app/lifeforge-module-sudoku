import ActionButtons from './components/ActionButtons'
import NumberButtons from './components/NumberButtons'

function BottomToolbar() {
  return (
    <div className="bg-bg-100/80 flex-between dark:bg-bg-800/80 border-bg-200 dark:border-bg-700 mt-4 w-full rounded-xl border p-4 shadow-lg backdrop-blur-sm">
      <ActionButtons />
      <NumberButtons />
    </div>
  )
}

export default BottomToolbar
