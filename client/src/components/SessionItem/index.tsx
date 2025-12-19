import type { Session } from '@'
import forgeAPI from '@/utils/forgeAPI'
import { formatTime } from '@/utils/time'
import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import {
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  TagChip,
  useModalStore
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { anyColorToHex, useNavigate } from 'shared'
import colors from 'tailwindcss/colors'

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: colors.green[500],
  medium: colors.yellow[500],
  hard: colors.orange[500],
  expert: colors.blue[500],
  evil: colors.red[500],
  extreme: colors.gray[900]
}

function SessionItem({ session }: { session: Session }) {
  const { t } = useTranslation('apps.sudoku')

  const navigate = useNavigate()

  const open = useModalStore(state => state.open)

  const queryClient = useQueryClient()

  const deleteMutation = useMutation(
    forgeAPI.sudoku.sessions.remove.input({ id: session.id }).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sudoku', 'sessions'] })
      }
    })
  )

  const progressPercent =
    session.progress.total > 0
      ? Math.round((session.progress.filled / session.progress.total) * 100)
      : 0

  const correctPercent =
    session.progress.filled > 0
      ? Math.round((session.progress.correct / session.progress.filled) * 100)
      : 0

  const handleContinue = () => {
    navigate(`/sudoku/play/${session.id}`)
  }

  const handleDelete = () => {
    open(ConfirmationModal, {
      title: t('modals.confirmDelete.title'),
      description: t('modals.confirmDelete.description'),
      confirmButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })
  }

  const difficultyColor =
    DIFFICULTY_COLORS[session.difficulty] || colors.gray[500]

  return (
    <Card
      isInteractive
      as="li"
      className="flex-between cursor-pointer gap-4"
      onClick={handleContinue}
    >
      <div className="flex flex-1 items-center gap-4">
        <div
          className="flex size-16 shrink-0 items-center justify-center rounded-lg p-3 text-lg font-bold text-white"
          style={{ backgroundColor: anyColorToHex(difficultyColor) + '20' }}
        >
          <Icon
            className="size-full"
            icon="uil:table"
            style={{
              color: difficultyColor
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-xl font-medium">
              Session {dayjs(session.created).format('DD MMM YYYY HH:mm')}
            </h3>
            <TagChip
              color={difficultyColor}
              icon="tabler:puzzle"
              label={t('difficulties.' + session.difficulty)}
            />
          </div>
          <p className="text-bg-500 mt-1 flex items-center gap-2">
            <div className="text-bg-500 flex items-center gap-1">
              <Icon className="size-4.5" icon="tabler:clock" />
              {t('session.avgTime')}:
            </div>
            <div className="text-custom-500 font-mono font-semibold">
              {formatTime(
                Math.round(session.totalDuration / session.boardCount)
              )}
            </div>
          </p>
        </div>
        <div className="hidden w-32 flex-col items-end gap-1 sm:flex">
          {progressPercent === 100 ? (
            <div className="flex items-center gap-2">
              <Icon className="size-4.5" icon="tabler:check" />
              {t('session.completed')}
            </div>
          ) : (
            <>
              <div className="text-bg-500">
                {progressPercent}% {t('session.complete')}
              </div>
              <div className="bg-bg-200 dark:bg-bg-700 h-2 w-full overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor:
                      correctPercent >= 80
                        ? colors.green[500]
                        : correctPercent >= 50
                          ? colors.yellow[500]
                          : colors.red[500]
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <ContextMenu classNames={{ wrapper: 'shrink-0' }}>
        <ContextMenuItem
          icon="tabler:printer"
          label="print"
          onClick={() => navigate(`/sudoku/print/${session.id}`)}
        />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="delete"
          onClick={handleDelete}
        />
      </ContextMenu>
    </Card>
  )
}

export default SessionItem
