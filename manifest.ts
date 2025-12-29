import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Sudoku',
  icon: 'uil:table',
  routes: {
    '/': lazy(() => import('@')),
    '/play/:sessionId': lazy(() => import('@/pages/Play')),
    '/print/:sessionId': lazy(() => import('@/pages/Print'))
  },
  category: 'Utilities'
} satisfies ModuleConfig
