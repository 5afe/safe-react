import TokenPlaceholder from 'src/routes/safe/components/Balances/assets/rsk_token_placeholder.svg'

export const setImageToPlaceholder = (e) => {
  e.target.onerror = null
  e.target.src = TokenPlaceholder
}
