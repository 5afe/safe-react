import { Text } from '@gnosis.pm/safe-react-components'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { Modal } from 'src/components/Modal'
import { createTransaction, CreateTransactionArgs } from 'src/logic/safe/store/actions/createTransaction'
import { SafeRecordProps, SpendingLimit } from 'src/logic/safe/store/models/safe'
import {
  addSpendingLimitBeneficiaryMultiSendTx,
  currentMinutes,
  enableSpendingLimitModuleMultiSendTx,
  getResetSpendingLimitTx,
  setSpendingLimitMultiSendTx,
  setSpendingLimitTx,
  spendingLimitMultiSendTx,
  SpendingLimitRow,
} from 'src/logic/safe/utils/spendingLimits'
import { MultiSendTx } from 'src/logic/safe/transactions/multisend'
import { makeToken, Token } from 'src/logic/tokens/store/model/token'
import { fromTokenUnit, toTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { getResetTimeOptions } from 'src/routes/safe/components/Settings/SpendingLimit/FormFields/ResetTime'
import { AddressInfo, ResetTimeInfo } from 'src/routes/safe/components/Settings/SpendingLimit/InfoDisplay'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import Hairline from 'src/components/layout/Hairline'
import { isModuleEnabled } from 'src/logic/safe/utils/modules'
import { SPENDING_LIMIT_MODULE_ADDRESS } from 'src/utils/constants'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { TxModalWrapper } from 'src/routes/safe/components/Transactions/helpers/TxModalWrapper'
import { ActionCallback, CREATE } from 'src/routes/safe/components/Settings/SpendingLimit/NewLimitModal'
import { TransferAmount } from 'src/routes/safe/components/Balances/SendModal/TransferAmount'
import { getStepTitle } from 'src/routes/safe/components/Balances/SendModal/utils'

const useExistentSpendingLimit = ({
  spendingLimits,
  txToken,
  values,
}: {
  spendingLimits?: SafeRecordProps['spendingLimits']
  txToken: Token
  values: ReviewSpendingLimitProps['values']
}) => {
  // undefined: before setting a value
  // null: if no previous value
  // SpendingLimit: if previous value exists
  return useMemo<SpendingLimit | null>(() => {
    // if `delegate` already exist, check what tokens were delegated to the _beneficiary_ `getTokens(safe, delegate)`
    const currentDelegate = spendingLimits?.find(
      ({ delegate, token }) => sameAddress(delegate, values.beneficiary) && sameAddress(token, values.token),
    )

    // let the user know that is about to replace an existent allowance
    if (currentDelegate !== undefined) {
      return {
        ...currentDelegate,
        amount: fromTokenUnit(currentDelegate.amount, txToken.decimals),
      }
    } else {
      return null
    }
  }, [spendingLimits, txToken.decimals, values.beneficiary, values.token])
}

type SpendingLimitsTxData = {
  spendingLimitTxData: CreateTransactionArgs
  transactions: MultiSendTx[]
  spendingLimitArgs: {
    beneficiary: string
    token: string
    spendingLimitInWei: string
    resetTimeMin: number
    resetBaseMin: number
  }
}
const calculateSpendingLimitsTxData = async (
  safeAddress: string,
  safeVersion: string,
  connectedWalletAddress: string,
  spendingLimits: SpendingLimit[] | null | undefined,
  existentSpendingLimit: SpendingLimit | null,
  txToken: Token,
  values: Record<string, string>,
  modules: string[],
  txParameters?: TxParameters,
): Promise<SpendingLimitsTxData> => {
  const isSpendingLimitEnabled = isModuleEnabled(modules, SPENDING_LIMIT_MODULE_ADDRESS)
  const transactions: MultiSendTx[] = []

  // is spendingLimit module enabled? -> if not, create the tx to enable it, and encode it
  if (!isSpendingLimitEnabled && safeAddress) {
    const enableSpendingLimitTx = await enableSpendingLimitModuleMultiSendTx(
      safeAddress,
      safeVersion,
      connectedWalletAddress,
    )
    transactions.push(enableSpendingLimitTx)
  }

  // does `delegate` already exist? (`getDelegates`, previously queried to build the table with allowances (??))
  //                                  ^ - shall we rely on this or query the list of delegates once again?
  const isDelegateAlreadyAdded =
    spendingLimits?.some(({ delegate }) => sameAddress(delegate, values?.beneficiary)) ?? false

  // if `delegate` does not exist, add it by calling `addDelegate(beneficiary)`
  if (!isDelegateAlreadyAdded && values?.beneficiary) {
    transactions.push(addSpendingLimitBeneficiaryMultiSendTx(values.beneficiary))
  }

  if (existentSpendingLimit && existentSpendingLimit.spent !== '0') {
    transactions.push(getResetSpendingLimitTx(existentSpendingLimit.delegate, txToken.address))
  }

  // prepare the setAllowance tx
  const startTime = currentMinutes() - 30
  const spendingLimitArgs = {
    beneficiary: values.beneficiary,
    token: values.token,
    spendingLimitInWei: toTokenUnit(values.amount, txToken.decimals),
    resetTimeMin: values.withResetTime ? +values.resetTime : 0,
    resetBaseMin: values.withResetTime ? startTime : 0,
  }

  let spendingLimitTxData
  if (safeAddress) {
    // if there's no tx for enable module or adding a delegate, then we avoid using multiSend Tx
    if (transactions.length === 0) {
      spendingLimitTxData = setSpendingLimitTx({ spendingLimitArgs, safeAddress })
    } else {
      const encodedTxForMultisend = setSpendingLimitMultiSendTx({ spendingLimitArgs, safeAddress })
      transactions.push(encodedTxForMultisend)
      spendingLimitTxData = spendingLimitMultiSendTx({ transactions, safeAddress })
    }

    if (txParameters) {
      spendingLimitTxData.txNonce = txParameters.safeNonce
      spendingLimitTxData.safeTxGas = txParameters.safeTxGas ? txParameters.safeTxGas : undefined
      spendingLimitTxData.ethParameters = txParameters
    }
  }
  return {
    spendingLimitTxData,
    transactions,
    spendingLimitArgs,
  }
}

interface ReviewSpendingLimitProps {
  onBack: ActionCallback
  onClose: () => void
  txToken: Token
  values: Record<string, string>
  existentSpendingLimit?: SpendingLimitRow
}

export const ReviewSpendingLimits = ({ onBack, onClose, txToken, values }: ReviewSpendingLimitProps): ReactElement => {
  const dispatch = useDispatch()

  const {
    address: safeAddress = '',
    spendingLimits,
    currentVersion: safeVersion = '',
    modules,
  } = useSelector(currentSafe) ?? {}
  const connectedWalletAddress = useSelector(userAccountSelector)
  const existentSpendingLimit = useExistentSpendingLimit({ spendingLimits, txToken, values })
  const [estimateGasArgs, setEstimateGasArgs] = useState<Partial<CreateTransactionArgs>>({
    to: '',
    txData: '',
  })

  const safeModules = useMemo(() => modules?.map((pair) => pair[1]) || [], [modules])

  useEffect(() => {
    const calculateSpendingLimit = async () => {
      const { spendingLimitTxData } = await calculateSpendingLimitsTxData(
        safeAddress,
        safeVersion,
        connectedWalletAddress,
        spendingLimits,
        existentSpendingLimit,
        txToken,
        values,
        safeModules,
      )
      setEstimateGasArgs(spendingLimitTxData)
    }
    calculateSpendingLimit()
  }, [
    safeAddress,
    safeVersion,
    connectedWalletAddress,
    spendingLimits,
    existentSpendingLimit,
    txToken,
    values,
    safeModules,
  ])

  const handleSubmit = async (txParameters: TxParameters, delayExecution: boolean): Promise<void> => {
    const { ethGasPrice, ethGasLimit, ethGasPriceInGWei } = txParameters
    const advancedOptionsTxParameters = {
      ...txParameters,
      ethGasPrice,
      ethGasPriceInGWei,
      ethGasLimit,
    }

    if (safeAddress) {
      const { spendingLimitTxData } = await calculateSpendingLimitsTxData(
        safeAddress,
        safeVersion,
        connectedWalletAddress,
        spendingLimits,
        existentSpendingLimit,
        txToken,
        values,
        safeModules,
        advancedOptionsTxParameters,
      )

      dispatch(createTransaction({ ...spendingLimitTxData, delayExecution }))
    }
  }

  const resetTimeLabel = useMemo(
    () => (values.withResetTime ? getResetTimeOptions().find(({ value }) => value === values.resetTime)?.label : ''),
    [values.resetTime, values.withResetTime],
  )

  const previousResetTime = (existentSpendingLimit: SpendingLimit) =>
    getResetTimeOptions().find(({ value }) => value === (+existentSpendingLimit.resetTimeMin).toString())?.label ??
    'One-time spending limit'

  return (
    <TxModalWrapper
      txData={estimateGasArgs.txData || ''}
      txTo={estimateGasArgs.to}
      operation={estimateGasArgs.operation}
      onSubmit={handleSubmit}
      onBack={() => onBack({ values: {}, txToken: makeToken(), step: CREATE })}
      submitText="Submit"
      isSubmitDisabled={existentSpendingLimit === undefined}
    >
      <ModalHeader onClose={onClose} title="New spending limit" subTitle={getStepTitle(2, 2)} />
      <Hairline />

      <Modal.Body>
        <Col align="center" margin="md">
          <TransferAmount
            token={txToken}
            text={`${fromTokenUnit(toTokenUnit(values.amount, txToken.decimals), txToken.decimals)} ${txToken.symbol}`}
          />
          {existentSpendingLimit && (
            <Text size="lg" color="error" center>
              Previous Amount: {existentSpendingLimit.amount}
            </Text>
          )}
        </Col>
        <Col margin="md">
          <AddressInfo address={values.beneficiary} title="Beneficiary" color="placeHolder" />
        </Col>
        <Col margin="md">
          <ResetTimeInfo title="Reset Time" label={resetTimeLabel} color="placeHolder" />
          {existentSpendingLimit && (
            <Row align="center" margin="md">
              <Text size="lg" color="error">
                Previous Reset Time: {previousResetTime(existentSpendingLimit)}
              </Text>
            </Row>
          )}
        </Col>

        {existentSpendingLimit && (
          <Col>
            <Text size="xl" color="error" center strong>
              You are about to replace an existent spending limit
            </Text>
          </Col>
        )}
      </Modal.Body>
    </TxModalWrapper>
  )
}
