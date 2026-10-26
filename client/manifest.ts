import { lazy } from 'react'

import { createForgeModule } from '@lifeforge/federation'

import type { Contract } from './contract'

const { forgeAPI, ...manifest } = createForgeModule<Contract>({
  routes: {
    '/': lazy(() => import('@')),
    '/play/:sessionId': lazy(() => import('@/pages/Play')),
    '/print/:sessionId': lazy(() => import('@/pages/Print'))
  }
})

export default manifest

export { forgeAPI }
