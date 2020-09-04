import { Text, TextField } from '@gnosis.pm/safe-react-components'
import React from 'react'
import styled from 'styled-components'

import AppAgreement from './AppAgreement'
import AppUrl, { AppInfoUpdater, appUrlResolver } from './AppUrl'
import SubmitButtonStatus from './SubmitButtonStatus'

import { SafeApp } from 'src/routes/safe/components/Apps/types.d'
import GnoForm from 'src/components/forms/GnoForm'
import Img from 'src/components/layout/Img'
import appsIconSvg from 'src/routes/safe/components/Transactions/TxsTable/TxType/assets/appsIcon.svg'

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

export interface AddAppFormValues {
  appUrl: string
  agreementAccepted: boolean
}

const INITIAL_VALUES: AddAppFormValues = {
  appUrl: '',
  agreementAccepted: false,
}

const APP_INFO: SafeApp = {
  id: '',
  url: '',
  name: '',
  iconUrl: appsIconSvg,
  error: false,
  description: '',
}

interface AddAppProps {
  appList: SafeApp[]
  closeModal: () => void
  formId: string
  onAppAdded: (app: SafeApp) => void
  setIsSubmitDisabled: (disabled: boolean) => void
}

const AddApp = ({ appList, closeModal, formId, onAppAdded, setIsSubmitDisabled }: AddAppProps): React.ReactElement => {
  const [appInfo, setAppInfo] = React.useState<SafeApp>(APP_INFO)

  const handleSubmit = () => {
    closeModal()
    onAppAdded(appInfo)
  }

  return (
    <GnoForm decorators={[appUrlResolver]} initialValues={INITIAL_VALUES} onSubmit={handleSubmit} testId={formId}>
      {() => (
        <>
          <StyledText size="xl">Add custom app</StyledText>

          <AppUrl appList={appList} />
          {/* Fetch app from url and return a SafeApp */}
          <AppInfoUpdater onAppInfo={setAppInfo} />

          <AppInfo>
            <Img alt="Token image" height={55} src={appInfo.iconUrl} />
            <StyledTextFileAppName label="App name" readOnly value={appInfo.name} onChange={() => {}} />
          </AppInfo>

          <AppAgreement />

          <SubmitButtonStatus onSubmitButtonStatusChange={setIsSubmitDisabled} appInfo={appInfo} />
        </>
      )}
    </GnoForm>
  )
}

export default AddApp
