import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  routes: {
    '/': lazy(() => import('@')),
    '/play/:sessionId': lazy(() => import('@/pages/Play')),
    '/print/:sessionId': lazy(() => import('@/pages/Print'))
  },
} satisfies ModuleConfig
