// @flow
import * as React from 'react'
import { fireEvent, waitForElement } from '@testing-library/react'
import { sleep } from '~/utils/timer'

export const fillAndSubmitSendFundsForm = async (
  SafeDom: any,
  sendButton: React.Component<any, any>,
  value: string,
  recipient: string,
) => {
  // load add multisig form component
  fireEvent.click(sendButton)
  // give time to re-render it
  await sleep(400)

  // Fill first send funds screen
  const recipientInput = SafeDom.getByPlaceholderText('Recipient*')
  const amountInput = SafeDom.getByPlaceholderText('Amount*')
  const reviewBtn = SafeDom.getByTestId('review-tx-btn')
  fireEvent.change(recipientInput, { target: { value: recipient } })
  fireEvent.change(amountInput, { target: { value } })
  await sleep(200)
  fireEvent.click(reviewBtn)

  // Submit the tx (Review Tx screen)
  const submitBtn = await waitForElement(() => SafeDom.getByTestId('submit-tx-btn'))
  fireEvent.click(submitBtn)
  await sleep(1000)
}
