// @flow
import appsIconSvg from '../Transactions/TxsTable/TxType/assets/appsIcon.svg'

const appsUrl = process.env.REACT_APP_GNOSIS_APPS_URL
  ? process.env.REACT_APP_GNOSIS_APPS_URL
  : 'https://gnosis-apps.netlify.com'

const appList = [
  {
    id: '1',
    name: 'Compound',
    url: `${appsUrl}/compound`,
    iconUrl: 'https://compound.finance/images/compound-mark.svg',
    description: '',
    providedBy: { name: 'Gnosis', url: '' },
  },
  {
    id: '2',
    name: 'ENS Manager',
    url: `${appsUrl}/ens`,
    iconUrl: 'https://app.ens.domains/static/media/ensIconLogo.4d995d23.svg',
    description: '',
    providedBy: { name: 'Gnosis', url: '' },
  },
  {
    id: '3',
    name: 'Uniswap',
    url: `${appsUrl}/uniswap`,
    iconUrl:
      'https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/spaces%2F-LNun-MDdANv-PeRglM0%2Favatar.png?generation=1538584950851432&alt=media',
    description: '',
    providedBy: { name: 'Gnosis', url: '' },
  },
  // {
  //   id: '4',
  //   name: 'Nexus Mutual',
  //   url: '',
  //   iconUrl:
  //     'https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/spaces%2F-LK136DM17k-0Gl82Q9B%2Favatar.png?generation=1534411701476772&alt=media',
  //   description: '',
  //   providedBy: {
  //     name: 'Gnosis',
  //     url: '',
  //   },
  // },
]

export default appList

export const getAppInfo = (appId: string) => {
  const res = appList.find((app) => app.id === appId.toString())
  if (!res) {
    return {
      id: 0,
      name: 'External App',
      url: null,
      iconUrl: appsIconSvg,
      description: null,
      providedBy: {
        name: null,
        url: null,
      },
    }
  }
  return res
}
