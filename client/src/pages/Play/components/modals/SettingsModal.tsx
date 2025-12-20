import { FormModal, defineForm } from 'lifeforge-ui'

interface SettingsModalData {
  autoCheckMode: boolean
  setAutoCheckMode: (value: boolean) => void
}

function SettingsModal({
  onClose,
  data: { autoCheckMode, setAutoCheckMode }
}: {
  onClose: () => void
  data: SettingsModalData
}) {
  const { formProps } = defineForm<{
    autoCheckMode: boolean
  }>({
    icon: 'tabler:settings',
    title: 'settings',
    onClose,
    namespace: 'apps.sudoku',
    submitButton: 'update'
  })
    .typesMap({
      autoCheckMode: 'checkbox'
    })
    .setupFields({
      autoCheckMode: {
        label: 'autoCheckMode',
        icon: 'tabler:check'
      }
    })
    .initialData({
      autoCheckMode
    })
    .onSubmit(async formData => {
      setAutoCheckMode(formData.autoCheckMode)
    })
    .build()

  return <FormModal {...formProps} />
}

export default SettingsModal
