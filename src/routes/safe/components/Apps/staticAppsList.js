// @flow
import appsIconSvg from '../Transactions/TxsTable/TxType/assets/appsIcon.svg'

const appsUrl = process.env.REACT_APP_GNOSIS_APPS_URL
  ? process.env.REACT_APP_GNOSIS_APPS_URL
  : 'https://gnosis-apps.netlify.com'

export const staticAppsList = [`${appsUrl}/compound`, `${appsUrl}/uniswap`]

export const getAppInfo = (appId: string) => {
  const res = staticAppsList.find(app => app.url === appId.toString())
  if (!res) {
    return {
      id: appId,
      name: 'External App',
      url: null,
      iconUrl: appsIconSvg,
      description: 'No description provided',
      providedBy: {
        name: 'Unknown',
        url: null,
      },
    }
  }
  return res
}
