import { useQuery } from '@tanstack/react-query'

import type { InferOutput } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  Button,
  ContextMenu,
  ContextMenuItem,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  Scrollbar,
  Stack,
  TAILWIND_PALETTE,
  WithQuery,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import CreateSessionModal from './components/CreateSessionModal'
import SessionItem from './components/SessionItem'
import StatsModal from './components/StatsModal'

export type SudokuBoard = {
  id: number
  mission: string
  solution: string
  win_rate: number
}

export type Session = InferOutput<typeof forgeAPI.sessions.list>[number]

export const DIFFICULTIES = {
  easy: TAILWIND_PALETTE.green[500],
  medium: TAILWIND_PALETTE.yellow[500],
  hard: TAILWIND_PALETTE.orange[500],
  expert: TAILWIND_PALETTE.blue[500],
  evil: TAILWIND_PALETTE.red[500],
  extreme: TAILWIND_PALETTE.gray[900]
}

function Sudoku() {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()

  const sessionsQuery = useQuery(
    forgeAPI.sessions.list.input({}).queryOptions()
  )

  const handleCreateSession = () => {
    open(CreateSessionModal, {})
  }

  const handleOpenStats = () => {
    open(StatsModal, {})
  }

  return (
    <>
      <ModuleHeader
        trailing={
          <>
            <Button
              display={{ base: 'none', md: 'flex' }}
              icon="tabler:plus"
              tProps={{
                item: t('items.session')
              }}
              onClick={handleCreateSession}
            >
              new
            </Button>
            <ContextMenu>
              <ContextMenuItem
                icon="tabler:chart-bar"
                label="stats.title"
                onClick={handleOpenStats}
              />
            </ContextMenu>
          </>
        }
      />

      <WithQuery query={sessionsQuery}>
        {sessions =>
          sessions.length ? (
          <Box asChild mt="lg">
            <Scrollbar>
              <Stack as="ul" mb="xl">
                {sessions.map(session => (
                  <SessionItem key={session.id} session={session} />
                ))}
              </Stack>
              <FAB visibilityBreakpoint="md" onClick={handleCreateSession} />
            </Scrollbar>
          </Box>
          ) : (
            <EmptyStateScreen
              icon="tabler:puzzle-off"
              message={{
                id: 'sessions'
              }}
            />
          )
        }
      </WithQuery>
    </>
  )
}

export default Sudoku
