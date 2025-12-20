import forgeAPI from '@/utils/forgeAPI'
import { useQuery } from '@tanstack/react-query'
import {
  Button,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  Scrollbar,
  WithQuery,
  useModalStore
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import type { InferOutput } from 'shared'
import colors from 'tailwindcss/colors'

import SessionItem from './components/SessionItem'
import CreateSessionModal from './components/CreateSessionModal'

export type SudokuBoard = {
  id: number
  mission: string
  solution: string
  win_rate: number
}

export type Session = InferOutput<typeof forgeAPI.sudoku.sessions.list>[number]

export const DIFFICULTIES = {
  easy: colors.green[500],
  medium: colors.yellow[500],
  hard: colors.orange[500],
  expert: colors.blue[500],
  evil: colors.red[500],
  extreme: colors.gray[900]
}

function Sudoku() {
  const { t } = useTranslation('apps.sudoku')

  const open = useModalStore(state => state.open)

  const sessionsQuery = useQuery(
    forgeAPI.sudoku.sessions.list.input({}).queryOptions()
  )

  const handleCreateSession = () => {
    open(CreateSessionModal, {})
  }

  return (
    <>
      <ModuleHeader
        actionButton={
          <Button
            className="hidden md:flex"
            icon="tabler:plus"
            namespace="apps.sudoku"
            tProps={{
              item: t('items.session')
            }}
            onClick={handleCreateSession}
          >
            new
          </Button>
        }
      />

      <WithQuery query={sessionsQuery}>
        {sessions =>
          sessions.length ? (
            <Scrollbar className="mt-6">
              <ul className="mb-8 space-y-3">
                {sessions.map(session => (
                  <SessionItem key={session.id} session={session} />
                ))}
              </ul>
              <FAB visibilityBreakpoint="md" onClick={handleCreateSession} />
            </Scrollbar>
          ) : (
            <EmptyStateScreen
              icon="tabler:puzzle-off"
              message={{
                id: 'sessions',
                namespace: 'apps.sudoku'
              }}
            />
          )
        }
      </WithQuery>
    </>
  )
}

export default Sudoku
