import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import z from 'zod'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  FormModal,
  ListboxField,
  TAILWIND_PALETTE,
  createDefaultValues
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'evil' | 'extreme'

const DIFFICULTIES: { name: Difficulty; color: string }[] = [
  { name: 'easy', color: TAILWIND_PALETTE.green[500] },
  { name: 'medium', color: TAILWIND_PALETTE.yellow[500] },
  { name: 'hard', color: TAILWIND_PALETTE.orange[500] },
  { name: 'expert', color: TAILWIND_PALETTE.blue[500] },
  { name: 'evil', color: TAILWIND_PALETTE.red[500] },
  { name: 'extreme', color: TAILWIND_PALETTE.gray[900] }
]

const BOARD_COUNTS = [1, 2, 4, 6]

const schema = z.object({
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert', 'evil', 'extreme']),
  boardCount: z.number()
})

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

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      difficulty: 'evil' as const,
      boardCount: 1
    },
    resolver: zodResolver(schema)
  })

  const difficultyOptions = DIFFICULTIES.map(diff => ({
    text: t(`difficulties.${diff.name}`),
    value: diff.name,
    color: diff.color
  }))

  const boardCountOptions = BOARD_COUNTS.map(count => ({
    text: String(count),
    value: count
  }))

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: 'create',
        handler: createMutation.mutateAsync
      }}
      uiConfig={{
        icon: 'tabler:plus',
        title: 'session.create',
        namespace: 'apps.sudoku',
        onClose
      }}
    >
      <ListboxField
        required
        control={form.control}
        icon="tabler:category"
        label="difficulty"
        name="difficulty"
        options={difficultyOptions}
      />
      <ListboxField
        required
        control={form.control}
        icon="tabler:grid-dots"
        label="boardCount"
        name="boardCount"
        options={boardCountOptions}
      />
    </FormModal>
  )
}

export default CreateSessionModal
