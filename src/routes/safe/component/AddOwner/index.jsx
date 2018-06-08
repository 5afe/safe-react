// @flow
import * as React from 'react'
import { List } from 'immutable'
import Stepper from '~/components/Stepper'
import { connect } from 'react-redux'
import { type Safe } from '~/routes/safe/store/model/safe'
import { type Owner, makeOwner } from '~/routes/safe/store/model/owner'
import { getSafeEthereumInstance, createTransaction } from '~/routes/safe/component/AddTransaction/createTransactions'
import { setOwners } from '~/utils/localStorage'
import AddOwnerForm, { NAME_PARAM, OWNER_ADDRESS_PARAM, INCREASE_PARAM } from './AddOwnerForm'
import Review from './Review'
import selector, { type SelectorProps } from './selector'
import actions, { type Actions } from './actions'

const getSteps = () => [
  'Fill Owner Form', 'Review Add order operation',
]

type Props = SelectorProps & Actions & {
  safe: Safe,
  threshold: number,
}

type State = {
  done: boolean,
}

export const ADD_OWNER_RESET_BUTTON_TEXT = 'RESET'

const getOwnerAddressesFrom = (owners: List<Owner>) => {
  if (!owners) {
    return []
  }

  return owners.map((owner: Owner) => owner.get('address'))
}

class AddOwner extends React.Component<Props, State> {
  state = {
    done: false,
  }

  onAddOwner = async (values: Object) => {
    try {
      const {
        safe, threshold, userAddress, fetchTransactions,
      } = this.props
      const nonce = Date.now()
      const newThreshold = values[INCREASE_PARAM] ? threshold + 1 : threshold
      const newOwnerAddress = values[OWNER_ADDRESS_PARAM]
      const newOwnerName = values[NAME_PARAM]
      const safeAddress = safe.get('address')
      const gnosisSafe = await getSafeEthereumInstance(safeAddress)
      const data = gnosisSafe.contract.addOwnerWithThreshold.getData(newOwnerAddress, newThreshold)
      await createTransaction(safe, `Add Owner ${newOwnerName}`, safeAddress, 0, nonce, userAddress, data)
      setOwners(safeAddress, safe.get('owners').push(makeOwner({ name: newOwnerName, address: newOwnerAddress })))
      fetchTransactions()
      this.setState({ done: true })
    } catch (error) {
      this.setState({ done: false })
      // eslint-disable-next-line
      console.log('Error while adding owner ' + error)
    }
  }

  onReset = () => {
    this.setState({ done: false })
  }

  render() {
    const { safe } = this.props
    const { done } = this.state
    const steps = getSteps()
    const finishedButton = <Stepper.FinishButton title={ADD_OWNER_RESET_BUTTON_TEXT} />
    const addresses = getOwnerAddressesFrom(safe.get('owners'))

    return (
      <React.Fragment>
        <Stepper
          finishedTransaction={done}
          finishedButton={finishedButton}
          onSubmit={this.onAddOwner}
          steps={steps}
          onReset={this.onReset}
        >
          <Stepper.Page numOwners={safe.get('owners').count()} threshold={safe.get('threshold')} addresses={addresses}>
            { AddOwnerForm }
          </Stepper.Page>
          <Stepper.Page>
            { Review }
          </Stepper.Page>
        </Stepper>
      </React.Fragment>
    )
  }
}

export default connect(selector, actions)(AddOwner)
