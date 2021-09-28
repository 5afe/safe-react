import AppCard from './index'

import AddAppIcon from 'src/routes/safe/components/Apps/assets/addApp.svg'

export default {
  title: 'Apps/AppCard',
  component: AppCard,
}

export const Loading = (): React.ReactElement => <AppCard to="" isLoading />

export const AddCustomApp = (): React.ReactElement => (
  <AppCard to="" iconUrl={AddAppIcon} onClick={console.log} buttonText="Add custom app" />
)

export const LoadedApp = (): React.ReactElement => (
  <AppCard
    to=""
    iconUrl="https://cryptologos.cc/logos/versions/gnosis-gno-gno-logo-circle.svg?v=007"
    name="Gnosis"
    description="Gnosis safe app"
    onClick={console.log}
  />
)
