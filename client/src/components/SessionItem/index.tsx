import type { Session } from '@'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Icon,
  TAILWIND_PALETTE,
  TagChip,
  Text,
  Transition,
  anyColorToHex,
  useModalStore
} from '@lifeforge/ui'

import { DIFFICULTY_COLORS } from '@/constants/constants'
import { forgeAPI } from '@/manifest'
import { formatTime } from '@/utils/time'

function SessionItem({ session }: { session: Session }) {
  const { t } = useModuleTranslation()
  const navigate = useNavigate()
  const { open } = useModalStore()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation(
    forgeAPI.sessions.remove.input({ id: session.id }).mutationOptions({
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
        await deleteMutation.mutateAsync(undefined)
      }
    })
  }

  const difficultyColor =
    DIFFICULTY_COLORS[session.difficulty] || TAILWIND_PALETTE.gray[500]

  return (
    <Card
      isInteractive
      align="center"
      as="li"
      direction="row"
      gap="md"
      justify="between"
      onClick={handleContinue}
    >
      <Flex align="center" flex="1" gap="md" minWidth="0">
        <Flex
          centered
          display={{ base: 'none', sm: 'flex' }}
          flexShrink="0"
          height="4rem"
          minWidth="0"
          p="md"
          r="lg"
          style={{ backgroundColor: anyColorToHex(difficultyColor) + '20' }}
          width="4rem"
        >
          <Icon
            icon="uil:table"
            size="100%"
            style={{ color: difficultyColor }}
          />
        </Flex>
        <Box flex="1" minWidth="0">
          <Flex
            align={{ base: 'start', sm: 'center' }}
            direction={{ base: 'column-reverse', sm: 'row' }}
            gap="sm"
            minWidth="0"
          >
            <Box asChild minWidth="0" width={{ base: '100%', sm: 'auto' }}>
              <Text truncate as="h3" size="xl" weight="medium">
                Session {dayjs(session.created).format('DD MMM YYYY HH:mm')}
              </Text>
            </Box>
            <TagChip
              color={difficultyColor}
              icon="tabler:puzzle"
              label={t('difficulties.' + session.difficulty)}
            />
          </Flex>
          <Flex align="center" as="p" gapX="md" mt="xs" wrap="wrap">
            <Flex align="center" as="span" gap="xs">
              <Icon color="muted" icon="tabler:grid-3x3" size="1.125rem" />
              <Text color="muted">
                {t('session.boards')}: {session.boardCount}
              </Text>
            </Flex>
            {session.progress.total > 0 && (
              <Flex align="center" as="span" gap="xs">
                <Icon color="muted" icon="tabler:clock" size="1.125rem" />
                <Text color="muted">{t('session.avgTime')}:</Text>
                <Text as="code" color="primary" weight="semibold">
                  {formatTime(
                    Math.round(session.totalDuration / session.boardCount)
                  )}
                </Text>
              </Flex>
            )}
          </Flex>
        </Box>
        <Flex
          align="end"
          direction="column"
          display={{ base: 'none', sm: 'flex' }}
          gap="xs"
          width="8rem"
        >
          {progressPercent === 100 ? (
            <Flex align="center" gap="sm">
              <Icon icon="tabler:check" size="1.125rem" />
              {t('session.completed')}
            </Flex>
          ) : (
            <>
              <Text color="muted">
                {progressPercent}% {t('session.complete')}
              </Text>
              <Box
                bg={{ base: 'bg-200', dark: 'bg-700' }}
                height="0.5rem"
                overflow="hidden"
                r="full"
                width="100%"
              >
                <Transition duration="150ms" property="all">
                  <Box
                    height="100%"
                    r="full"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor:
                        correctPercent >= 80
                          ? TAILWIND_PALETTE.green[500]
                          : correctPercent >= 50
                            ? TAILWIND_PALETTE.yellow[500]
                            : TAILWIND_PALETTE.red[500]
                    }}
                  />
                </Transition>
              </Box>
            </>
          )}
        </Flex>
      </Flex>
      <ContextMenu>
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
