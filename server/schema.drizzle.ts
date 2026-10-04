import { type RelationsBuilder } from 'drizzle-orm'
import {
  boolean,
  integer,
  jsonb,
  text,
  timestamp,
  uuid
} from 'drizzle-orm/pg-core'

import { createModuleTable } from '@lifeforge/drizzle'

const pgTable = createModuleTable()

export interface SudokuBoard {
  id: number
  mission: string
  solution: string
  win_rate: number
}

export const sudokuSessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  current_board_index: integer('current_board_index').notNull().default(0),
  created: timestamp('created', { mode: 'date' }).defaultNow().notNull(),
  updated: timestamp('updated', { mode: 'date' }).defaultNow().notNull()
})

export const sudokuEntries = pgTable('entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  difficulty: text('difficulty').notNull().default(''),
  duration_elapsed: integer('duration_elapsed').notNull().default(0),
  board: jsonb('board').$type<SudokuBoard | null>(),
  user_answers: jsonb('user_answers').$type<string[]>().notNull().default([]),
  user_candidates: jsonb('user_candidates')
    .$type<number[][]>()
    .notNull()
    .default([]),
  session: uuid('session').references(() => sudokuSessions.id, {
    onDelete: 'cascade'
  }),
  index: integer('index').notNull().default(0),
  is_completed: boolean('is_completed').notNull().default(false),
  created: timestamp('created', { mode: 'date' }).defaultNow().notNull(),
  updated: timestamp('updated', { mode: 'date' }).defaultNow().notNull()
})

export const tables = {
  sessions: sudokuSessions,
  entries: sudokuEntries
}

export const relations = (r: RelationsBuilder<typeof tables>) => ({
  entries: {
    session_info: r.one.sessions({
      from: r.entries.session,
      to: r.sessions.id
    })
  },
  sessions: {
    entries: r.many.entries()
  }
})
