// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import contract from 'truffle-contract'
import Stepper from '~/components/Stepper'
import PageFrame from '~/components/layout/PageFrame'
import { getAccountsFrom, getThresholdFrom } from '~/routes/open/utils/safeDataExtractor'
import SafeFields, { safeFieldsValidation } from '~/routes/open/components/SafeForm'
import { getWeb3 } from '~/wallets/getWeb3'
import { promisify } from '~/utils/promisify'
import Safe from '#/GnosisSafe.json'
import selector from './selector'

type Props = {
  provider: string,
  userAccount: string,
}

const getSteps = () => [
  'Fill Safe Form', 'Review Information', 'Deploy it',
]

const initialValuesFrom = (userAccount: string) => ({
  owner0Address: userAccount,
})

class Open extends React.Component<Props> {
  constructor() {
    super()

    this.safe = contract(Safe)
  }

  onCallSafeContractSubmit = async (values) => {
    try {
      const { userAccount } = this.props
      const accounts = getAccountsFrom(values)
      const numConfirmations = getThresholdFrom(values)

      const web3 = getWeb3()
      this.safe.setProvider(web3.currentProvider)

      const safeInstance = await this.safe.new(accounts, numConfirmations, 0, 0, { from: userAccount, gas: '5000000' })
      const { transactionHash } = safeInstance

      const transactionReceipt = await promisify(cb => web3.eth.getTransactionReceipt(transactionHash, cb))
      // eslint-disable-next-line
      console.log(`Transaction Receipt${JSON.stringify(transactionReceipt)}`)
      // this.setState({ safeAddress: safeInstance.address })
    } catch (error) {
      // eslint-disable-next-line
      console.log('Error while creating the Safe' + error)
    }
  }

  safe: any

  render() {
    const { provider, userAccount } = this.props
    const steps = getSteps()

    return (
      <PageFrame>
        { provider
          ? (
            <Stepper
              onSubmit={this.onCallSafeContractSubmit}
              steps={steps}
              initialValue={initialValuesFrom(userAccount)}
            >
              <Stepper.Page validate={safeFieldsValidation}>
                { SafeFields }
              </Stepper.Page>
            </Stepper>
          )
          : <div>No metamask detected</div>
        }
      </PageFrame>
    )
  }
}

export default connect(selector)(Open)
