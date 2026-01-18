import { forgeRouter } from '@lifeforge/server-utils'
import z from 'zod'

import forge from './forge'
import * as sessionsRoutes from './routes/sessions'

const generateBoard = forge
  .query()
  .description('Generate Sudoku boards from external API')
  .input({
    query: z.object({
      difficulty: z.enum([
        'easy',
        'medium',
        'hard',
        'expert',
        'evil',
        'extreme'
      ]),
      count: z
        .string()
        .optional()
        .default('6')
        .transform(val => parseInt(val, 10) || 6)
    })
  })
  .callback(async ({ query: { difficulty, count } }) => {
    const boards: {
      id: number
      mission: string
      solution: string
      win_rate: number
    }[] = []

    for (let i = 0; i < count; i++) {
      await fetch(`https://sudoku.com/api/v2/level/${difficulty}`, {
        method: 'GET',
        headers: {
          'x-easy-locale': 'en',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).then(async r => {
        await r
          .json()
          .then(data => {
            boards.push(data)
          })
          .catch(e => {
            throw new Error('Failed to parse response: ' + e.message)
          })
      })
    }

    return boards
  })

export default forgeRouter({ generateBoard, sessions: sessionsRoutes })
