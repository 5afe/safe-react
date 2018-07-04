// @flow
import TestUtils from 'react-dom/test-utils'
import { sleep } from '~/utils/timer'
import { checkMinedTx } from '~/test/builder/safe.dom.utils'
import { getGnosisSafeInstanceAt } from '~/wallets/safeContracts'

export const sendChangeThresholdForm = async (
  SafeDom: React$Component<any, any>,
  changeThreshold: React$Component<any, any>,
  threshold: string,
) => {
  // Load the Threshold Form
  TestUtils.Simulate.click(changeThreshold)
  await sleep(400)

  // fill the form
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(SafeDom, 'input')
  const thresholdInput = inputs[0]
  TestUtils.Simulate.change(thresholdInput, { target: { value: threshold } })

  // $FlowFixMe
  const form = TestUtils.findRenderedDOMComponentWithTag(SafeDom, 'form')
  // submit it
  TestUtils.Simulate.submit(form)
  TestUtils.Simulate.submit(form)
}

export const checkMinedThresholdTx = (Transaction: React$Component<any, any>, name: string) => {
  checkMinedTx(Transaction, name)
}

export const checkThresholdOf = async (address: string, threshold: number) => {
  const gnosisSafe = await getGnosisSafeInstanceAt(address)
  const safeThreshold = await gnosisSafe.getThreshold()
  expect(Number(safeThreshold)).toEqual(threshold)
}
