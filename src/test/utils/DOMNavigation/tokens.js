// @flow
import { fireEvent } from '@testing-library/react'
import { MANAGE_TOKENS_BUTTON_TEST_ID } from '~/routes/safe/components/Balances'
import { ADD_CUSTOM_TOKEN_BUTTON_TEST_ID, TOGGLE_TOKEN_TEST_ID } from '~/routes/safe/components/Balances/Tokens/screens/TokenList'

export const clickOnManageTokens = (dom: any): void => {
  const btn = dom.getByTestId(MANAGE_TOKENS_BUTTON_TEST_ID)

  fireEvent.click(btn)
}

export const clickOnAddCustomToken = (dom: any): void => {
  const btn = dom.getByTestId(ADD_CUSTOM_TOKEN_BUTTON_TEST_ID)

  fireEvent.click(btn)
}

export const toggleToken = (dom: any, symbol: string): void => {
  const btn = dom.getByTestId(`${symbol}_${TOGGLE_TOKEN_TEST_ID}`)
}
