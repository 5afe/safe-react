import React from 'react'
import Stepper from '@material-ui/core/Stepper'
import TestUtils from 'react-dom/test-utils'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import GnoStepper from 'src/components/Stepper'

export const printOutApprove = async (
  subject,
  address,
  owners,
  data,
  nonce,
) => {
  // eslint-disable-next-line
  console.log(subject)

  const gnosisSafe = await getGnosisSafeInstanceAt(address)
  const transactionHash = await gnosisSafe.getTransactionHash(address, 0, data, 0, 0, 0, 0, 0, 0, nonce)
  // eslint-disable-next-line
  console.log(`EO transaction hash ${transactionHash}`)

  await Promise.all(
    owners.map(async (owner, index) => {
      const approved = await gnosisSafe.isApproved(transactionHash, owner)
      // eslint-disable-next-line
      console.log(`EO transaction approved by owner index ${index}: ${approved}`)
    }),
  )
  // eslint-disable-next-line
  console.log(`EO transaction executed ${await gnosisSafe.isExecuted(transactionHash)}`)
}

const MAX_TIMES_EXECUTED = 35
const INTERVAL = 500


export const whenExecuted = (SafeDom, ParentComponent) => new Promise((resolve, reject) => {
  let times = 0
  const interval = setInterval(() => {
    if (times >= MAX_TIMES_EXECUTED) {
      clearInterval(interval)
      reject()
    }

    // $FlowFixMe
    const SafeComponent = TestUtils.findRenderedComponentWithType(SafeDom, ParentComponent)
      // $FlowFixMe
      const StepperComponent = TestUtils.findRenderedComponentWithType(SafeComponent, GnoStepper as any)

      if (StepperComponent.props.finishedTransaction === true) {
        clearInterval(interval)
        resolve()
      }
      times += 1
  }, INTERVAL)
})


export const whenOnNext = (
  SafeDom,
  ParentComponent,
  position,
) => new Promise((resolve, reject) => {
  let times = 0
  const interval = setInterval(() => {
    if (times >= MAX_TIMES_EXECUTED) {
      clearInterval(interval)
      reject()
    }

    // $FlowFixMe
    const SafeComponent = TestUtils.findRenderedComponentWithType(SafeDom, ParentComponent)
      // $FlowFixMe
      const StepperComponent = TestUtils.findRenderedComponentWithType(SafeComponent, Stepper as any)
      if (StepperComponent.props.activeStep === position) {
        clearInterval(interval)
        resolve()
      }
      times += 1
  }, INTERVAL)
})
