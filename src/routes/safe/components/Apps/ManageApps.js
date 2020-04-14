// @flow
import { Checkbox, ManageListModal, Text, TextField } from '@gnosis/safe-react-components'
import React, { useState } from 'react'
import { FormSpy } from 'react-final-form'
import styled from 'styled-components'

//import { getAppInfoFromUrl, staticAppsList } from './utils'
import { getAppInfoFromUrl } from './utils'

import Field from '~/components/forms/Field'
import GnoForm from '~/components/forms/GnoForm'
import { composeValidators, required } from '~/components/forms/validator'
import ButtonLink from '~/components/layout/ButtonLink'
import Img from '~/components/layout/Img'
import appsIconSvg from '~/routes/safe/components/Transactions/TxsTable/TxType/assets/appsIcon.svg'

const FORM_ID = 'add-apps-form'

const StyledText = styled(Text)`
  margin-bottom: 19px;
`

const StyledTextFileAppName = styled(TextField)`
  && {
    width: 340px;
  }
`

const AppInfo = styled.div`
  margin: 36px 0 24px 0;

  img {
    margin-right: 10px;
  }
`

const StyledCheckbox = styled(Checkbox)`
  margin: 0px 0px 2px 19px;
`
const APP_INFO = { iconUrl: appsIconSvg, name: '', error: false }

const ManageApps = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState([
    {
      id: '1',
      iconUrl: 'someUrl',
      name: 'name 1',
      description: 'description 1',
      checked: true,
    },
    {
      id: '2',
      iconUrl: 'someUrl2',
      name: 'name 2',
      description: 'description 2',
      checked: true,
    },
    {
      id: '3',
      iconUrl: 'someUrl3',
      name: 'name 3',
      description: 'description 3',
      checked: true,
    },
  ])
  const [appInfo, setAppInfo] = useState(APP_INFO)
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)

  const onItemToggle = (itemId: string, checked: boolean) => {
    const copy = [...items]
    const localItem = copy.find((i) => i.id === itemId)
    if (!localItem) {
      return
    }
    localItem.checked = checked
    setItems(copy)
  }

  const handleSubmit = (values) => {
    return values
  }

  const urlValidator = (value: string) => {
    return /(?:^|[ \t])((https?:\/\/)?(?:localhost|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?)/gm.test(value)
      ? undefined
      : 'Please, provide a valid url'
  }

  const safeAppValidator = async (value) => {
    const appInfo = await getAppInfoFromUrl(value)

    if (appInfo.error) {
      setAppInfo(APP_INFO)
      return 'This is not a valid Safe app.'
    }

    setAppInfo({ ...appInfo })
  }

  const onFormStatusChange = ({ pristine, valid }) => {
    if (!pristine) {
      setIsSubmitDisabled(!valid || appInfo.error)
    }
  }

  const getAddAppForm = () => {
    return (
      <GnoForm
        initialValues={{
          appUrl: '',
          agreed: true,
        }}
        onSubmit={handleSubmit}
        testId={FORM_ID}
      >
        {() => (
          <>
            <StyledText size="xl">Add custom app</StyledText>
            <Field
              component={TextField}
              name="appUrl"
              placeholder="App URL*"
              text="App URL*"
              type="text"
              validate={composeValidators(required, urlValidator, safeAppValidator)}
            />

            <AppInfo>
              <Img alt="Token image" height={55} src={appInfo.iconUrl} />
              <StyledTextFileAppName label="App name" readOnly value={appInfo.name} />
            </AppInfo>

            <FormSpy
              onChange={onFormStatusChange}
              subscription={{
                valid: true,
                pristine: true,
              }}
            />

            <Field
              component={StyledCheckbox}
              label="I agree to use this app on my own risk"
              name="agreed"
              type="checkbox"
              validate={(value) => (value === true ? undefined : 'Required')}
            />
          </>
        )}
      </GnoForm>
    )
  }

  const onSubmitForm = () => {
    // This sucks, but it's the way the docs suggest
    // https://github.com/final-form/react-final-form/blob/master/docs/faq.md#via-documentgetelementbyid
    document.querySelectorAll(`[data-testId=${FORM_ID}]`)[0].dispatchEvent(new Event('submit', { cancelable: true }))
  }

  const toggleOpen = () => setIsOpen(!isOpen)

  const closeModal = () => setIsOpen(false)

  return (
    <>
      <ButtonLink onClick={toggleOpen} size="lg" testId="manage-apps-btn">
        Manage Apps
      </ButtonLink>
      {isOpen && (
        <ManageListModal
          addButtonLabel="Add custom app"
          defaultIconUrl={appsIconSvg}
          formBody={getAddAppForm()}
          formSubmitLabel="Save"
          isSubmitFormDisabled={isSubmitDisabled}
          itemList={items}
          onClose={closeModal}
          onItemToggle={onItemToggle}
          onSubmitForm={onSubmitForm}
        />
      )}
    </>
  )
}

export default ManageApps
