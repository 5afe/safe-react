// @flow
import * as React from 'react'
import { fireEvent, waitForElement, act } from '@testing-library/react'
import { sleep } from '~/utils/timer'

export const fillAndSubmitSendFundsForm = async (
  SafeDom: any,
  sendButton: React.Component<any, any>,
  value: string,
  recipient: string,
) => {
  await act(async () => {
    fireEvent.click(sendButton)
  })
  // give time to re-render it
  await sleep(400)

  // Fill first send funds screen
  const recipientInput = SafeDom.getByPlaceholderText('Recipient*')
  const amountInput = SafeDom.getByPlaceholderText('Amount*')
  const reviewBtn = SafeDom.getByTestId('review-tx-btn')
  await act(async () => {
    fireEvent.change(recipientInput, { target: { value: recipient } })
    fireEvent.change(amountInput, { target: { value } })
    fireEvent.click(reviewBtn)
  })

  // Submit the tx (Review Tx screen)
  const submitBtn = await waitForElement(() => SafeDom.getByTestId('submit-tx-btn'))
  await act(async () => {
    fireEvent.click(submitBtn)
  })
  await sleep(1000)
}
