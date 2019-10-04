// @flow
import { fireEvent, waitForElement, act } from '@testing-library/react'
import { MANAGE_TOKENS_BUTTON_TEST_ID } from '~/routes/safe/components/Balances'
import { ADD_CUSTOM_TOKEN_BUTTON_TEST_ID } from '~/routes/safe/components/Balances/Tokens/screens/TokenList'
import { TOGGLE_TOKEN_TEST_ID } from '~/routes/safe/components/Balances/Tokens/screens/TokenList/TokenRow'
import { MANAGE_TOKENS_MODAL_CLOSE_BUTTON_TEST_ID } from '~/routes/safe/components/Balances/Tokens'

export const clickOnManageTokens = (dom: any): void => {
  const btn = dom.getByTestId(MANAGE_TOKENS_BUTTON_TEST_ID)

  act(() => {
    fireEvent.click(btn)
  })
}

export const clickOnAddCustomToken = (dom: any): void => {
  const btn = dom.getByTestId(ADD_CUSTOM_TOKEN_BUTTON_TEST_ID)

  act(() => {
    fireEvent.click(btn)
  })
}

export const toggleToken = async (dom: any, symbol: string): Promise<void> => {
  const btn = await waitForElement(() => dom.getByTestId(`${symbol}_${TOGGLE_TOKEN_TEST_ID}`))

  act(() => {
    fireEvent.click(btn)
  })
}

export const closeManageTokensModal = (dom: any) => {
  const btn = dom.getByTestId(MANAGE_TOKENS_MODAL_CLOSE_BUTTON_TEST_ID)

  act(() => {
    fireEvent.click(btn)
  })
}
