import { Icon, Link, Loader, Text, TextField } from '@gnosis.pm/safe-react-components'
import { useState, ReactElement, useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { SafeApp } from 'src/routes/safe/components/Apps/types'
import GnoForm from 'src/components/forms/GnoForm'
import Img from 'src/components/layout/Img'
import { Modal } from 'src/components/Modal'
import AppAgreement from './AppAgreement'
import AppUrl, { AppInfoUpdater, appUrlResolver } from './AppUrl'
import { FormButtons } from './FormButtons'
import { getEmptySafeApp } from 'src/routes/safe/components/Apps/utils'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { generateSafeRoute, extractPrefixedSafeAddress, SAFE_ROUTES } from 'src/routes/routes'
import { trackEvent } from 'src/utils/googleTagManager'
import { SAFE_APPS_EVENTS } from 'src/utils/events/safeApps'

const FORM_ID = 'add-apps-form'

const StyledTextFileAppName = styled(TextField)`
  && {
    width: 385px;
    .MuiFormLabel-root {
      &.Mui-disabled {
        color: rgba(0, 0, 0, 0.54);
        &.Mui-error {
          color: ${(props) => props.theme.colors.error};
        }
      }
    }
    .MuiInputBase-root {
      .MuiFilledInput-input {
        color: rgba(0, 0, 0, 0.54);
      }
      &:before {
        border-bottom-style: inset;
      }
    }
  }
`

const AppInfo = styled.div`
  display: flex;
  margin: 36px 0 24px 0;

  img {
    margin-right: 10px;
  }
`

const StyledLink = styled(Link)`
  inline-size: fit-content;
`

const AppDocsInfo = styled.div`
  display: flex;
  margin-bottom: 24px;
  flex-direction: column;
  svg {
    position: relative;
    top: 4px;
    left: 4px;
  }
`

const WrapperLoader = styled.div`
  height: 55px;
  width: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledLoader = styled(Loader)`
  margin-right: 15px;
`

interface AddAppFormValues {
  appUrl: string
  agreementAccepted: boolean
}

const INITIAL_VALUES: AddAppFormValues = {
  appUrl: '',
  agreementAccepted: false,
}

const DEFAULT_APP_INFO = getEmptySafeApp()

const CUSTOM_SAFE_APPS_LINK = 'https://docs.gnosis-safe.io/build/sdks/safe-apps'

interface AddAppProps {
  appList: SafeApp[]
  closeModal: () => void
  onAddApp: (app: SafeApp) => void
}

const AddApp = ({ appList, closeModal, onAddApp }: AddAppProps): ReactElement => {
  const [appInfo, setAppInfo] = useState<SafeApp>(DEFAULT_APP_INFO)
  const [fetchError, setFetchError] = useState<string | undefined>()
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = useCallback(async () => {
    trackEvent(SAFE_APPS_EVENTS.ADD_CUSTOM_APP)
    onAddApp(appInfo)
    history.push({
      pathname: generateSafeRoute(SAFE_ROUTES.APPS, extractPrefixedSafeAddress()),
      search: `?appUrl=${encodeURIComponent(appInfo.url)}`,
    })
  }, [history, appInfo, onAddApp])

  useEffect(() => {
    if (isLoading) {
      setFetchError(undefined)
    }
  }, [isLoading])

  const onError = useCallback(
    (error: Error) => {
      setFetchError(error.message)
      logError(Errors._903, error.message)
      setAppInfo(DEFAULT_APP_INFO)
    },
    [setAppInfo],
  )

  return (
    <GnoForm decorators={[appUrlResolver]} initialValues={INITIAL_VALUES} onSubmit={handleSubmit} testId={FORM_ID}>
      {() => (
        <>
          <Modal.Body>
            <AppDocsInfo>
              <Text size="xl" as="span" color="secondary">
                Safe Apps are third-party extensions.
              </Text>
              <StyledLink
                href={CUSTOM_SAFE_APPS_LINK}
                target="_blank"
                rel="noreferrer"
                title="Learn more about building Safe Apps"
              >
                <Text size="xl" as="span" color="primary">
                  Learn more about building Safe Apps.
                </Text>
                <Icon size="sm" type="externalLink" color="primary" />
              </StyledLink>
            </AppDocsInfo>
            <AppUrl appList={appList} />
            {/* Fetch app from url and return a SafeApp */}
            <AppInfoUpdater onAppInfo={setAppInfo} onLoading={setIsLoading} onError={onError} />
            <AppInfo>
              {isLoading ? (
                <WrapperLoader>
                  <StyledLoader size="sm" />
                </WrapperLoader>
              ) : (
                <Img alt="Token image" width={55} src={appInfo.iconUrl} />
              )}
              <StyledTextFileAppName
                label="App name"
                disabled
                meta={{ error: fetchError }}
                value={isLoading ? 'Loading...' : appInfo.name === DEFAULT_APP_INFO.name ? '' : appInfo.name}
                onChange={() => {}}
              />
            </AppInfo>
            <AppAgreement />
          </Modal.Body>
          <Modal.Footer>
            <FormButtons appInfo={appInfo} onCancel={closeModal} />
          </Modal.Footer>
        </>
      )}
    </GnoForm>
  )
}

export default AddApp
