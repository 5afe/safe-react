import GnosisSafeSol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import { BigNumber } from 'bignumber.js'

import generateBatchRequests from 'src/logic/contracts/generateBatchRequests'
import { SENTINEL_ADDRESS } from 'src/logic/contracts/safeContracts'
import { web3ReadOnly } from 'src/logic/wallets/getWeb3'
import SpendingLimitModule from 'src/utils/AllowanceModule.json'
import { SPENDING_LIMIT_MODULE_ADDRESS } from 'src/utils/constants'

export const KEYCODES = {
  TAB: 9,
  SHIFT: 16,
}

export const fromTokenUnit = (amount: string, decimals: string | number): string =>
  new BigNumber(amount).times(`1e-${decimals}`).toFixed()

export const toTokenUnit = (amount: string, decimals: string | number): string =>
  new BigNumber(amount).times(`1e${decimals}`).toFixed()

export const currentMinutes = () => Math.floor(Date.now() / (1000 * 60))

export const requestModuleData = (safeAddress: string): Promise<any[]> => {
  const batch = new web3ReadOnly.BatchRequest()

  const requests = [
    {
      abi: GnosisSafeSol.abi,
      address: safeAddress,
      methods: [{ method: 'getModulesPaginated', args: [SENTINEL_ADDRESS, 100] }],
      batch,
    },
    {
      abi: SpendingLimitModule.abi,
      address: SPENDING_LIMIT_MODULE_ADDRESS,
      methods: [{ method: 'getDelegates', args: [safeAddress, 0, 100] }],
      batch,
    },
  ]

  const whenRequestsValues = requests.map(generateBatchRequests)

  batch.execute()

  return Promise.all(whenRequestsValues).then(([modules, delegates]) => [modules[0], delegates[0]])
}

export const requestTokensByDelegate = async (safeAddress: string, delegates: string[]): Promise<any[]> => {
  const batch = new web3ReadOnly.BatchRequest()

  const whenRequestValues = delegates.map((delegateAddress: string) =>
    generateBatchRequests({
      abi: SpendingLimitModule.abi,
      address: SPENDING_LIMIT_MODULE_ADDRESS,
      methods: [{ method: 'getTokens', args: [safeAddress, delegateAddress] }],
      batch,
      context: delegateAddress,
    }),
  )

  batch.execute()

  return Promise.all(whenRequestValues)
}

export type SpendingLimitRow = {
  delegate: string
  token: string
  amount: string
  spent: string
  resetTimeMin: string
  lastResetMin: string
  nonce: string
}

/**
 * TODO: This is hopefully a temp function that attempts to filter out "deleted" allowances
 * As there's no way to remove an Allowance with the current code, it's "deleted" by setting its `amount` to 0
 * along with `resetTimeMin` to 0 as well
 * @param {SpendingLimitRow} allowance
 * @returns boolean
 */
const discardZeroAllowance = ({ amount, resetTimeMin }: SpendingLimitRow): boolean =>
  !(amount === '0' && resetTimeMin === '0')

export const requestAllowancesByDelegatesAndTokens = async (
  safeAddress: string,
  tokensByDelegate: [string, string[]][],
): Promise<SpendingLimitRow[]> => {
  const batch = new web3ReadOnly.BatchRequest()

  const whenRequestValues = []

  for (const [delegate, tokens] of tokensByDelegate) {
    for (const token of tokens) {
      whenRequestValues.push(
        generateBatchRequests({
          abi: SpendingLimitModule.abi,
          address: SPENDING_LIMIT_MODULE_ADDRESS,
          methods: [{ method: 'getTokenAllowance', args: [safeAddress, delegate, token] }],
          batch,
          context: { delegate, token },
        }),
      )
    }
  }

  batch.execute()

  return Promise.all(whenRequestValues).then((allowances) =>
    allowances
      .map(([{ delegate, token }, [amount, spent, resetTimeMin, lastResetMin, nonce]]) => ({
        delegate,
        token,
        amount,
        spent,
        resetTimeMin,
        lastResetMin,
        nonce,
      }))
      .filter(discardZeroAllowance),
  )
}
