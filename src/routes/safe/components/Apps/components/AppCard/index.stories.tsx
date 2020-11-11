import React from 'react'

import App from './index'

import AddAppIcon from 'src/routes/safe/components/Apps/assets/addApp.svg'

export default {
  title: 'Apps/AppCard',
  component: App,
}

export const Loading = (): React.ReactElement => <App isLoading />

export const AddCustomApp = (): React.ReactElement => (
  <App iconUrl={AddAppIcon} onButtonClick={console.log} buttonText="Add custom app" />
)

export const LoadedApp = (): React.ReactElement => (
  <App
    iconUrl="https://cryptologos.cc/logos/versions/gnosis-gno-gno-logo-circle.svg?v=007"
    name="Gnosis"
    description="Gnosis safe app"
  />
)
