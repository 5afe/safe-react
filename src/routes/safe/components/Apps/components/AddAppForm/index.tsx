import { TextField } from '@gnosis.pm/safe-react-components'
import React, { useState, ReactElement } from 'react'
import styled from 'styled-components'

import { SafeApp } from 'src/routes/safe/components/Apps/types.d'
import GnoForm from 'src/components/forms/GnoForm'
import Img from 'src/components/layout/Img'

import AppAgreement from './AppAgreement'
import AppUrl, { AppInfoUpdater, appUrlResolver } from './AppUrl'
import FormButtons from './FormButtons'
import { APPS_STORAGE_KEY, getEmptySafeApp } from 'src/routes/safe/components/Apps/utils'
import { saveToStorage } from 'src/utils/storage'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import { useHistory, useRouteMatch } from 'react-router-dom'

const FORM_ID = 'add-apps-form'

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

export interface AddAppFormValues {
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
          <AppUrl appList={appList} />

          {/* Fetch app from url and return a SafeApp */}
          <AppInfoUpdater onAppInfo={setAppInfo} />

          <AppInfo>
            <Img alt="Token image" height={55} src={appInfo.iconUrl} />
            <StyledTextFileAppName label="App name" readOnly value={appInfo.name} onChange={() => {}} />
          </AppInfo>

          <AppAgreement />

          <FormButtons appInfo={appInfo} onCancel={closeModal} />
        </>
      )}
    </GnoForm>
  )
}

export default AddApp
