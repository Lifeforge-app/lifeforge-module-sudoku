import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Sudoku',
  icon: 'uil:table',
  routes: {
    '/': lazy(() => import('@'))
  },
  category: 'Utilities'
} satisfies ModuleConfig
