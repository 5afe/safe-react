import GnosisSafeSol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import { BigNumber } from 'bignumber.js'

import SpendingLimitModule from 'src/logic/contracts/artifacts/AllowanceModule.json'
import generateBatchRequests from 'src/logic/contracts/generateBatchRequests'
import { SENTINEL_ADDRESS } from 'src/logic/contracts/safeContracts'
import { web3ReadOnly } from 'src/logic/wallets/getWeb3'
import { SPENDING_LIMIT_MODULE_ADDRESS } from 'src/utils/constants'
import { AbiItem } from 'web3-utils'

export const KEYCODES = {
  TAB: 9,
  SHIFT: 16,
}

export const adjustAmountToToken = (amount: string, decimals: string | number): string => {
  const amountBN = new BigNumber(amount)
  const [, amountDecimalPlaces] = amount.split('.')

  if (amountDecimalPlaces?.length >= 18) {
    return amountBN.toFixed(+decimals, BigNumber.ROUND_DOWN)
  }

  return amountBN.toFixed()
}

export const currentMinutes = (): number => Math.floor(Date.now() / (1000 * 60))

export const requestModuleData = (safeAddress: string): Promise<[string[] | undefined, string[] | undefined]> => {
  const batch = new web3ReadOnly.BatchRequest()

  const modules = generateBatchRequests<[undefined, string[] | undefined]>({
    abi: GnosisSafeSol.abi as AbiItem[],
    address: safeAddress,
    methods: [{ method: 'getModulesPaginated', args: [SENTINEL_ADDRESS, 100] }],
    batch,
  })

  const delegates = generateBatchRequests<[undefined, string[] | undefined]>({
    abi: SpendingLimitModule.abi as AbiItem[],
    address: SPENDING_LIMIT_MODULE_ADDRESS,
    methods: [{ method: 'getDelegates', args: [safeAddress, 0, 100] }],
    batch,
  })

  const whenRequestsValues = [modules, delegates]

  batch.execute()

  return Promise.all(whenRequestsValues).then(([[, modules], [, delegates]]) => [modules, delegates])
}

export const requestTokensByDelegate = async (
  safeAddress: string,
  delegates: string[],
): Promise<[string, string[] | undefined][]> => {
  const batch = new web3ReadOnly.BatchRequest()

  const whenRequestValues = delegates.map((delegateAddress: string) =>
    generateBatchRequests<[string, string[] | undefined]>({
      abi: SpendingLimitModule.abi as AbiItem[],
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

type TokenSpendingLimit = [string, string, string, string, string]

type TokenSpendingLimitContext = {
  delegate: string
  token: string
}

type TokenSpendingLimitRequest = [TokenSpendingLimitContext, TokenSpendingLimit | undefined]

export const requestAllowancesByDelegatesAndTokens = async (
  safeAddress: string,
  tokensByDelegate: [string, string[] | undefined][],
): Promise<SpendingLimitRow[]> => {
  const batch = new web3ReadOnly.BatchRequest()

  const whenRequestValues: Promise<TokenSpendingLimitRequest>[] = []

  for (const [delegate, tokens] of tokensByDelegate) {
    if (tokens) {
      for (const token of tokens) {
        whenRequestValues.push(
          generateBatchRequests<[TokenSpendingLimitContext, TokenSpendingLimit]>({
            abi: SpendingLimitModule.abi as AbiItem[],
            address: SPENDING_LIMIT_MODULE_ADDRESS,
            methods: [{ method: 'getTokenAllowance', args: [safeAddress, delegate, token] }],
            batch,
            context: { delegate, token },
          }),
        )
      }
    }
  }

  batch.execute()

  return Promise.all(whenRequestValues).then((allowances) =>
    allowances
      // first, we filter out those records whose tokenSpendingLimit is undefined
      .filter(([, tokenSpendingLimit]) => tokenSpendingLimit)
      // then, we build the SpendingLimitRow object
      .map(([{ delegate, token }, tokenSpendingLimit]) => {
        const [amount, spent, resetTimeMin, lastResetMin, nonce] = tokenSpendingLimit as TokenSpendingLimit

        return {
          delegate,
          token,
          amount,
          spent,
          resetTimeMin,
          lastResetMin,
          nonce,
        }
      })
      .filter(discardZeroAllowance),
  )
}
