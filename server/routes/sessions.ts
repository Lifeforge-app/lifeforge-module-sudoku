import z from 'zod'

import forge from '../forge'
import sudokuSchemas from '../schema'

const SessionWithInfoSchema = z.object({
  id: z.string(),
  difficulty: z.string(),
  boardCount: z.number(),
  currentBoardIndex: z.number(),
  progress: z.object({
    total: z.number(),
    filled: z.number(),
    correct: z.number()
  }),
  totalDuration: z.number(),
  created: z.string(),
  updated: z.string()
})

const SessionWithEntriesSchema = z.object({
  session: sudokuSchemas.sessions,
  entries: z.array(sudokuSchemas.entries)
})

const StatsResponseSchema = z.object({
  overall: z.object({
    totalBoards: z.number(),
    totalPlayTime: z.number(),
    daysPlayed: z.number()
  }),
  streak: z.object({
    current: z.number(),
    longest: z.number(),
    isActive: z.boolean()
  }),
  byDifficulty: z.array(
    z.object({
      difficulty: z.string(),
      totalBoards: z.number(),
      avgTime: z.number().nullable(),
      bestTime: z.number().nullable(),
      totalTime: z.number(),
      timeDistribution: z.object({
        under2min: z.number(),
        under5min: z.number(),
        under10min: z.number(),
        under20min: z.number(),
        over20min: z.number()
      })
    })
  ),
  completionHistory: z.array(
    z.object({
      month: z.string(),
      completed: z.number(),
      total: z.number(),
      rate: z.number()
    })
  ),
  recentActivity: z.array(
    z.object({
      date: z.string(),
      count: z.number()
    })
  )
})

export const list = forge
  .query({
    description: 'List all Sudoku sessions',
    input: {
      query: z.object({
        difficulty: z.string().optional()
      })
    },
    output: {
      OK: z.array(SessionWithInfoSchema)
    }
  })
  .callback(async ({ pb, query: { difficulty }, response }) => {
    const allEntries = await pb.getFullList
      .collection('entries')
      .expand({
        session: 'sessions'
      })
      .sort(['session', 'index'])
      .execute()

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

    const sessionsWithInfo = Array.from(entriesBySession.values())
      .map(({ session, entries }) => {
        const firstEntry = entries[0]

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
      .sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
      )

    if (difficulty) {
      return response.ok(
        sessionsWithInfo.filter(s => s.difficulty === difficulty)
      )
    }

    return response.ok(sessionsWithInfo)
  })

export const get = forge
  .query({
    description: 'Get a specific Sudoku session',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'sessions' }
    },
    output: {
      OK: SessionWithEntriesSchema,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    const session = await pb.getOne.collection('sessions').id(id).execute()

    const entries = await pb.getFullList
      .collection('entries')
      .filter([{ field: 'session', operator: '=', value: id }])
      .sort(['index'])
      .execute()

    return response.ok({
      session,
      entries
    })
  })

export const getActive = forge
  .query({
    description: 'Get the active Sudoku session',
    output: {
      OK: SessionWithEntriesSchema.nullable()
    }
  })
  .callback(async ({ pb, response }) => {
    const sessions = await pb.getFullList
      .collection('sessions')
      .sort(['-updated'])
      .execute()

    if (sessions.length === 0) {
      return response.ok(null)
    }

    const session = sessions[0]

    const entries = await pb.getFullList
      .collection('entries')
      .filter([{ field: 'session', operator: '=', value: session.id }])
      .sort(['index'])
      .execute()

    return response.ok({
      session,
      entries
    })
  })

