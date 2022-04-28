import { ChainId } from 'src/config/chain.d'
import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { BigNumber } from 'bignumber.js'

import { CreateTransactionArgs } from 'src/logic/safe/store/actions/createTransaction'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { enableModuleTx, isModuleEnabled } from 'src/logic/safe/utils/modules'
import generateBatchRequests from 'src/logic/contracts/generateBatchRequests'
import { getMultisendContractAddress } from 'src/logic/contracts/safeContracts'
import { SpendingLimit } from 'src/logic/safe/store/models/safe'
import { sameAddress, ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { getWeb3ReadOnly } from 'src/logic/wallets/getWeb3'
import {
  getSpendingLimitModuleAddress,
  getSpendingLimitContract,
  getSpendingLimitModuleAbi,
} from 'src/logic/contracts/spendingLimitContracts'
import { encodeMultiSendCall, MultiSendTx } from 'src/logic/safe/transactions/multisend'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { getBalanceAndDecimalsFromToken, GetTokenByAddress } from 'src/logic/tokens/utils/tokenHelpers'
import { sameString } from 'src/utils/strings'
import { Errors, CodedException } from 'src/logic/exceptions/CodedException'

export const currentMinutes = (): number => Math.floor(Date.now() / (1000 * 60))

const requestTokensByDelegate = async (
  safeAddress: string,
  delegates: string[],
  moduleAddress: string,
): Promise<[string, string[] | undefined][]> => {
  const web3 = getWeb3ReadOnly()
  const batch = new web3.BatchRequest()
  const spendingLimitModuleAbi = getSpendingLimitModuleAbi()

  const whenRequestValues = delegates.map((delegateAddress: string) =>
    generateBatchRequests<[string, string[] | undefined]>({
      abi: spendingLimitModuleAbi,
      address: moduleAddress,
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
  moduleAddress: string,
): Promise<SpendingLimitRow[]> => {
  const web3 = getWeb3ReadOnly()
  const batch = new web3.BatchRequest()
  const spendingLimitModuleAbi = getSpendingLimitModuleAbi()

  const whenRequestValues: Promise<TokenSpendingLimitRequest>[] = []

  for (const [delegate, tokens] of tokensByDelegate) {
    if (tokens) {
      for (const token of tokens) {
        whenRequestValues.push(
          generateBatchRequests<[TokenSpendingLimitContext, TokenSpendingLimit]>({
            abi: spendingLimitModuleAbi,
            address: moduleAddress,
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
  modules: string[],
  safeAddress: string,
  chainId: ChainId,
): Promise<SpendingLimit[] | null> => {
  const spendingLimitModuleAddress = getSpendingLimitModuleAddress(chainId)
  const isSpendingLimitEnabled = isModuleEnabled(modules, spendingLimitModuleAddress)

  if (!isSpendingLimitEnabled) return null

  try {
    const delegates = await getSpendingLimitContract(spendingLimitModuleAddress)
      .methods.getDelegates(safeAddress, 0, 100)
      .call()
    const tokensByDelegate = await requestTokensByDelegate(safeAddress, delegates.results, spendingLimitModuleAddress)
    const limits = await requestAllowancesByDelegatesAndTokens(
      safeAddress,
      tokensByDelegate,
      spendingLimitModuleAddress,
    )
    return limits
  } catch (error) {
    throw new CodedException(Errors._609, error.message)
  }
}

type DeleteAllowanceParams = {
  beneficiary: string
  tokenAddress: string
}

export const getDeleteAllowanceTxData = ({ beneficiary, tokenAddress }: DeleteAllowanceParams): string => {
  // we only encode the data so the address doesn't matter
  const spendingLimitContract = getSpendingLimitContract(ZERO_ADDRESS)

  return spendingLimitContract.methods.deleteAllowance(beneficiary, tokenAddress).encodeABI()
}

export const enableSpendingLimitModuleMultiSendTx = async (
  safeAddress: string,
  safeVersion: string,
  connectedWalletAddress: string,
  moduleAddress: string,
): Promise<MultiSendTx> => {
  const multiSendTx = await enableModuleTx({
    moduleAddress,
    safeAddress,
    safeVersion,
    connectedWalletAddress,
  })

  return {
    to: multiSendTx.to,
    value: multiSendTx.valueInWei,
    data: multiSendTx.txData as string,
  }
}

export const addSpendingLimitBeneficiaryMultiSendTx = (beneficiary: string, moduleAddress: string): MultiSendTx => {
  const spendingLimitContract = getSpendingLimitContract(moduleAddress)

  return {
    to: moduleAddress,
    value: '0',
    data: spendingLimitContract.methods.addDelegate(beneficiary).encodeABI(),
  }
}

export const getResetSpendingLimitTx = (beneficiary: string, token: string, moduleAddress: string): MultiSendTx => {
  const spendingLimitContract = getSpendingLimitContract(moduleAddress)

  return {
    to: moduleAddress,
    value: '0',
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
  moduleAddress: string
}

export const setSpendingLimitTx = ({
  spendingLimitArgs: { beneficiary, token, spendingLimitInWei, resetTimeMin, resetBaseMin },
  safeAddress,
  moduleAddress,
}: SpendingLimitTxParams): CreateTransactionArgs => {
  const spendingLimitContract = getSpendingLimitContract(moduleAddress)

  const txArgs: CreateTransactionArgs = {
    safeAddress,
    to: moduleAddress,
    valueInWei: ZERO_VALUE,
    txData: spendingLimitContract.methods
      .setAllowance(beneficiary, token, spendingLimitInWei, resetTimeMin, resetBaseMin)
      .encodeABI(),
    operation: Operation.CALL,
    notifiedTransaction: TX_NOTIFICATION_TYPES.NEW_SPENDING_LIMIT_TX,
  }

  return txArgs
}

export const setSpendingLimitMultiSendTx = (args: SpendingLimitTxParams): MultiSendTx => {
  const tx = setSpendingLimitTx(args)

  return {
    to: tx.to,
    value: tx.valueInWei,
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
  to: getMultisendContractAddress(),
  valueInWei: ZERO_VALUE,
  txData: encodeMultiSendCall(transactions),
  notifiedTransaction: TX_NOTIFICATION_TYPES.NEW_SPENDING_LIMIT_TX,
  operation: Operation.DELEGATE,
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
