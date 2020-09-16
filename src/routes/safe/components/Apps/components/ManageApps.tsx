import { ButtonLink, ManageListModal } from '@gnosis.pm/safe-react-components'
import React, { useState } from 'react'

import appsIconSvg from 'src/routes/safe/components/Transactions/TxsTable/TxType/assets/appsIcon.svg'
import AddAppForm from '../AddAppForm'
import { SafeApp } from '../types'

const FORM_ID = 'add-apps-form'

type Props = {
  appList: Array<SafeApp>
  onAppAdded: (app: SafeApp) => void
  onAppToggle: (appId: string, enabled: boolean) => void
  onAppRemoved: (appId: string) => void
}

type AppListItem = SafeApp & { checked: boolean }

const ManageApps = ({ appList, onAppAdded, onAppToggle, onAppRemoved }: Props): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)

  const onSubmitForm = () => {
    // This sucks, but it's the way the docs suggest
    // https://github.com/final-form/react-final-form/blob/master/docs/faq.md#via-documentgetelementbyid
    document.querySelectorAll(`[data-testId=${FORM_ID}]`)[0].dispatchEvent(new Event('submit', { cancelable: true }))
  }

  const toggleOpen = () => setIsOpen(!isOpen)

  const closeModal = () => setIsOpen(false)

  const getItemList = (): AppListItem[] =>
    appList.map((a) => {
      return { ...a, checked: !a.disabled }
    })

  const onItemToggle = (itemId: string, checked: boolean): void => {
    onAppToggle(itemId, checked)
  }

  const Form = (
    <AddAppForm
      formId={FORM_ID}
      appList={appList}
      closeModal={closeModal}
      onAppAdded={onAppAdded}
      setIsSubmitDisabled={setIsSubmitDisabled}
    />
  )

  return (
    <>
      <ButtonLink color="primary" onClick={toggleOpen}>
        Manage Apps
      </ButtonLink>
      {isOpen && (
        <ManageListModal
          addButtonLabel="Add custom app"
          showDeleteButton
          defaultIconUrl={appsIconSvg}
          formBody={Form}
          isSubmitFormDisabled={isSubmitDisabled}
          itemList={getItemList()}
          onClose={closeModal}
          onItemToggle={onItemToggle}
          onItemDeleted={onAppRemoved}
          onSubmitForm={onSubmitForm}
        />
      )}
    </>
  )
}

export default ManageApps
