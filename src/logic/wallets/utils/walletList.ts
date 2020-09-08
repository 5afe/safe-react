const wallets = [{ walletName: 'metamask', preferred: true, desktop: false }]

export const getSupportedWallets = () => {
  const { isDesktop } = window as any
  /* eslint-disable no-unused-vars */

  if (isDesktop) return wallets.filter((wallet) => wallet.desktop).map(({ desktop, ...rest }) => rest)

  return wallets.map(({ desktop, ...rest }) => rest)
}
