import z from 'zod'

import { forgeController, forgeRouter } from '@functions/routes'

// List all sessions with summary info
const list = forgeController
  .query()
  .description({
    en: 'List all Sudoku sessions',
    ms: 'Senarai semua sesi Sudoku',
    'zh-CN': '列出所有数独会话',
    'zh-TW': '列出所有數獨會話'
  })
  .input({
    query: z.object({
      difficulty: z.string().optional()
    })
  })
  .callback(async ({ pb, query: { difficulty } }) => {
    // Fetch all entries with expanded session data in a single query
    const allEntries = await pb.getFullList
      .collection('sudoku__entries')
      .expand({
        session: 'sudoku__sessions'
      })
      .sort(['session', 'index'])
      .execute()

    // Group entries by session
    const entriesBySession = new Map<
      string,
      {
        session: {
          id: string
          current_board_index: number
          created: string
          updated: string
        }
        entries: typeof allEntries
      }
    >()

    for (const entry of allEntries) {
      const session = entry.expand?.session

      if (!session) continue

      if (!entriesBySession.has(session.id)) {
        entriesBySession.set(session.id, {
          session: {
            id: session.id,
            current_board_index: session.current_board_index,
            created: session.created,
            updated: session.updated
          },
          entries: []
        })
      }
      entriesBySession.get(session.id)!.entries.push(entry)
    }

    // Build session info from grouped entries
    const sessionsWithInfo = Array.from(entriesBySession.values())
      .map(({ session, entries }) => {
        const firstEntry = entries[0]

        // Calculate progress (how many cells are filled correctly)
        let totalCells = 0
        let filledCells = 0
        let correctCells = 0

        for (const entry of entries) {
          const board = entry.board as { mission: string; solution: string }

          const userAnswers = (entry.user_answers as string[]) || []

          for (let i = 0; i < 81; i++) {
            if (board.mission[i] === '0') {
              totalCells++

              if (userAnswers[i]) {
                filledCells++

                if (userAnswers[i] === board.solution[i]) {
                  correctCells++
                }
              }
            }
          }
        }

        return {
          id: session.id,
          difficulty: firstEntry?.difficulty || 'unknown',
          boardCount: entries.length,
          currentBoardIndex: session.current_board_index,
          progress: {
            total: totalCells,
            filled: filledCells,
            correct: correctCells
          },
          totalDuration: entries.reduce(
            (sum, entry) => sum + ((entry.duration_elapsed as number) || 0),
            0
          ),
          created: session.created,
          updated: session.updated
        }
      })
      // Sort by updated descending (most recent first)
      .sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
      )

    // Filter by difficulty if specified
    if (difficulty) {
      return sessionsWithInfo.filter(s => s.difficulty === difficulty)
    }

    return sessionsWithInfo
  })

// Get a single session with all entries
const get = forgeController
  .query()
  .description({
    en: 'Get a specific Sudoku session',
    ms: 'Dapatkan sesi Sudoku tertentu',
    'zh-CN': '获取特定数独会话',
    'zh-TW': '獲取特定數獨會話'
  })
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'sudoku__sessions'
  })
  .callback(async ({ pb, query: { id } }) => {
    const session = await pb.getOne
      .collection('sudoku__sessions')
      .id(id)
      .execute()

    const entries = await pb.getFullList
      .collection('sudoku__entries')
      .filter([{ field: 'session', operator: '=', value: id }])
      .sort(['index'])
      .execute()

    return {
      session,
      entries
    }
  })

// Get active session with all entries
const getActive = forgeController
  .query()
  .description({
    en: 'Get the active Sudoku session',
    ms: 'Dapatkan sesi Sudoku aktif',
    'zh-CN': '获取当前数独会话',
    'zh-TW': '獲取當前數獨會話'
  })
  .input({})
  .callback(async ({ pb }) => {
    // Get the most recent session
    const sessions = await pb.getFullList
      .collection('sudoku__sessions')
      .sort(['-updated'])
      .execute()

    if (sessions.length === 0) {
      return null
    }

    const session = sessions[0]

    // Get all entries for this session
    const entries = await pb.getFullList
      .collection('sudoku__entries')
      .filter([{ field: 'session', operator: '=', value: session.id }])
      .sort(['index'])
      .execute()

    return {
      session,
      entries
    }
  })

