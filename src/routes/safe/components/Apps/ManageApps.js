// @flow
import { ButtonLink, Checkbox, ManageListModal, Text, TextField } from '@gnosis.pm/safe-react-components'
import React, { useState } from 'react'
import { FormSpy } from 'react-final-form'
import styled from 'styled-components'

import { getAppInfoFromUrl } from './utils'

import Field from '~/components/forms/Field'
import DebounceValidationField from '~/components/forms/Field/DebounceValidationField'
import GnoForm from '~/components/forms/GnoForm'
import { composeValidatorsApps, required } from '~/components/forms/validator'
import Img from '~/components/layout/Img'
import appsIconSvg from '~/routes/safe/components/Transactions/TxsTable/TxType/assets/appsIcon.svg'

const FORM_ID = 'add-apps-form'

const StyledText = styled(Text)`
  margin-bottom: 19px;
`

const StyledTextFileAppName = styled(TextField)`
  && {
    width: 335px;
  }
`

const AppInfo = styled.div`
  margin: 36px 0 24px 0;

  img {
    margin-right: 10px;
  }
`

const StyledCheckbox = styled(Checkbox)`
  margin: 0;
`
const APP_INFO = { iconUrl: appsIconSvg, name: '', error: false }

type Props = {
  appList: Array<{
    id: string,
    iconUrl: string,
    name: string,
    disabled: boolean,
  }>,
  onAppAdded: (app: any) => void,
  onAppToggle: (appId: string, enabled: boolean) => void,
}

const urlValidator = (value: string) => {
  return /(?:^|[ \t])((https?:\/\/)?(?:localhost|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?)/gm.test(value)
    ? undefined
    : 'Please, provide a valid url'
}

const ManageApps = ({ appList, onAppAdded, onAppToggle }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const [appInfo, setAppInfo] = useState(APP_INFO)
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)

  const onItemToggle = (itemId: string, checked: boolean) => {
    onAppToggle(itemId, checked)
  }

  const handleSubmit = () => {
    setIsOpen(false)
    onAppAdded(appInfo)
  }

  const cleanAppInfo = () => setAppInfo(APP_INFO)

  const safeAppValidator = async (value) => {
    const appInfo = await getAppInfoFromUrl(value)

    if (appInfo.error) {
      setAppInfo(APP_INFO)
      return 'This is not a valid Safe app.'
    }

    setAppInfo({ ...appInfo })
  }

  const uniqueAppValidator = (value) => {
    const exists = appList.find((a) => a.url === value.trim())
    return exists ? 'This app is already registered.' : undefined
  }

  const onFormStatusChange = ({ pristine, valid, validating }) => {
    if (!pristine) {
      setIsSubmitDisabled(validating || !valid || appInfo.error)
    }
  }

  const customRequiredValidator = (value) => {
    if (!value || !value.length) {
      setAppInfo(APP_INFO)
      return 'Required'
    }
  }

  const getAddAppForm = () => {
    return (
      <GnoForm
        initialValues={{
          appUrl: '',
          agreed: false,
        }}
        onSubmit={handleSubmit}
        testId={FORM_ID}
      >
        {() => (
          <>
            <StyledText size="xl">Add custom app</StyledText>
            <DebounceValidationField
              component={TextField}
              label="App URL"
              name="appUrl"
              placeholder="App URL"
              type="text"
              validate={composeValidatorsApps(
                customRequiredValidator,
                urlValidator,
                uniqueAppValidator,
                safeAppValidator,
              )}
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
                validating: true,
              }}
            />

            <Field
              component={StyledCheckbox}
              label={
                <p>
                  This app is not a Gnosis product and I agree to use this app <br /> at my own risk.
                </p>
              }
              name="agreed"
              type="checkbox"
              validate={required}
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

  const closeModal = () => {
    setIsOpen(false)
    cleanAppInfo()
  }

  const getItemList = () =>
    appList.map((a) => {
      return { ...a, checked: !a.disabled }
    })

  return (
    <>
      <ButtonLink color="primary" onClick={toggleOpen}>
        Manage Apps
      </ButtonLink>
      {isOpen && (
        <ManageListModal
          addButtonLabel="Add custom app"
          defaultIconUrl={appsIconSvg}
          formBody={getAddAppForm()}
          formSubmitLabel="Save"
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
