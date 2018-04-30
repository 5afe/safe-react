// @flow
import * as React from 'react'
import { connect } from 'react-redux'

import Page from '~/components/layout/Page'
import { getAccountsFrom, getThresholdFrom, getNamesFrom, getSafeNameFrom, getDailyLimitFrom } from '~/routes/open/utils/safeDataExtractor'
import { getWeb3 } from '~/wallets/getWeb3'
import {
  getCreateAddExtensionContract,
  getCreateDailyLimitExtensionContract,
  getCreateProxyFactoryContract,
  getGnosisSafeContract,
} from '~/wallets/safeContracts'
import selector from './selector'
import actions, { type Actions } from './actions'
import Layout from '../components/Layout'

type Props = Actions & {
  provider: string,
  userAccount: string,
}

type State = {
  safeAddress: string,
  safeTx: string,
}

const createSafe = async (values, userAccount, addSafe): State => {
  const accounts = getAccountsFrom(values)
  const numConfirmations = getThresholdFrom(values)
  const name = getSafeNameFrom(values)
  const owners = getNamesFrom(values)
  const dailyLimit = getDailyLimitFrom(values)

  const web3 = getWeb3()
  const GnosisSafe = getGnosisSafeContract(web3)
  const ProxyFactory = getCreateProxyFactoryContract(web3)
  const CreateAndAddExtension = getCreateAddExtensionContract(web3)
  const DailyLimitExtension = getCreateDailyLimitExtensionContract(web3)

  // Create Master Copies
  const proxyFactory = await ProxyFactory.new({ from: userAccount, gas: '5000000' })
  const createAndAddExtension = await CreateAndAddExtension.new({ from: userAccount, gas: '5000000' })

  // Initialize safe master copy
  const gnosisSafeMasterCopy = await GnosisSafe.new({ from: userAccount, gas: '5000000' })
  gnosisSafeMasterCopy.setup([userAccount], 1, 0, 0, { from: userAccount, gas: '5000000' })

  // Initialize extension master copy
  const dailyLimitExtensionMasterCopy = await DailyLimitExtension.new({ from: userAccount, gas: '5000000' })
  dailyLimitExtensionMasterCopy.setup([], [], { from: userAccount, gas: '5000000' })

  // Create Gnosis Safe and Daily Limit Extension in one transactions
  const extensionData = await dailyLimitExtensionMasterCopy.contract.setup.getData([0], [100], { from: userAccount, gas: '5000000' })
  const proxyFactoryData = await proxyFactory.contract.createProxy.getData(dailyLimitExtensionMasterCopy.address, extensionData, { from: userAccount, gas: '5000000' })
  const createAndAddExtensionData = createAndAddExtension.contract.createAndAddExtension.getData(proxyFactory.address, proxyFactoryData, { from: userAccount, gas: '5000000' })
  const gnosisSafeData = await gnosisSafeMasterCopy.contract.setup.getData(accounts, numConfirmations, createAndAddExtension.address, createAndAddExtensionData, { from: userAccount, gas: '5000000' })
  const safe = await proxyFactory.createProxy(gnosisSafeMasterCopy.address, gnosisSafeData, { from: userAccount, gas: '5000000' })

  const param = safe.logs[1].args.proxy
  const safeContract = GnosisSafe.at(param)

  addSafe(name, safeContract.address, numConfirmations, dailyLimit, owners, accounts)

  return { safeAddress: safeContract.address, safeTx: safe }
}

class Open extends React.Component<Props, State> {
  constructor() {
    super()

    this.state = {
      safeAddress: '',
      safeTx: '',
    }
  }

  onCallSafeContractSubmit = async (values) => {
    try {
      const { userAccount, addSafe } = this.props
      const safeInstance = await createSafe(values, userAccount, addSafe)
      this.setState(safeInstance)
    } catch (error) {
      // eslint-disable-next-line
      console.log('Error while creating the Safe' + error)
    }
  }

  render() {
    const { safeAddress, safeTx } = this.state
    const { provider, userAccount } = this.props

    return (
      <Page>
        <Layout
          provider={provider}
          userAccount={userAccount}
          safeAddress={safeAddress}
          safeTx={safeTx}
          onCallSafeContractSubmit={this.onCallSafeContractSubmit}
        />
      </Page>
    )
  }
}

export default connect(selector, actions)(Open)
