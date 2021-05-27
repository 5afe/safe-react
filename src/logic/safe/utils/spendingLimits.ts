import { BigNumber } from 'bignumber.js'
import { AbiItem } from 'web3-utils'

import { CreateTransactionArgs } from 'src/logic/safe/store/actions/createTransaction'
import { CALL, DELEGATE_CALL, TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { enableModuleTx } from 'src/logic/safe/utils/modules'
import SpendingLimitModule from 'src/logic/contracts/artifacts/AllowanceModule.json'
import generateBatchRequests from 'src/logic/contracts/generateBatchRequests'
import { getSpendingLimitContract, MULTI_SEND_ADDRESS } from 'src/logic/contracts/safeContracts'
import { SpendingLimit } from 'src/logic/safe/store/models/safe'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { getWeb3, web3ReadOnly } from 'src/logic/wallets/getWeb3'
import { SPENDING_LIMIT_MODULE_ADDRESS } from 'src/utils/constants'
import { getEncodedMultiSendCallData, MultiSendTx } from './upgradeSafe'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { getBalanceAndDecimalsFromToken, GetTokenByAddress } from 'src/logic/tokens/utils/tokenHelpers'
import { sameString } from 'src/utils/strings'

export const currentMinutes = (): number => Math.floor(Date.now() / (1000 * 60))

const requestTokensByDelegate = async (
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

const ZERO_VALUE = '0'

/**
 * Deleted Allowance have their `amount` and `resetTime` set to `0` (zero)
 * @param {SpendingLimitRow} allowance
 * @returns boolean
 */
const discardZeroAllowance = ({ amount, resetTimeMin }: SpendingLimitRow): boolean =>
  !(sameString(amount, ZERO_VALUE) && sameString(resetTimeMin, ZERO_VALUE))

type TokenSpendingLimit = [string, string, string, string, string]

type TokenSpendingLimitContext = {
  delegate: string
  token: string
}

type TokenSpendingLimitRequest = [TokenSpendingLimitContext, TokenSpendingLimit | undefined]

const requestAllowancesByDelegatesAndTokens = async (
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

export const getSpendingLimits = async (
  modules: string[] | undefined,
  safeAddress: string,
): Promise<SpendingLimit[] | null> => {
  const isSpendingLimitEnabled = modules?.some((module) => sameAddress(module, SPENDING_LIMIT_MODULE_ADDRESS)) ?? false

  try {
    if (isSpendingLimitEnabled) {
      const delegates = await getSpendingLimitContract().methods.getDelegates(safeAddress, 0, 100).call()
      const tokensByDelegate = await requestTokensByDelegate(safeAddress, delegates.results)
      return requestAllowancesByDelegatesAndTokens(safeAddress, tokensByDelegate)
    }
  } catch (error) {
    console.error('Failed to retrieve SpendingLimits module information', error.message)
  }

  return null
}

type DeleteAllowanceParams = {
  beneficiary: string
  tokenAddress: string
}

export const getDeleteAllowanceTxData = ({ beneficiary, tokenAddress }: DeleteAllowanceParams): string => {
  const web3 = getWeb3()
  const spendingLimitContract = new web3.eth.Contract(
    SpendingLimitModule.abi as AbiItem[],
    SPENDING_LIMIT_MODULE_ADDRESS,
  )

  return spendingLimitContract.methods.deleteAllowance(beneficiary, tokenAddress).encodeABI()
}

export const enableSpendingLimitModuleMultiSendTx = (safeAddress: string): MultiSendTx => {
  const multiSendTx = enableModuleTx({ moduleAddress: SPENDING_LIMIT_MODULE_ADDRESS, safeAddress })

  return {
    to: multiSendTx.to,
    value: Number(multiSendTx.valueInWei),
    data: multiSendTx.txData as string,
  }
}

export const addSpendingLimitBeneficiaryMultiSendTx = (beneficiary: string): MultiSendTx => {
  const spendingLimitContract = getSpendingLimitContract()

  return {
    to: SPENDING_LIMIT_MODULE_ADDRESS,
    value: 0,
    data: spendingLimitContract.methods.addDelegate(beneficiary).encodeABI(),
  }
}

export const getResetSpendingLimitTx = (beneficiary: string, token: string): MultiSendTx => {
  const spendingLimitContract = getSpendingLimitContract()

  return {
    to: SPENDING_LIMIT_MODULE_ADDRESS,
    value: 0,
    data: spendingLimitContract.methods.resetAllowance(beneficiary, token).encodeABI(),
  }
}

type SpendingLimitTxParams = {
  spendingLimitArgs: {
    beneficiary: string
    token: string
    spendingLimitInWei: string
    resetTimeMin: number
    resetBaseMin: number
  }
  safeAddress: string
}

export const setSpendingLimitTx = ({
  spendingLimitArgs: { beneficiary, token, spendingLimitInWei, resetTimeMin, resetBaseMin },
  safeAddress,
}: SpendingLimitTxParams): CreateTransactionArgs => {
  const spendingLimitContract = getSpendingLimitContract()

  const txArgs: CreateTransactionArgs = {
    safeAddress,
    to: SPENDING_LIMIT_MODULE_ADDRESS,
    valueInWei: ZERO_VALUE,
    txData: spendingLimitContract.methods
      .setAllowance(beneficiary, token, spendingLimitInWei, resetTimeMin, resetBaseMin)
      .encodeABI(),
    operation: CALL,
    notifiedTransaction: TX_NOTIFICATION_TYPES.NEW_SPENDING_LIMIT_TX,
  }

  return txArgs
}

export const setSpendingLimitMultiSendTx = (args: SpendingLimitTxParams): MultiSendTx => {
  const tx = setSpendingLimitTx(args)

  return {
    to: tx.to,
    value: Number(tx.valueInWei),
    data: tx.txData as string,
  }
}

type SpendingLimitMultiSendTx = {
  transactions: Array<MultiSendTx>
  safeAddress: string
}
export const spendingLimitMultiSendTx = ({
  transactions,
  safeAddress,
}: SpendingLimitMultiSendTx): CreateTransactionArgs => ({
  safeAddress,
  to: MULTI_SEND_ADDRESS,
  valueInWei: ZERO_VALUE,
  txData: getEncodedMultiSendCallData(transactions, getWeb3()),
  notifiedTransaction: TX_NOTIFICATION_TYPES.NEW_SPENDING_LIMIT_TX,
  operation: DELEGATE_CALL,
})

type SpendingLimitAllowedBalance = GetTokenByAddress & {
  tokenSpendingLimit: SpendingLimit
}

/**
 * Calculates the remaining amount available for a particular SpendingLimit
 * @param {string} tokenAddress
 * @param {SpendingLimit} tokenSpendingLimit
 * @param {List<Token>} tokens
 * returns string
 */
export const spendingLimitAllowedBalance = ({
  tokenAddress,
  tokenSpendingLimit,
  tokens,
}: SpendingLimitAllowedBalance): string | number => {
  const token = getBalanceAndDecimalsFromToken({ tokenAddress, tokens })

  if (!token) {
    return 0
  }

  const { balance, decimals } = token
  const diff = new BigNumber(tokenSpendingLimit.amount).minus(tokenSpendingLimit.spent).toString()
  const diffInFPNotation = fromTokenUnit(diff, decimals)

  return new BigNumber(balance).gt(diffInFPNotation) ? diffInFPNotation : balance
}

type GetSpendingLimitByTokenAddress = {
  spendingLimits?: SpendingLimit[] | null
  tokenAddress?: string
}

/**
 * Returns the SpendingLimit info for the specified tokenAddress
 * @param {SpendingLimit[] | undefined | null} spendingLimits
 * @param {string | undefined} tokenAddress
 * @returns SpendingLimit | undefined
 */
export const getSpendingLimitByTokenAddress = ({
  spendingLimits,
  tokenAddress,
}: GetSpendingLimitByTokenAddress): SpendingLimit | undefined => {
  if (!tokenAddress || !spendingLimits) {
    return
  }

  return spendingLimits.find(({ token }) => sameAddress(token, tokenAddress))
}
