import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'

export const useGetTxTo = (tx: Transaction): string | undefined => {
  switch (tx.txInfo.type) {
    case 'Transfer': {
      return tx.txInfo.recipient
    }
    case 'SettingsChange': {
      return undefined
    }
    case 'Custom': {
      return tx.txInfo.to
    }
    case 'Creation': {
      return tx.txInfo.factory || undefined
    }
  }
}
