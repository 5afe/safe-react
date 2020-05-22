import { ButtonLink, Checkbox, ManageListModal, Text, TextField } from '@gnosis.pm/safe-react-components'
import React, { useState } from 'react'
import { FormSpy } from 'react-final-form'
import styled from 'styled-components'

import { getAppInfoFromUrl } from './utils'
import Field from 'src/components/forms/Field'
import DebounceValidationField from 'src/components/forms/Field/DebounceValidationField'
import GnoForm from 'src/components/forms/GnoForm'
import { required } from 'src/components/forms/validator'
import Img from 'src/components/layout/Img'
import { getContentFromENS } from 'src/logic/wallets/getWeb3'
import appsIconSvg from 'src/routes/safe/components/Transactions/TxsTable/TxType/assets/appsIcon.svg'
import { isValid as isURLValid } from 'src/utils/url'

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
    id: string
    url: string
    iconUrl: string
    name: string
    disabled: boolean
  }>
  onAppAdded: (app: any) => void
  onAppToggle: (appId: string, enabled: boolean) => void
}

const composeValidatorsApps = (...validators: Function[]) => (value, values, meta) => {
  if (!meta.modified) {
    return
  }
  return validators.reduce((error, validator) => error || validator(value), undefined)
}

const getIpfsLinkFromEns = async (name) => {
  try {
    const content = await getContentFromENS(name)
    if (content && content.protocolType === 'ipfs') {
      return `${process.env.REACT_APP_IPFS_GATEWAY}/${content.decoded}/`
    }
  } catch (error) {
    console.error(error)
    return undefined
  }
}

const getUrlFromFormValue = async (value: string) => {
  const isUrlValid = isURLValid(value)
  let ensContent
  if (!isUrlValid) {
    ensContent = await getIpfsLinkFromEns(value)
  }

  if (!isUrlValid && ensContent === undefined) {
    return undefined
  }
  return isUrlValid ? value : ensContent
}

const uniqueAppValidator = (appList, value) => {
  const exists = appList.find((a) => {
    try {
      const currentUrl = new URL(a.url)
      const newUrl = new URL(value)
      return currentUrl.href === newUrl.href
    } catch (error) {
      return 'There was a problem trying to validate the URL existence.'
    }
  })
  return exists ? 'This app is already registered.' : undefined
}

const curriedSafeAppValidator = (appList) => async (value: string) => {
  const url = await getUrlFromFormValue(value)

  if (!url) {
    return 'Provide a valid url or ENS name.'
  }

  const resUniqueValidator = uniqueAppValidator(appList, url)
  if (resUniqueValidator) {
    return resUniqueValidator
  }

  const appInfo = await getAppInfoFromUrl(url)
  if (appInfo.error) {
    return 'This is not a valid Safe app.'
  }
}

const ManageApps = ({ appList, onAppAdded, onAppToggle }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [appInfo, setAppInfo] = useState(APP_INFO)
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)

  const onItemToggle = (itemId, checked) => {
    onAppToggle(itemId, checked)
  }

  const handleSubmit = () => {
    setIsOpen(false)
    onAppAdded(appInfo)
  }

  const cleanAppInfo = () => setAppInfo(APP_INFO)

  const onFormStatusChange = async ({ pristine, valid, validating, values, errors }) => {
    if (!pristine) {
      setIsSubmitDisabled(validating || !valid)
    }

    if (validating) {
      return
    }

    if (!values.appUrl || !values.appUrl.length || errors.appUrl) {
      setAppInfo(APP_INFO)
      return
    }

    const url = await getUrlFromFormValue(values.appUrl)
    const appInfo = await getAppInfoFromUrl(url)
    setAppInfo({ ...appInfo })
  }

  const safeAppValidator = curriedSafeAppValidator(appList)

  const getForm = () => {
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
              validate={composeValidatorsApps(required, safeAppValidator)}
            />

            <AppInfo>
              <Img alt="Token image" height={55} src={appInfo.iconUrl} />
              <StyledTextFileAppName label="App name" readOnly value={appInfo.name} />
            </AppInfo>

            <FormSpy
              onChange={onFormStatusChange}
              subscription={{
                values: true,
                valid: true,
                errors: true,
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
          formBody={getForm()}
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
