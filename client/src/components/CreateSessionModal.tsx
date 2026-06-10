import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { useModuleTranslation } from '@lifeforge/localization'
import { FormModal, TAILWIND_PALETTE, defineForm } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

const DIFFICULTIES = [
  { name: 'easy', color: TAILWIND_PALETTE.green[500] },
  { name: 'medium', color: TAILWIND_PALETTE.yellow[500] },
  { name: 'hard', color: TAILWIND_PALETTE.orange[500] },
  { name: 'expert', color: TAILWIND_PALETTE.blue[500] },
  { name: 'evil', color: TAILWIND_PALETTE.red[500] },
  { name: 'extreme', color: TAILWIND_PALETTE.gray[900] }
]

const BOARD_COUNTS = [1, 2, 4, 6]

function CreateSessionModal({ onClose }: { onClose: () => void }) {
  const { t } = useModuleTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const createMutation = useMutation(
    forgeAPI.sessions.create.mutationOptions({
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
