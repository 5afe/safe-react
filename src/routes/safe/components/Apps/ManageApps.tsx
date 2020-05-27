import { ButtonLink, ManageListModal } from '@gnosis.pm/safe-react-components'
import React, { useState } from 'react'

import appsIconSvg from 'src/routes/safe/components/Transactions/TxsTable/TxType/assets/appsIcon.svg'
import AddAppFrom from './AddAppForm'
import { SafeApp } from './types'

const FORM_ID = 'add-apps-form'

type Props = {
  appList: Array<SafeApp>
  onAppAdded: (app: any) => void
  onAppToggle: (appId: string, enabled: boolean) => void
}

const ManageApps = ({ appList, onAppAdded, onAppToggle }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)

  const onSubmitForm = () => {
    // This sucks, but it's the way the docs suggest
    // https://github.com/final-form/react-final-form/blob/master/docs/faq.md#via-documentgetelementbyid
    document.querySelectorAll(`[data-testId=${FORM_ID}]`)[0].dispatchEvent(new Event('submit', { cancelable: true }))
  }

  const toggleOpen = () => setIsOpen(!isOpen)

  const closeModal = () => setIsOpen(false)

  const getItemList = () =>
    appList.map((a) => {
      return { ...a, checked: !a.disabled }
    })

  const onItemToggle = (itemId, checked) => {
    onAppToggle(itemId, checked)
  }

  const ButtonLinkAux: any = ButtonLink

  return (
    <>
      <ButtonLinkAux color="primary" onClick={toggleOpen as any}>
        Manage Apps
      </ButtonLinkAux>
      {isOpen && (
        <ManageListModal
          addButtonLabel="Add custom app"
          defaultIconUrl={appsIconSvg}
          formBody={
            <AddAppFrom
              formId={FORM_ID}
              appList={appList}
              closeModal={closeModal}
              onAppAdded={onAppAdded}
              setIsSubmitDisabled={setIsSubmitDisabled}
            />
          }
          isSubmitFormDisabled={isSubmitDisabled}
          itemList={getItemList()}
          onClose={closeModal}
          onItemToggle={onItemToggle}
          onSubmitForm={onSubmitForm}
        />
      )}
    </>
  )
}

export default ManageApps
