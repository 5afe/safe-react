import BN from 'bn.js'
import { getSpendingLimitContract, getSpendingLimitModuleAddress } from 'src/logic/contracts/spendingLimitContracts'
import { _getChainId } from 'src/config'

export type AllowanceTransferProps = {
  safe: string
  token: string
  to: string
  amount: number | string | BN
  paymentToken: string
  payment: number | string | BN
  delegate: string
  signature: string | number[]
}

export const estimateGasForAllowanceTransfer = async ({
  safe,
  token,
  to,
  amount,
  paymentToken,
  payment,
  delegate,
  signature,
}: AllowanceTransferProps): Promise<number> => {
  const spendingLimitModuleAddress = getSpendingLimitModuleAddress(_getChainId())
  if (!spendingLimitModuleAddress) return 0

  const spendingLimit = getSpendingLimitContract(spendingLimitModuleAddress)

  return spendingLimit.methods
    .executeAllowanceTransfer(safe, token, to, amount, paymentToken, payment, delegate, signature)
    .estimateGas({ from: delegate })
}

export const checkAllowanceTransferExecution = async ({
  safe,
  token,
  to,
  amount,
  paymentToken,
  payment,
  delegate,
  signature,
}: AllowanceTransferProps): Promise<boolean> => {
  const spendingLimitModuleAddress = getSpendingLimitModuleAddress(_getChainId())
  if (!spendingLimitModuleAddress) return false

  const spendingLimit = getSpendingLimitContract(spendingLimitModuleAddress)

  return spendingLimit.methods
    .executeAllowanceTransfer(safe, token, to, amount, paymentToken, payment, delegate, signature)
    .call({ from: delegate })
    .then(() => true)
    .catch((e) => {
      console.warn('Transaction will fail\n\n', e)
      return false
    })
}
