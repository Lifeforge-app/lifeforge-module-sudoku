import { lazy } from 'react'

import { createForgeModuleClient } from '@lifeforge/federation'

import contract from './contract'

const { forgeAPI, ...manifest } = createForgeModuleClient({
  routes: {
    '/': lazy(() => import('@')),
    '/play/:sessionId': lazy(() => import('@/pages/Play')),
    '/print/:sessionId': lazy(() => import('@/pages/Print'))
  },
  contract
})

export default manifest

export { forgeAPI }
