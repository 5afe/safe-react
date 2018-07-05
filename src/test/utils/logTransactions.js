// @flow
import { getGnosisSafeInstanceAt } from '~/wallets/safeContracts'
import Stepper from '~/components/Stepper'
import TestUtils from 'react-dom/test-utils'

export const printOutApprove = async (
  subject: string,
  address: string,
  owners: string[],
  data: string,
  nonce: number,
) => {
  // eslint-disable-next-line
  console.log(subject)

  const gnosisSafe = await getGnosisSafeInstanceAt(address)
  const transactionHash = await gnosisSafe.getTransactionHash(address, 0, data, 0, nonce)
  // eslint-disable-next-line
  console.log(`EO transaction hash ${transactionHash}`)

  await Promise.all(owners.map(async (owner, index) => {
    const approved = await gnosisSafe.isApproved(transactionHash, owner)
    // eslint-disable-next-line
    console.log(`EO transaction approved by owner index ${index}: ${approved}`)
  }))
  // eslint-disable-next-line
  console.log(`EO transaction executed ${await gnosisSafe.isExecuted(transactionHash)}`)
}

const MAX_TIMES_EXECUTED = 35
const INTERVAL = 500
type FinsihedTx = {
  finishedTransaction: boolean,
}
export const whenExecuted = (
  SafeDom: React$Component<any, any>,
  ParentComponent: React$ElementType,
): Promise<void> => new Promise((resolve, reject) => {
  let times = 0
  const interval = setInterval(() => {
    if (times >= MAX_TIMES_EXECUTED) {
      clearInterval(interval)
      reject()
    }

    // $FlowFixMe
    const SafeComponent = TestUtils.findRenderedComponentWithType(SafeDom, ParentComponent)
    type StepperType = React$Component<FinsihedTx, any>
    // $FlowFixMe
    const StepperComponent: StepperType = TestUtils.findRenderedComponentWithType(SafeComponent, Stepper)

    if (StepperComponent.props.finishedTransaction === true) {
      clearInterval(interval)
      resolve()
    }
    times += 1
  }, INTERVAL)
})