export const create = forge
  .mutation({
    description: 'Create a new Sudoku session',
    input: {
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
    },
    output: {
      OK: z.object({
        sessionId: z.string(),
        boards: z.array(
          z.object({
            id: z.number(),
            mission: z.string(),
            solution: z.string(),
            win_rate: z.number()
          })
        )
      })
    }
  })
  .callback(async ({ pb, body: { difficulty, boardCount }, response }) => {
    const boards: {
      id: number
      mission: string
      solution: string
      win_rate: number
    }[] = []

    for (let i = 0; i < boardCount; i++) {
      const res = await fetch(`https://sudoku.com/api/v2/level/${difficulty}`, {
        method: 'GET',
        headers: {
          'x-easy-locale': 'en',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })

      const data = await res.json()

      boards.push(data)
    }

    const session = await pb.create
      .collection('sessions')
      .data({ current_board_index: 0 })
      .execute()

    await Promise.all(
      boards.map((board, index) =>
        pb.create
          .collection('entries')
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

    return response.ok({ sessionId: session.id, boards })
  })

export const save = forge
  .mutation({
    description: 'Save Sudoku session progress',
    input: {
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
    },
    output: {
      OK: z.object({
        sessionId: z.string()
      })
    }
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
      },
      response
    }) => {
      let session: { id: string }

      if (sessionId) {
        session = await pb.update
          .collection('sessions')
          .id(sessionId)
          .data({ current_board_index: currentBoardIndex })
          .execute()

        const existingEntries = await pb.getFullList
          .collection('entries')
          .filter([{ field: 'session', operator: '=', value: sessionId }])
          .sort(['index'])
          .execute()

        await Promise.all(
          boards.map(async (board, index) => {
            const existingEntry = existingEntries.find(e => e.index === index)

            if (existingEntry) {
              return pb.update
                .collection('entries')
                .id(existingEntry.id)
                .data({
                  user_answers: userInputs[index],
                  user_candidates: candidates[index],
                  duration_elapsed: durationsElapsed[index] ?? 0
                })
                .execute()
            } else {
              return pb.create
                .collection('entries')
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
        session = await pb.create
          .collection('sessions')
          .data({ current_board_index: currentBoardIndex })
          .execute()

        await Promise.all(
          boards.map((board, index) =>
            pb.create
              .collection('entries')
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

      return response.ok({ sessionId: session.id })
    }
  )

export const remove = forge
  .mutation({
    description: 'Delete Sudoku session',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'sessions' }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    const entries = await pb.getFullList
      .collection('entries')
      .filter([{ field: 'session', operator: '=', value: id }])
      .execute()

    await Promise.all(
      entries.map(entry =>
        pb.delete.collection('entries').id(entry.id).execute()
      )
    )

    await pb.delete.collection('sessions').id(id).execute()

    return response.noContent()
  })

export const markComplete = forge
  .mutation({
    description: 'Mark a Sudoku board as completed',
    input: {
      body: z.object({
        sessionId: z.string(),
        boardIndex: z.number()
      })
    },
    output: {
      OK: z.object({ success: z.boolean() }),
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ pb, body: { sessionId, boardIndex }, response }) => {
    const entries = await pb.getFullList
      .collection('entries')
      .filter([
        { field: 'session', operator: '=', value: sessionId },
        { field: 'index', operator: '=', value: boardIndex }
      ])
      .execute()

    if (entries.length === 0) {
      return response.badRequest('Board entry not found')
    }

    await pb.update
      .collection('entries')
      .id(entries[0].id)
      .data({ is_completed: true })
      .execute()

    return response.ok({ success: true })
  })

export const resetBoard = forge
  .mutation({
    description: 'Reset a Sudoku board to initial state',
    input: {
      body: z.object({
        sessionId: z.string(),
        boardIndex: z.number()
      })
    },
    output: {
      OK: z.object({ success: z.boolean() }),
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ pb, body: { sessionId, boardIndex }, response }) => {
    const entries = await pb.getFullList
      .collection('entries')
      .filter([
        { field: 'session', operator: '=', value: sessionId },
        { field: 'index', operator: '=', value: boardIndex }
      ])
      .execute()

    if (entries.length === 0) {
      return response.badRequest('Board entry not found')
    }

    await pb.update
      .collection('entries')
      .id(entries[0].id)
      .data({
        user_answers: Array(81).fill(''),
        user_candidates: Array(81).fill([]),
        is_completed: false
      })
      .execute()

    return response.ok({ success: true })
  })

export const stats = forge
  .query({
    description: 'Get Sudoku statistics',
    output: {
      OK: StatsResponseSchema
    }
  })
  .callback(async ({ pb, response }) => {
    const allEntries = await pb.getFullList
      .collection('entries')
      .expand({ session: 'sessions' })
      .execute()

    const difficulties = ['easy', 'medium', 'hard', 'expert', 'evil', 'extreme']

    const statsByDifficulty: Record<
      string,
      {
        totalBoards: number
        completedBoards: number
        totalTime: number
        bestTime: number | null
        times: number[]
      }
    > = {}

    for (const diff of difficulties) {
      statsByDifficulty[diff] = {
        totalBoards: 0,
        completedBoards: 0,
        totalTime: 0,
        bestTime: null,
        times: []
      }
    }

    const completionDates = new Set<string>()

    const completionsByDate: Record<string, number> = {}

    const completionsByMonth: Record<
      string,
      { completed: number; total: number }
    > = {}

    for (const entry of allEntries) {
      const difficulty = entry.difficulty as string

      const session = entry.expand?.session

      if (!statsByDifficulty[difficulty]) continue

      statsByDifficulty[difficulty].totalBoards++

      const isCompleted = entry.is_completed as boolean

      const duration = (entry.duration_elapsed as number) || 0

      const createdDate = new Date(entry.created as string)

      const monthKey = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`

      if (!completionsByMonth[monthKey]) {
        completionsByMonth[monthKey] = { completed: 0, total: 0 }
      }
      completionsByMonth[monthKey].total++

      if (isCompleted) {
        statsByDifficulty[difficulty].completedBoards++
        statsByDifficulty[difficulty].totalTime += duration
        statsByDifficulty[difficulty].times.push(duration)

        if (
          statsByDifficulty[difficulty].bestTime === null ||
          duration < statsByDifficulty[difficulty].bestTime!
        ) {
          statsByDifficulty[difficulty].bestTime = duration
        }

        if (session) {
          const completedDate = new Date(session.updated as string)
            .toISOString()
            .split('T')[0]

          completionDates.add(completedDate)

          completionsByDate[completedDate] =
            (completionsByDate[completedDate] || 0) + 1
        }

        completionsByMonth[monthKey].completed++
      }
    }

    const sortedDates = Array.from(completionDates).sort().reverse()

    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    const today = new Date().toISOString().split('T')[0]

    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split('T')[0]

    const streakActive =
      sortedDates.length > 0 &&
      (sortedDates[0] === today || sortedDates[0] === yesterday)

    if (streakActive) {
      let prevDate: Date | null = null

      for (const dateStr of sortedDates) {
        const date = new Date(dateStr)

        if (!prevDate) {
          tempStreak = 1
          currentStreak = 1
        } else {
          const diff =
            (prevDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)

          if (diff === 1) {
            tempStreak++
            currentStreak = tempStreak
          } else {
            break
          }
        }

        prevDate = date
        longestStreak = Math.max(longestStreak, tempStreak)
      }
    }

    tempStreak = 0
    let prevDate: Date | null = null

    for (const dateStr of sortedDates.slice().reverse()) {
      const date = new Date(dateStr)

      if (!prevDate) {
        tempStreak = 1
      } else {
        const diff =
          (date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)

        if (diff === 1) {
          tempStreak++
        } else {
          tempStreak = 1
        }
      }

      longestStreak = Math.max(longestStreak, tempStreak)
      prevDate = date
    }

    const difficultyStats = difficulties.map(diff => {
      const stats = statsByDifficulty[diff]

      const timeRanges = {
        under2min: 0,
        under5min: 0,
        under10min: 0,
        under20min: 0,
        over20min: 0
      }

      for (const time of stats.times) {
        if (time < 120) timeRanges.under2min++
        else if (time < 300) timeRanges.under5min++
        else if (time < 600) timeRanges.under10min++
        else if (time < 1200) timeRanges.under20min++
        else timeRanges.over20min++
      }

      return {
        difficulty: diff,
        totalBoards: stats.totalBoards,
        avgTime:
          stats.completedBoards > 0
            ? Math.round(stats.totalTime / stats.completedBoards)
            : null,
        bestTime: stats.bestTime,
        totalTime: stats.totalTime,
        timeDistribution: timeRanges
      }
    })

    const totalBoards = difficultyStats.reduce(
      (sum, d) => sum + d.totalBoards,
      0
    )

    const totalPlayTime = difficultyStats.reduce(
      (sum, d) => sum + d.totalTime,
      0
    )

    const now = new Date()

    const completionHistory: Array<{
      month: string
      completed: number
      total: number
      rate: number
    }> = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)

      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      const monthData = completionsByMonth[monthKey] || {
        completed: 0,
        total: 0
      }

      completionHistory.push({
        month: monthKey,
        completed: monthData.completed,
        total: monthData.total,
        rate:
          monthData.total > 0
            ? Math.round((monthData.completed / monthData.total) * 100)
            : 0
      })
    }

    const recentActivity: Array<{ date: string; count: number }> = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000)
        .toISOString()
        .split('T')[0]

      recentActivity.push({
        date,
        count: completionsByDate[date] || 0
      })
    }

    return response.ok({
      overall: {
        totalBoards,
        totalPlayTime,
        daysPlayed: completionDates.size
      },
      streak: {
        current: currentStreak,
        longest: longestStreak,
        isActive: streakActive
      },
      byDifficulty: difficultyStats,
      completionHistory,
      recentActivity
    })
  })

// Get activities for activity calendar
export const getActivities = forge
  .query({
    description: 'Get Sudoku activities for calendar',
    input: {
      query: z.object({
        year: z.string()
      })
    },
    output: {
      OK: z.object({
        data: z.array(
          z.object({
            date: z.string(),
            count: z.number(),
            level: z.number()
          })
        ),
        firstYear: z.number()
      })
    }
  })
  .callback(async ({ pb, query: { year }, response }) => {
    const allEntries = await pb.getFullList
      .collection('entries')
      .filter([{ field: 'is_completed', operator: '=', value: true }])
      .execute()

    const completionsByDate: Record<string, number> = {}

    let firstYear = parseInt(year)

    for (const entry of allEntries) {
      const createdDate = new Date(entry.created as string)

      const entryYear = createdDate.getFullYear()

      if (entryYear < firstYear) {
        firstYear = entryYear
      }

      if (entryYear === parseInt(year)) {
        const dateStr = createdDate.toISOString().split('T')[0]

        completionsByDate[dateStr] = (completionsByDate[dateStr] || 0) + 1
      }
    }

    const yearNum = parseInt(year)

    const startDate = new Date(yearNum, 0, 1)

    const endDate = new Date(yearNum, 11, 31)

    const activities: Array<{ date: string; count: number; level: number }> = []

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dateStr = date.toISOString().split('T')[0]

      const count = completionsByDate[dateStr] || 0

      let level = 0

      if (count >= 5) level = 4
      else if (count >= 3) level = 3
      else if (count >= 2) level = 2
      else if (count >= 1) level = 1

      activities.push({
        date: dateStr,
        count,
        level
      })
    }

    return response.ok({
      data: activities,
      firstYear
    })
  })
