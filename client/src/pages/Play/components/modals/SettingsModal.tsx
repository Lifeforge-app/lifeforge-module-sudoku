import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { CheckboxField, FormModal, createDefaultValues } from '@lifeforge/ui'

interface SettingsModalData {
  autoCheckMode: boolean
  setAutoCheckMode: (value: boolean) => void
}

const schema = z.object({
  autoCheckMode: z.boolean()
})

function SettingsModal({
  onClose,
  data: { autoCheckMode, setAutoCheckMode }
}: {
  onClose: () => void
  data: SettingsModalData
}) {
  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      autoCheckMode
    },
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: 'update',
        handler: data => setAutoCheckMode(data.autoCheckMode)
      }}
      uiConfig={{
        icon: 'tabler:settings',
        title: 'settings',
        namespace: 'apps.sudoku',
        onClose
      }}
    >
      <CheckboxField
        control={form.control}
        icon="tabler:check"
        label="autoCheckMode"
        name="autoCheckMode"
      />
    </FormModal>
  )
}

export default SettingsModal
