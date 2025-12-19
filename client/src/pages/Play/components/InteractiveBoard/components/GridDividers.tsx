import { memo } from 'react'

function GridDividers() {
  return (
    <>
      <div className="pointer-events-none absolute top-0 left-0 flex size-full justify-evenly">
        <div className="bg-bg-800 dark:bg-bg-100 h-full w-[2px]" />
        <div className="bg-bg-800 dark:bg-bg-100 h-full w-[2px]" />
      </div>
      <div className="pointer-events-none absolute top-0 left-0 flex size-full flex-col justify-evenly">
        <div className="bg-bg-800 dark:bg-bg-100 h-[2px] w-full" />
        <div className="bg-bg-800 dark:bg-bg-100 h-[2px] w-full" />
      </div>
    </>
  )
}

export default memo(GridDividers)
