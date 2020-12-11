// https://docs.metamask.io/guide/ethereum-provider.html#ethereum-autorefreshonnetworkchange
export const disableMMAutoRefreshWarning = (): void => {
  if (window.ethereum && window.ethereum.isMetaMask) {
    window.ethereum.autoRefreshOnNetworkChange = false
  }
}
