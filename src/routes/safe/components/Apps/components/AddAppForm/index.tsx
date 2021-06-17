import { Icon, Link, Loader, Text, TextField } from '@gnosis.pm/safe-react-components'
import React, { useState, ReactElement } from 'react'
import styled from 'styled-components'

import { SafeApp } from 'src/routes/safe/components/Apps/types'
import GnoForm from 'src/components/forms/GnoForm'
import Img from 'src/components/layout/Img'
import { Modal } from 'src/components/Modal'

import AppAgreement from './AppAgreement'
import AppUrl, { AppInfoUpdater, appUrlResolver } from './AppUrl'
import { FormButtons } from './FormButtons'
import { APPS_STORAGE_KEY, getEmptySafeApp } from 'src/routes/safe/components/Apps/utils'
import { saveToStorage } from 'src/utils/storage'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import { useHistory, useRouteMatch } from 'react-router-dom'

const FORM_ID = 'add-apps-form'

const StyledTextFileAppName = styled(TextField)`
  && {
    width: 385px;
  }
`

const AppInfo = styled.div`
  display: flex;
  margin: 36px 0 24px 0;

  img {
    margin-right: 10px;
  }
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

const APP_INFO = getEmptySafeApp()

interface AddAppProps {
  appList: SafeApp[]
  closeModal: () => void
}

const AddApp = ({ appList, closeModal }: AddAppProps): ReactElement => {
  const [appInfo, setAppInfo] = useState<SafeApp>(APP_INFO)
  const history = useHistory()
  const matchSafeWithAddress = useRouteMatch<{ safeAddress: string }>({ path: `${SAFELIST_ADDRESS}/:safeAddress` })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = () => {
    const newAppList = [
      { url: appInfo.url, disabled: false },
      ...appList.map(({ url, disabled }) => ({ url, disabled })),
    ]
    saveToStorage(APPS_STORAGE_KEY, newAppList)
    const goToApp = `${matchSafeWithAddress?.url}/apps?appUrl=${encodeURI(appInfo.url)}`
    history.push(goToApp)
  }

  return (
    <GnoForm decorators={[appUrlResolver]} initialValues={INITIAL_VALUES} onSubmit={handleSubmit} testId={FORM_ID}>
      {() => (
        <>
          <Modal.Body>
            <AppDocsInfo>
              <Text size="xl" as="span" color="secondary">
                Safe Apps are third-party extensions.
              </Text>
              <Link
                href="https://docs.gnosis.io/safe/docs/sdks_safe_apps/"
                target="_blank"
                rel="noreferrer"
                title="Learn more about building Safe Apps"
              >
                <Text size="xl" as="span" color="primary">
                  Learn more about building Safe Apps.
                </Text>
                <Icon size="sm" type="externalLink" color="primary" />
              </Link>
            </AppDocsInfo>
            <AppUrl appList={appList} />
            {/* Fetch app from url and return a SafeApp */}
            <AppInfoUpdater onAppInfo={setAppInfo} onLoading={setIsLoading} />
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
                readOnly
                value={isLoading ? 'Loading...' : appInfo.name}
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
