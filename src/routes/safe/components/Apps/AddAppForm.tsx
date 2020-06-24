import { Checkbox, Text, TextField } from '@gnosis.pm/safe-react-components'
import memoize from 'lodash.memoize'
import React, { useState } from 'react'
import { FormSpy } from 'react-final-form'
import styled from 'styled-components'

import Field from 'src/components/forms/Field'
import DebounceValidationField from 'src/components/forms/Field/DebounceValidationField'
import GnoForm from 'src/components/forms/GnoForm'
import { required } from 'src/components/forms/validator'
import Img from 'src/components/layout/Img'
import { getContentFromENS } from 'src/logic/wallets/getWeb3'
import appsIconSvg from 'src/routes/safe/components/Transactions/TxsTable/TxType/assets/appsIcon.svg'
import { isValid as isURLValid } from 'src/utils/url'

import { getAppInfoFromUrl } from './utils'
import { SafeApp } from './types'

const APP_INFO: SafeApp = {
  id: undefined,
  url: '',
  name: '',
  iconUrl: appsIconSvg,
  error: false,
}

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

const uniqueAppValidator = memoize((appList, value) => {
  const exists = appList.some((a) => {
    try {
      const currentUrl = new URL(a.url)
      const newUrl = new URL(value)
      return currentUrl.href === newUrl.href
    } catch (error) {
      return 'There was a problem trying to validate the URL existence.'
    }
  })
  return exists ? 'This app is already registered.' : undefined
})

const getIpfsLinkFromEns = memoize(async (name) => {
  try {
    const content = await getContentFromENS(name)
    if (content && content.protocolType === 'ipfs') {
      return `${process.env.REACT_APP_IPFS_GATEWAY}/${content.decoded}/`
    }
  } catch (error) {
    console.error(error)
    return undefined
  }
})

const getUrlFromFormValue = memoize(async (value: string) => {
  const isUrlValid = isURLValid(value)
  let ensContent
  if (!isUrlValid) {
    ensContent = await getIpfsLinkFromEns(value)
  }

  if (!isUrlValid && ensContent === undefined) {
    return undefined
  }
  return isUrlValid ? value : ensContent
})

const curriedSafeAppValidator = memoize((appList) => async (value: string) => {
  const url = await getUrlFromFormValue(value)

  if (!url) {
    return 'Provide a valid url or ENS name.'
  }

  const appExistsRes = uniqueAppValidator(appList, url)
  if (appExistsRes) {
    return appExistsRes
  }

  const appInfo = await getAppInfoFromUrl(url)
  if (appInfo.error) {
    return 'This is not a valid Safe app.'
  }
})

const composeValidatorsApps = (...validators) => (value, values, meta) => {
  if (!meta.modified) {
    return
  }
  return validators.reduce((error, validator) => error || validator(value), undefined)
}

type Props = {
  formId: string
  appList: Array<SafeApp>
  closeModal: () => void
  onAppAdded: (app: SafeApp) => void
  setIsSubmitDisabled: (status: boolean) => void
}

const AddAppForm = ({ appList, formId, closeModal, onAppAdded, setIsSubmitDisabled }: Props) => {
  const [appInfo, setAppInfo] = useState<SafeApp>(APP_INFO)
  const safeAppValidator = curriedSafeAppValidator(appList)

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

  const handleSubmit = () => {
    closeModal()
    onAppAdded(appInfo)
  }

  const onTextFieldChange = () => {}

  return (
    <GnoForm
      initialValues={{
        appUrl: '',
        agreed: false,
      }}
      // submit is triggered from ManageApps Component
      onSubmit={handleSubmit}
      testId={formId}
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
            <StyledTextFileAppName label="App name" readOnly value={appInfo.name} onChange={onTextFieldChange} />
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

export default AddAppForm
