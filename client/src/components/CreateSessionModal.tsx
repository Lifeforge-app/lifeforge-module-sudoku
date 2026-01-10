import forgeAPI from '@/utils/forgeAPI'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormModal, defineForm } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'shared'
import colors from 'tailwindcss/colors'

const DIFFICULTIES = [
  { name: 'easy', color: colors.green[500] },
  { name: 'medium', color: colors.yellow[500] },
  { name: 'hard', color: colors.orange[500] },
  { name: 'expert', color: colors.blue[500] },
  { name: 'evil', color: colors.red[500] },
  { name: 'extreme', color: colors.gray[900] }
]

const BOARD_COUNTS = [1, 2, 4, 6]

function CreateSessionModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('apps.sudoku')

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const createMutation = useMutation(
    forgeAPI.sudoku.sessions.create.mutationOptions({
      onSuccess: data => {
        queryClient.invalidateQueries({ queryKey: ['sudoku', 'sessions'] })
        navigate(`/sudoku/play/${data.sessionId}`)
      }
    })
  )

  const { formProps } = defineForm<{
    difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'evil' | 'extreme'
    boardCount: number
  }>({
    icon: 'tabler:plus',
    title: 'session.create',
    onClose,
    namespace: 'apps.sudoku',
    submitButton: 'create'
  })
    .typesMap({
      difficulty: 'listbox',
      boardCount: 'listbox'
    })
    .setupFields({
      difficulty: {
        required: true,
        multiple: false,
        label: t('inputs.difficulty'),
        icon: 'tabler:category',
        options: DIFFICULTIES.map(diff => ({
          text: t(`difficulties.${diff.name}`),
          value: diff.name as
            | 'easy'
            | 'medium'
            | 'hard'
            | 'expert'
            | 'evil'
            | 'extreme',
          color: diff.color
        }))
      },
      boardCount: {
        required: true,
        multiple: false,
        label: t('inputs.boardCount'),
        icon: 'tabler:grid-dots',
        options: BOARD_COUNTS.map(count => ({
          text: String(count),
          value: count
        }))
      }
    })
    .initialData({
      difficulty: 'evil',
      boardCount: 1
    })
    .onSubmit(async formData => {
      await createMutation.mutateAsync(formData)
    })
    .build()

  return <FormModal {...formProps} />
}

export default CreateSessionModal
