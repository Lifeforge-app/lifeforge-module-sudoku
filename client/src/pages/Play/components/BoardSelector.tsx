import { useSession } from '../providers'

interface BoardSelectorProps {
  onBoardSwitch: (index: number) => void
}

function BoardSelector({ onBoardSwitch }: BoardSelectorProps) {
  const { boards, currentBoardIndex } = useSession()

  if (boards.length <= 1) return null

  return (
    <div className="flex-center mt-4 gap-2">
      {boards.map((_, index) => (
        <button
          key={index}
          className={`size-8 rounded-md text-sm font-medium transition-colors ${
            index === currentBoardIndex
              ? 'bg-custom-500 text-bg-50'
              : 'bg-bg-200 dark:bg-bg-700/50 text-bg-500 hover:bg-bg-300 dark:hover:bg-bg-600'
          }`}
          type="button"
          onClick={() => onBoardSwitch(index)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  )
}

export default BoardSelector
