import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { WALLET_PROVIDER } from 'src/logic/wallets/getWeb3'
import ledgerImage from './images/ledger.jpg'

const USER_ENABLED_LEDGER_TX_DATA = 'USER_ENABLED_LEDGER_TX_DATA'
function transactionDataCheck(): any {
  return (stateAndHelpers) => {
    const { wallet } = stateAndHelpers
    const isTransactionDataEnabled = loadFromStorage<boolean>(USER_ENABLED_LEDGER_TX_DATA)
    if (wallet && wallet.name.toUpperCase() === WALLET_PROVIDER.LEDGER && !isTransactionDataEnabled) {
      return {
        heading: 'Enable blind signing',
        description: `<div><p><strong>Important</strong>: In order to sign transactions with your Ledger device, you will have to activate the <a href="https://support.ledger.com/hc/en-us/articles/4405481324433-Enable-blind-signing-in-the-Ethereum-ETH-app?docs=true" style="color: inherit" target="_blank">Blind signing</a> setting in the Ethereum app on your Ledger.</p><a href="https://support.ledger.com/hc/en-us/articles/4405481324433-Enable-blind-signing-in-the-Ethereum-ETH-app?docs=true" target="_blank"><img style="width:100%" src=${ledgerImage} alt="Blind signing"/></a></div>`,
        eventCode: 'allowTransactionData',
        button: {
          text: 'Done',
          onclick: () => saveToStorage(USER_ENABLED_LEDGER_TX_DATA, true),
        },
        icon: `
                  <svg height="14" viewBox="0 0 18 14" width="18" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path d="m10.29375 4.05351563c0-.04921875 0-.09140625 0-.13007813 0-1.0546875 0-2.109375 0-3.1640625 0-.43945312.3480469-.76992188.7804688-.7453125.2003906.01054688.3585937.10546875.4992187.24609375.5800781.58359375 1.1566406 1.16367188 1.7367187 1.74023438 1.4695313 1.46953125 2.9390625 2.93906249 4.4050782 4.40859375.1335937.13359375.2425781.27421875.2707031.46757812.0351562.20742188-.0246094.421875-.1652344.58007813-.0246094.028125-.0492187.05273437-.0738281.08085937-2.0601563 2.06367188-4.1203125 4.1238281-6.1804688 6.1875-.2109375.2109375-.4570312.3023438-.7453125.2179688-.2707031-.0808594-.4464843-.2707032-.5132812-.5484375-.0140625-.0738282-.0175781-.1441407-.0140625-.2179688 0-1.0335937 0-2.0707031 0-3.1042969 0-.0386719 0-.08085935 0-.13359372h-5.06953125c-.49570313 0-.80507813-.309375-.80507813-.80859375 0-1.42382813 0-2.84414063 0-4.26796875 0-.49570313.30585938-.8015625.8015625-.8015625h4.93593748z"/><path d="m5.69882812 13.978125h-4.01132812c-.928125 0-1.6875-.8753906-1.6875-1.9511719v-10.06171872c0-1.07578125.75585938-1.95117188 1.6875-1.95117188h4.01132812c.34101563 0 .61523438.31992188.61523438.71015625 0 .39023438-.27421875.71015625-.61523438.71015625h-4.01132812c-.253125 0-.45703125.23554688-.45703125.52734375v10.06171875c0 .2917969.20390625.5273437.45703125.5273437h4.01132812c.34101563 0 .61523438.3199219.61523438.7101563s-.27773438.7171875-.61523438.7171875z"/></g></svg>
                  `,
      }
    }
    return null
  }
}

export default transactionDataCheck
