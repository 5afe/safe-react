//
import { fireEvent, act } from '@testing-library/react'
import { MANAGE_TOKENS_BUTTON_TEST_ID } from 'src/routes/safe/components/Balances'


export const clickOnManageTokens = (dom) => {
  const btn = dom.getByTestId(MANAGE_TOKENS_BUTTON_TEST_ID)

  act(() => {
    fireEvent.click(btn)
  })
}

