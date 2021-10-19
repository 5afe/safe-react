import { useEffect } from 'react'
import { TextField } from '@gnosis.pm/safe-react-components'
import createDecorator from 'final-form-calculate'
import { useField, useFormState } from 'react-final-form'
import styled from 'styled-components'

import { SafeApp } from 'src/routes/safe/components/Apps/types'
import { getAppInfoFromUrl, getIpfsLinkFromEns, uniqueApp } from 'src/routes/safe/components/Apps/utils'
import { composeValidators, required } from 'src/components/forms/validator'
import Field from 'src/components/forms/Field'
import { isValidURL } from 'src/utils/url'
import { isValidEnsName } from 'src/logic/wallets/ethAddresses'
import { useDebounce } from 'src/logic/hooks/useDebounce'

const validateUrl = (url: string): string | undefined => (isValidURL(url) ? undefined : 'Invalid URL')

export const appUrlResolver = createDecorator({
  field: 'appUrl',
  updates: {
    appUrl: async (appUrl: string): Promise<string | undefined> => {
      const ensContent = !isValidURL(appUrl) && isValidEnsName(appUrl) && (await getIpfsLinkFromEns(appUrl))

      if (ensContent) {
        return ensContent
      }

      return appUrl
    },
  },
})

type AppInfoUpdaterProps = {
  onAppInfo: (appInfo: SafeApp) => unknown
  onLoading: (isLoading: boolean) => unknown
  onError: (error: Error) => unknown
}

export const AppInfoUpdater = ({ onAppInfo, onLoading, onError }: AppInfoUpdaterProps): null => {
  const {
    input: { value: appUrl },
  } = useField('appUrl', { subscription: { value: true } })

  const debouncedValue = useDebounce(appUrl, 500)

  useEffect(() => {
    const updateAppInfo = async () => {
      onLoading(true)

      try {
        const appInfo = await getAppInfoFromUrl(debouncedValue)
        onAppInfo({ ...appInfo })
      } catch (error) {
        onError?.(error)
      }

      onLoading(false)
    }

    if (isValidURL(debouncedValue)) {
      updateAppInfo()
    }
  }, [debouncedValue, onAppInfo, onError, onLoading])

  return null
}

const StyledAppUrlField = styled(Field)`
  && {
    width: 100%;
  }
`

const AppUrl = ({ appList }: { appList: SafeApp[] }): React.ReactElement => {
  const { visited } = useFormState({ subscription: { visited: true } })

  // trick to prevent having the field validated by default. Not sure why this happens in this form
  const validate = !visited?.appUrl ? undefined : composeValidators(required, validateUrl, uniqueApp(appList))

  return (
    <StyledAppUrlField
      label="App URL"
      name="appUrl"
      placeholder="App URL"
      type="text"
      component={TextField}
      validate={validate}
      autoComplete="off"
    />
  )
}

export default AppUrl
