import React from 'react'

import AppCard, { TriggerType } from './index'

import AddAppIcon from 'src/routes/safe/components/Apps/assets/addApp.svg'

export default {
  title: 'Apps/AppCard',
  component: AppCard,
}

export const Loading = (): React.ReactElement => <AppCard isLoading />

export const AddCustomApp = (): React.ReactElement => (
  <AppCard iconUrl={AddAppIcon} onClick={console.log} buttonText="Add custom app" actionTrigger={TriggerType.Content} />
)

export const LoadedApp = (): React.ReactElement => (
  <AppCard
    iconUrl="https://cryptologos.cc/logos/versions/gnosis-gno-gno-logo-circle.svg?v=007"
    name="Gnosis"
    description="Gnosis safe app"
    actionTrigger={TriggerType.Button}
    onClick={console.log}
  />
)
