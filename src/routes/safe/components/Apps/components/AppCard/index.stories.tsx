import { SafeAppAccessPolicyTypes } from '@gnosis.pm/safe-react-gateway-sdk'
import { FETCH_STATUS } from 'src/utils/requests'
import { getEmptySafeApp } from '../../utils'
import { AppCard, AddCustomAppCard } from './index'

export default {
  title: 'Apps/AppCard',
  component: AppCard,
}

export const Loading = (): React.ReactElement => <AppCard to="" app={getEmptySafeApp()} />

export const AddCustomApp = (): React.ReactElement => <AddCustomAppCard onClick={(): void => {}} />

export const LoadedApp = (): React.ReactElement => (
  <AppCard
    to=""
    app={{
      id: '228',
      url: '',
      name: 'Gnosis',
      iconUrl: 'https://cryptologos.cc/logos/versions/gnosis-gno-gno-logo-circle.svg?v=007',
      description: 'Boba Multisig app',
      fetchStatus: FETCH_STATUS.SUCCESS,
      chainIds: ['4'],
      accessControl: {
        type: SafeAppAccessPolicyTypes.NoRestrictions,
      },
    }}
  />
)
