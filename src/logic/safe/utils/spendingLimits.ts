import { BigNumber } from 'bignumber.js'
import { getNetworkInfo } from 'src/config'
import { AbiItem } from 'web3-utils'

import { CreateTransactionArgs } from 'src/logic/safe/store/actions/createTransaction'
import { CALL, DELEGATE_CALL, TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { enableModuleTx } from 'src/logic/safe/utils/modules'
import SpendingLimitModule from 'src/logic/contracts/artifacts/AllowanceModule.json'
import generateBatchRequests from 'src/logic/contracts/generateBatchRequests'
import { getSpendingLimitContract, MULTI_SEND_ADDRESS } from 'src/logic/contracts/safeContracts'
import { SpendingLimit } from 'src/logic/safe/store/models/safe'
import { sameAddress, ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { getWeb3, web3ReadOnly } from 'src/logic/wallets/getWeb3'
import { SPENDING_LIMIT_MODULE_ADDRESS } from 'src/utils/constants'
import { getEncodedMultiSendCallData, MultiSendTx } from './upgradeSafe'

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

/**
 * Deleted Allowance have their `amount` and `resetTime` set to `0` (zero)
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

  if (isSpendingLimitEnabled) {
    const delegates = await getSpendingLimitContract().methods.getDelegates(safeAddress, 0, 100).call()
    const tokensByDelegate = await requestTokensByDelegate(safeAddress, delegates.results)
    return requestAllowancesByDelegatesAndTokens(safeAddress, tokensByDelegate)
  }

  return null
}

type DeleteAllowanceParams = {
  beneficiary: string
  tokenAddress: string
}

export const getDeleteAllowanceTxData = ({ beneficiary, tokenAddress }: DeleteAllowanceParams): string => {
  const { nativeCoin } = getNetworkInfo()
  const token = sameAddress(tokenAddress, nativeCoin.address) ? ZERO_ADDRESS : tokenAddress

  const web3 = getWeb3()
  const spendingLimitContract = new web3.eth.Contract(
    SpendingLimitModule.abi as AbiItem[],
    SPENDING_LIMIT_MODULE_ADDRESS,
  )

  return spendingLimitContract.methods.deleteAllowance(beneficiary, token).encodeABI()
}

export const enableSpendingLimitModuleMultiSendTx = (safeAddress: string): MultiSendTx => {
  const multiSendTx = enableModuleTx({ moduleAddress: SPENDING_LIMIT_MODULE_ADDRESS, safeAddress })

  return {
    to: multiSendTx.to,
    value: Number(multiSendTx.valueInWei),
    data: multiSendTx.txData as string,
    operation: DELEGATE_CALL,
  }
}

export const addSpendingLimitBeneficiaryMultiSendTx = (beneficiary: string): MultiSendTx => {
  const spendingLimitContract = getSpendingLimitContract()

  return {
    to: SPENDING_LIMIT_MODULE_ADDRESS,
    value: 0,
    data: spendingLimitContract.methods.addDelegate(beneficiary).encodeABI(),
    operation: DELEGATE_CALL,
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
  safeAddress
}

export const setSpendingLimitTx = ({
  spendingLimitArgs: { beneficiary, token, spendingLimitInWei, resetTimeMin, resetBaseMin },
  safeAddress,
}: SpendingLimitTxParams): CreateTransactionArgs => {
  const spendingLimitContract = getSpendingLimitContract()
  const { nativeCoin } = getNetworkInfo()

  return {
    safeAddress,
    to: SPENDING_LIMIT_MODULE_ADDRESS,
    valueInWei: '0',
    txData: spendingLimitContract.methods
      .setAllowance(
        beneficiary,
        token === nativeCoin.address ? ZERO_ADDRESS : token,
        spendingLimitInWei,
        resetTimeMin,
        resetBaseMin,
      )
      .encodeABI(),
    operation: CALL,
    notifiedTransaction: TX_NOTIFICATION_TYPES.NEW_SPENDING_LIMIT_TX,
  }
}

export const setSpendingLimitMultiSendTx = (args: SpendingLimitTxParams): MultiSendTx => {
  const tx = setSpendingLimitTx(args)

  return {
    to: tx.to,
    value: Number(tx.valueInWei),
    data: tx.txData as string,
    operation: DELEGATE_CALL,
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
  valueInWei: '0',
  txData: getEncodedMultiSendCallData(transactions, getWeb3()),
  notifiedTransaction: TX_NOTIFICATION_TYPES.NEW_SPENDING_LIMIT_TX,
  operation: DELEGATE_CALL,
})
