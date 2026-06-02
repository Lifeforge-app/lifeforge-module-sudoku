import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'
import z from 'zod'

import forge from './forge'
import * as sessionsRoutes from './routes/sessions'

const generateBoard = forge
  .query({
    description: 'Generate Sudoku boards from external API',
    input: {
      query: z.object({
        difficulty: z.enum([
          'easy',
          'medium',
          'hard',
          'expert',
          'evil',
          'extreme'
        ]),
        count: z.string().optional().default('6')
      })
    },
    output: {
      OK: z.array(
        z.object({
          id: z.number(),
          mission: z.string(),
          solution: z.string(),
          win_rate: z.number()
        })
      )
    }
  })
  .callback(async ({ query: { difficulty, count }, response }) => {
    const parsedCount = parseInt(count, 10) || 6

    const boards: {
      id: number
      mission: string
      solution: string
      win_rate: number
    }[] = []

    for (let i = 0; i < parsedCount; i++) {
      const res = await fetch(
        `https://sudoku.com/api/v2/level/${difficulty}`,
        {
          method: 'GET',
          headers: {
            'x-easy-locale': 'en',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      )

      const data = await res.json()

      boards.push(data)
    }

    return response.ok(boards)
  })

const routes = forgeRouter({ generateBoard, sessions: sessionsRoutes })

writeContractFileToClient(routes, import.meta.dirname)

export default routes
