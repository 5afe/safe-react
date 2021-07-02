import { Transaction, TransactionReceipt } from 'web3-core'

import { web3ReadOnly } from 'src/logic/wallets/getWeb3'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { sameString } from 'src/utils/strings'
import { CodedException, Errors, logError } from 'src/logic/exceptions/CodedException'

type TxMonitorProps = {
  sender: string
  hash: string
  data: string
  nonce?: number
  gasPrice?: string
}

type TxMonitorOptions = {
  delay?: number
}

const MAX_RETRIES = 720
const DEFAULT_DELAY = 5000

async function findSpeedupTx({ sender, hash, nonce, data }: TxMonitorProps): Promise<Transaction | undefined> {
  const latestBlock = await web3ReadOnly.eth.getBlock('latest', true)

  const replacementTransaction = latestBlock.transactions.find((transaction) => {
    // TODO: use gasPrice, timestamp or another better way to differentiate
    return (
      sameAddress(transaction.from, sender) &&
      transaction.nonce === nonce &&
      !sameString(transaction.hash, hash) &&
      // if `data` differs, then it's a replacement tx, not a speedup
      sameString(transaction.input, data)
    )
  })

  return replacementTransaction
}

/**
 * Recursively inspects a pending tx. Until it's found, and returns the mined tx receipt
 *
 * @param {object} txParams
 * @param {string} txParams.sender
 * @param {string} txParams.hash
 * @param {string} txParams.data
 * @param {number | undefined} txParams.nonce
 * @param {string | undefined} txParams.gasPrice
 * @param {object} options
 * @param {number} options.delay
 * @returns {Promise<TransactionReceipt>}
 */
export const txMonitor = (
  { sender, hash, data, nonce, gasPrice }: TxMonitorProps,
  options?: TxMonitorOptions,
  tries = 0,
): Promise<TransactionReceipt> => {
  return new Promise<TransactionReceipt>((resolve, reject) => {
    if (tries > MAX_RETRIES) {
      reject(new CodedException(Errors._805, 'max retries reached'))
      return
    }

    const monitorFn = async (): Promise<unknown> => {
      // Case 1: this block is accessed for the first time, no nonce
      if (nonce === undefined || gasPrice === undefined) {
        let params: TxMonitorProps = { sender, hash, data }
        try {
          // Find the nonce for the current tx
          const transaction = await web3ReadOnly.eth.getTransaction(hash)
          if (transaction) {
            params = { ...params, nonce: transaction.nonce, gasPrice: transaction.gasPrice }
          }
        } catch (e) {
          logError(Errors._805, e.message)
        }

        return txMonitor(params, options, tries + 1)
          .then(resolve)
          .catch(reject)
      }

      // Case 2: the nonce exists, try to get the receipt for the original tx
      try {
        const firstTxReceipt = await web3ReadOnly.eth.getTransactionReceipt(hash)
        if (firstTxReceipt) {
          return resolve(firstTxReceipt)
        }
      } catch (e) {
        logError(Errors._805, e.message)
        // proceed to case 3
      }

      // Case 3: original tx not found, try to find a sped-up tx
      try {
        const replacementTx = await findSpeedupTx({ sender, hash, nonce, data })

        if (replacementTx) {
          const replacementReceipt = await web3ReadOnly.eth.getTransactionReceipt(replacementTx.hash)

          // goal achieved
          if (replacementReceipt) {
            return resolve(replacementReceipt)
          }

          // tx exists but no receipt yet, it's pending
          return txMonitor(
            {
              sender,
              nonce,
              hash: replacementTx.hash,
              data: replacementTx.input,
              gasPrice: replacementTx.gasPrice,
            },
            options,
            tries + 1,
          )
            .then(resolve)
            .catch(reject)
        }
      } catch (e) {
        logError(Errors._805, e.message)
      }

      // Neither the original nor a replacement transactions were found, try again
      txMonitor({ sender, hash, data, nonce, gasPrice }, options, tries + 1)
        .then(resolve)
        .catch(reject)
    }

    setTimeout(monitorFn, options?.delay ?? DEFAULT_DELAY)
  })
}
