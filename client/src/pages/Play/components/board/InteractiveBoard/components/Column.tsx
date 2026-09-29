import { memo } from 'react'

import { Bordered, Grid } from '@lifeforge/ui'

import {
  BOX_BORDERS,
  GRID_INDICES,
  getCellIndex
} from '../../../../../../constants/constants'
import Cell from './Cell'

interface ColumnProps {
  col: number
  onKeyDown: (e: React.KeyboardEvent, cellIndex: number) => void
}

function Column({ col, onKeyDown }: ColumnProps) {
  return (
    <Bordered
      asChild
      borderColor={{ base: 'bg-300', dark: 'bg-700' }}
      borderSide={!BOX_BORDERS.has(col) ? 'right' : 'none'}
    >
      <Grid height="100%" templateRows={9} width="100%">
        {GRID_INDICES.map(row => {
          const cellIndex = getCellIndex(row, col)

          return <Cell key={row} cellIndex={cellIndex} onKeyDown={onKeyDown} />
        })}
      </Grid>
    </Bordered>
  )
}

export default memo(Column)
