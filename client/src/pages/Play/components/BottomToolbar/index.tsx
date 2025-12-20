import ActionButtons from './components/ActionButtons'
import NumberButtons from './components/NumberButtons'

function BottomToolbar() {
  return (
    <div className="bg-bg-100/80 dark:bg-bg-800/80 border-bg-200 dark:border-bg-700 mt-4 flex w-full flex-col gap-4 rounded-xl border p-3 shadow-lg backdrop-blur-sm sm:p-4 md:flex-row md:items-center md:justify-between">
      <NumberButtons />
      <ActionButtons />
    </div>
  )
}

export default BottomToolbar
