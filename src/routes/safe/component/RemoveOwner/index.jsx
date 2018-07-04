// @flow
import * as React from 'react'
import Stepper from '~/components/Stepper'
import { connect } from 'react-redux'
import { type Safe } from '~/routes/safe/store/model/safe'
import { getSafeEthereumInstance, createTransaction } from '~/wallets/createTransactions'
import RemoveOwnerForm, { DECREASE_PARAM } from './RemoveOwnerForm'
import Review from './Review'
import selector, { type SelectorProps } from './selector'
import actions, { type Actions } from './actions'

const getSteps = () => [
  'Fill Owner Form', 'Review Remove order operation',
]

type Props = SelectorProps & Actions & {
  safe: Safe,
  threshold: number,
  name: string,
  userToRemove: string,
}

type State = {
  done: boolean,
}

const SENTINEL_ADDRESS = '0x0000000000000000000000000000000000000001'
export const REMOVE_OWNER_RESET_BUTTON_TEXT = 'RESET'

export const initialValuesFrom = (decreaseMandatory: boolean = false) => ({
  [DECREASE_PARAM]: decreaseMandatory,
})

export const shouldDecrease = (numOwners: number, threshold: number) => threshold === numOwners

export const removeOwner = async (
  values: Object,
  safe: Safe,
  threshold: number,
  userToRemove: string,
  name: string,
  executor: string,
) => {
  const nonce = Date.now()
  const newThreshold = values[DECREASE_PARAM] ? threshold - 1 : threshold
  const safeAddress = safe.get('address')
  const gnosisSafe = await getSafeEthereumInstance(safeAddress)

  const storedOwners = await gnosisSafe.getOwners()
  const index = storedOwners.findIndex(ownerAddress => ownerAddress === userToRemove)
  const prevAddress = index === 0 ? SENTINEL_ADDRESS : storedOwners[index - 1]
  const data = gnosisSafe.contract.removeOwner.getData(prevAddress, userToRemove, newThreshold)

  const text = name || userToRemove
  return createTransaction(safe, `Remove Owner ${text}`, safeAddress, 0, nonce, executor, data)
}

class RemoveOwner extends React.Component<Props, State> {
  state = {
    done: false,
  }

  onRemoveOwner = async (values: Object) => {
    try {
      const {
        safe, threshold, executor, fetchTransactions, userToRemove, name,
      } = this.props
      await removeOwner(values, safe, threshold, userToRemove, executor, name)
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
    const { safe, name, pendingTransactions } = this.props
    const { done } = this.state
    const steps = getSteps()
    const numOwners = safe.get('owners').count()
    const threshold = safe.get('threshold')
    const finishedButton = <Stepper.FinishButton title={REMOVE_OWNER_RESET_BUTTON_TEXT} />
    const decrease = shouldDecrease(numOwners, threshold)
    const initialValues = initialValuesFrom(decrease)
    const disabled = decrease || threshold === 1

    return (
      <React.Fragment>
        <Stepper
          finishedTransaction={done}
          finishedButton={finishedButton}
          onSubmit={this.onRemoveOwner}
          steps={steps}
          onReset={this.onReset}
          initialValues={initialValues}
        >
          <Stepper.Page
            numOwners={numOwners}
            threshold={threshold}
            name={name}
            disabled={disabled}
            pendingTransactions={pendingTransactions}
          >
            { RemoveOwnerForm }
          </Stepper.Page>
          <Stepper.Page name={name}>
            { Review }
          </Stepper.Page>
        </Stepper>
      </React.Fragment>
    )
  }
}

export default connect(selector, actions)(RemoveOwner)
