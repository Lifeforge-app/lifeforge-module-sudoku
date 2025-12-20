import { memo } from 'react'

function GridDividers() {
  return (
    <>
      <div className="pointer-events-none absolute top-0 left-0 flex size-full justify-evenly">
        <div className="bg-bg-500 h-full w-px sm:w-[2px]" />
        <div className="bg-bg-500 h-full w-px sm:w-[2px]" />
      </div>
      <div className="pointer-events-none absolute top-0 left-0 flex size-full flex-col justify-evenly">
        <div className="bg-bg-500 h-px w-full sm:h-[2px]" />
        <div className="bg-bg-500 h-px w-full sm:h-[2px]" />
      </div>
    </>
  )
}

export default memo(GridDividers)
