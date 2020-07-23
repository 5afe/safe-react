import { Checkbox, Text, TextField } from '@gnosis.pm/safe-react-components'
import createDecorator from 'final-form-calculate'
import memoize from 'lodash.memoize'
import React from 'react'
import { useField, useFormState } from 'react-final-form'
import styled from 'styled-components'
import { useDebounce } from 'use-lodash-debounce'

import { SafeApp } from './types'
import { getAppInfoFromUrl } from './utils'

import Field from 'src/components/forms/Field'
import GnoForm from 'src/components/forms/GnoForm'
import { composeValidators, required } from 'src/components/forms/validator'
import Img from 'src/components/layout/Img'
import { getContentFromENS } from 'src/logic/wallets/getWeb3'
import { isValidEnsName } from 'src/logic/wallets/ethAddresses'
import appsIconSvg from 'src/routes/safe/components/Transactions/TxsTable/TxType/assets/appsIcon.svg'
import { isValid as isURLValid } from 'src/utils/url'

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

const getIpfsLinkFromEns = memoize(async (name: string) => {
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

type AddAppFromProps = {
  appList: SafeApp[]
  closeModal: () => void
  formId: string
  onAppAdded: (app: SafeApp) => void
  setIsSubmitDisabled: (status: boolean) => void
}

const uniqueApp = (appList: SafeApp[]) => (url: string) => {
  const exists = appList.some((a) => {
    try {
      const currentUrl = new URL(a.url)
      const newUrl = new URL(url)
      return currentUrl.href === newUrl.href
    } catch (error) {
      console.error('There was a problem trying to validate the URL existence.', error.message)
      return false
    }
  })
  return exists ? 'This app is already registered.' : undefined
}

const AppInfoUpdater = ({ onAppInfo }: { onAppInfo: (appInfo: SafeApp) => void }): React.ReactElement => {
  const {
    input: { value: appUrl },
  } = useField('appUrl', { subscription: { value: true } })
  const debouncedValue = useDebounce(appUrl, 500)

  React.useEffect(() => {
    const updateAppInfo = async () => {
      const appInfo = await getAppInfoFromUrl(debouncedValue)
      onAppInfo({ ...appInfo })
    }
    updateAppInfo()
  }, [debouncedValue, onAppInfo])

  return null
}

const appUrlResolver = createDecorator({
  field: 'appUrl',
  updates: {
    appUrl: async (appUrl: string): Promise<string | undefined> => {
      const ensContent = !isURLValid(appUrl) && isValidEnsName(appUrl) && (await getIpfsLinkFromEns(appUrl))

      if (ensContent) {
        return ensContent
      }

      return appUrl
    },
  },
})

const validateUrl = (url: string): string | undefined => (isURLValid(url) ? undefined : 'Invalid URL')

const AppUrl = ({ appList }: { appList: SafeApp[] }): React.ReactElement => (
  <Field
    label="App URL"
    name="appUrl"
    placeholder="App URL"
    type="text"
    component={TextField}
    validate={composeValidators(required, validateUrl, uniqueApp(appList))}
  />
)

const AppAgreement = (): React.ReactElement => (
  <Field
    component={StyledCheckbox}
    label={
      <Text size="xl">
        This app is not a Gnosis product and I agree to use this app
        <br />
        at my own risk.
      </Text>
    }
    name="agreement"
    type="checkbox"
    validate={required}
  />
)

const SubmitButtonStatus = ({
  appInfo,
  isSubmitDisabled,
}: {
  appInfo: SafeApp
  isSubmitDisabled: (disabled: boolean) => void
}): React.ReactElement => {
  const { valid, validating, values } = useFormState({ subscription: { valid: true, validating: true, values: true } })

  React.useEffect(() => {
    console.log(validating, valid, appInfo.error, appInfo.url, appInfo.name, values)
    isSubmitDisabled(
      validating || !valid || appInfo.error || !appInfo.url || !appInfo.name || appInfo.name === 'unknown',
    )
  }, [validating, valid, appInfo.error, appInfo.url, appInfo.name, values, isSubmitDisabled])

  return null
}

const AddApp = ({
  appList,
  closeModal,
  formId,
  onAppAdded,
  setIsSubmitDisabled,
}: AddAppFromProps): React.ReactElement => {
  const [appInfo, setAppInfo] = React.useState<SafeApp>(APP_INFO)

  const initialValues = {
    appUrl: '',
    agreement: false,
  }

  const handleSubmit = () => {
    closeModal()
    onAppAdded(appInfo)
  }

  return (
    <GnoForm
      decorators={[appUrlResolver]}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      subscription={{ values: true }}
      testId={formId}
    >
      {() => (
        <>
          <StyledText size="xl">Add custom app</StyledText>

          <AppUrl appList={appList} />
          <AppInfoUpdater onAppInfo={setAppInfo} />

          <AppInfo>
            <Img alt="Token image" height={55} src={appInfo.iconUrl} />
            <StyledTextFileAppName label="App name" readOnly value={appInfo.name} onChange={() => {}} />
          </AppInfo>

          <AppAgreement />

          <SubmitButtonStatus isSubmitDisabled={setIsSubmitDisabled} appInfo={appInfo} />
        </>
      )}
    </GnoForm>
  )
}

export default AddApp
