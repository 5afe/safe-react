// @flow
import TokenPlaceholder from '~/routes/safe/component/Balances/assets/token_placeholder.svg'

export const setImageToPlaceholder = (e) => {
  e.target.onerror = null
  e.target.src = TokenPlaceholder
}