// Create a new session
const create = forgeController
  .mutation()
  .description({
    en: 'Create a new Sudoku session',
    ms: 'Cipta sesi Sudoku baharu',
    'zh-CN': '创建新数独会话',
    'zh-TW': '創建新數獨會話'
  })
  .input({
    body: z.object({
      difficulty: z.enum([
        'easy',
        'medium',
        'hard',
        'expert',
        'evil',
        'extreme'
      ]),
      boardCount: z.number().min(1).max(6)
    })
  })
  .callback(async ({ pb, body: { difficulty, boardCount } }) => {
    // Fetch boards from external API
    const boards: {
      id: number
      mission: string
      solution: string
      win_rate: number
    }[] = []

    for (let i = 0; i < boardCount; i++) {
      const response = await fetch(
        `https://sudoku.com/api/v2/level/${difficulty}`,
        {
          method: 'GET',
          headers: {
            'x-easy-locale': 'en',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      )

      const data = await response.json()

      boards.push(data)
    }

    // Create session
    const session = await pb.create
      .collection('sudoku__sessions')
      .data({ current_board_index: 0 })
      .execute()

    // Create entries for each board
    await Promise.all(
      boards.map((board, index) =>
        pb.create
          .collection('sudoku__entries')
          .data({
            session: session.id,
            index,
            difficulty,
            board,
            user_answers: Array(81).fill(''),
            user_candidates: Array(81).fill([]),
            duration_elapsed: 0
          })
          .execute()
      )
    )

    return { sessionId: session.id, boards }
  })

// Save or update session
const save = forgeController
  .mutation()
  .description({
    en: 'Save Sudoku session progress',
    ms: 'Simpan kemajuan sesi Sudoku',
    'zh-CN': '保存数独会话进度',
    'zh-TW': '保存數獨會話進度'
  })
  .input({
    body: z.object({
      sessionId: z.string().optional(),
      currentBoardIndex: z.number(),
      difficulty: z.string(),
      boards: z.array(
        z.object({
          id: z.number(),
          mission: z.string(),
          solution: z.string(),
          win_rate: z.number()
        })
      ),
      userInputs: z.array(z.array(z.string())),
      candidates: z.array(z.array(z.array(z.number()))),
      durationsElapsed: z.array(z.number()).optional().default([])
    })
  })
  .callback(
    async ({
      pb,
      body: {
        sessionId,
        currentBoardIndex,
        difficulty,
        boards,
        userInputs,
        candidates,
        durationsElapsed
      }
    }) => {
      let session: { id: string }

      if (sessionId) {
        // Update existing session
        session = await pb.update
          .collection('sudoku__sessions')
          .id(sessionId)
          .data({ current_board_index: currentBoardIndex })
          .execute()

        // Update entries
        const existingEntries = await pb.getFullList
          .collection('sudoku__entries')
          .filter([{ field: 'session', operator: '=', value: sessionId }])
          .sort(['index'])
          .execute()

        await Promise.all(
          boards.map(async (board, index) => {
            const existingEntry = existingEntries.find(e => e.index === index)

            if (existingEntry) {
              return pb.update
                .collection('sudoku__entries')
                .id(existingEntry.id)
                .data({
                  user_answers: userInputs[index],
                  user_candidates: candidates[index],
                  duration_elapsed: durationsElapsed[index] ?? 0
                })
                .execute()
            } else {
              return pb.create
                .collection('sudoku__entries')
                .data({
                  session: sessionId,
                  index,
                  difficulty,
                  board,
                  user_answers: userInputs[index],
                  user_candidates: candidates[index],
                  duration_elapsed: durationsElapsed[index] ?? 0
                })
                .execute()
            }
          })
        )
      } else {
        // Create new session
        session = await pb.create
          .collection('sudoku__sessions')
          .data({ current_board_index: currentBoardIndex })
          .execute()

        // Create entries for each board
        await Promise.all(
          boards.map((board, index) =>
            pb.create
              .collection('sudoku__entries')
              .data({
                session: session.id,
                index,
                difficulty,
                board,
                user_answers: userInputs[index],
                user_candidates: candidates[index],
                duration_elapsed: durationsElapsed[index] ?? 0
              })
              .execute()
          )
        )
      }

      return { sessionId: session.id }
    }
  )

// Clear/delete session
const remove = forgeController
  .mutation()
  .description({
    en: 'Delete Sudoku session',
    ms: 'Padam sesi Sudoku',
    'zh-CN': '删除数独会话',
    'zh-TW': '刪除數獨會話'
  })
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'sudoku__sessions'
  })
  .statusCode(204)
  .callback(async ({ pb, query: { id } }) => {
    // Delete all entries for this session first
    const entries = await pb.getFullList
      .collection('sudoku__entries')
      .filter([{ field: 'session', operator: '=', value: id }])
      .execute()

    await Promise.all(
      entries.map(entry =>
        pb.delete.collection('sudoku__entries').id(entry.id).execute()
      )
    )

    // Delete the session
    await pb.delete.collection('sudoku__sessions').id(id).execute()
  })

// Mark a board entry as completed
const markComplete = forgeController
  .mutation()
  .description({
    en: 'Mark a Sudoku board as completed',
    ms: 'Tandai papan Sudoku sebagai selesai',
    'zh-CN': '将数独棋盘标记为已完成',
    'zh-TW': '將數獨棋盤標記為已完成'
  })
  .input({
    body: z.object({
      sessionId: z.string(),
      boardIndex: z.number()
    })
  })
  .callback(async ({ pb, body: { sessionId, boardIndex } }) => {
    const entries = await pb.getFullList
      .collection('sudoku__entries')
      .filter([
        { field: 'session', operator: '=', value: sessionId },
        { field: 'index', operator: '=', value: boardIndex }
      ])
      .execute()

    if (entries.length === 0) {
      throw new Error('Board entry not found')
    }

    await pb.update
      .collection('sudoku__entries')
      .id(entries[0].id)
      .data({ is_completed: true })
      .execute()

    return { success: true }
  })

// Reset a board to initial state
const resetBoard = forgeController
  .mutation()
  .description({
    en: 'Reset a Sudoku board to initial state',
    ms: 'Set semula papan Sudoku kepada keadaan asal',
    'zh-CN': '将数独棋盘重置为初始状态',
    'zh-TW': '將數獨棋盤重置為初始狀態'
  })
  .input({
    body: z.object({
      sessionId: z.string(),
      boardIndex: z.number()
    })
  })
  .callback(async ({ pb, body: { sessionId, boardIndex } }) => {
    const entries = await pb.getFullList
      .collection('sudoku__entries')
      .filter([
        { field: 'session', operator: '=', value: sessionId },
        { field: 'index', operator: '=', value: boardIndex }
      ])
      .execute()

    if (entries.length === 0) {
      throw new Error('Board entry not found')
    }

    await pb.update
      .collection('sudoku__entries')
      .id(entries[0].id)
      .data({
        user_answers: Array(81).fill(''),
        user_candidates: Array(81).fill([]),
        is_completed: false
      })
      .execute()

    return { success: true }
  })

export default forgeRouter({
  list,
  get,
  getActive,
  create,
  save,
  remove,
  markComplete,
  resetBoard
})
