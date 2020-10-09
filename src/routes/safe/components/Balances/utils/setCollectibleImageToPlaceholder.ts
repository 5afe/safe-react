import NFTIcon from 'src/routes/safe/components/Balances/assets/nft_icon.png'

export const setCollectibleImageToPlaceholder = (e) => {
  e.target.onerror = null
  e.target.src = NFTIcon
}
