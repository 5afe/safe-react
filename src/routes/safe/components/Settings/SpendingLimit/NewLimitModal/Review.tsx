import { Text } from '@gnosis.pm/safe-react-components'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { ButtonStatus, Modal } from 'src/components/Modal'
import { ReviewInfoText } from 'src/components/ReviewInfoText'
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
import { getResetTimeOptions } from 'src/routes/safe/components/Settings/SpendingLimit/FormFields/ResetTime'
import { AddressInfo, ResetTimeInfo, TokenInfo } from 'src/routes/safe/components/Settings/SpendingLimit/InfoDisplay'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import Hairline from 'src/components/layout/Hairline'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { useEstimationStatus } from 'src/logic/hooks/useEstimationStatus'
import { isModuleEnabled } from 'src/logic/safe/utils/modules'
import { SPENDING_LIMIT_MODULE_ADDRESS } from 'src/utils/constants'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'

import { ActionCallback, CREATE } from '.'

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

const calculateSpendingLimitsTxData = (
  safeAddress: string,
  safeVersion: string,
  spendingLimits: SpendingLimit[] | null | undefined,
  existentSpendingLimit: SpendingLimit | null,
  txToken: Token,
  values: Record<string, string>,
  modules: string[],
  txParameters?: TxParameters,
): {
  spendingLimitTxData: CreateTransactionArgs
  transactions: MultiSendTx[]
  spendingLimitArgs: {
    beneficiary: string
    token: string
    spendingLimitInWei: string
    resetTimeMin: number
    resetBaseMin: number
  }
} => {
  const isSpendingLimitEnabled = isModuleEnabled(modules, SPENDING_LIMIT_MODULE_ADDRESS)
  const transactions: MultiSendTx[] = []

  // is spendingLimit module enabled? -> if not, create the tx to enable it, and encode it
  if (!isSpendingLimitEnabled && safeAddress) {
    transactions.push(enableSpendingLimitModuleMultiSendTx(safeAddress, safeVersion))
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
  const existentSpendingLimit = useExistentSpendingLimit({ spendingLimits, txToken, values })
  const [estimateGasArgs, setEstimateGasArgs] = useState<Partial<CreateTransactionArgs>>({
    to: '',
    txData: '',
  })
  const [manualSafeTxGas, setManualSafeTxGas] = useState('0')
  const [manualGasPrice, setManualGasPrice] = useState<string | undefined>()
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>()

  const {
    gasCostFormatted,
    txEstimationExecutionStatus,
    isExecution,
    isCreation,
    isOffChainSignature,
    gasPrice,
    gasPriceFormatted,
    gasLimit,
    gasEstimation,
  } = useEstimateTransactionGas({
    txData: estimateGasArgs.txData as string,
    txRecipient: estimateGasArgs.to as string,
    operation: estimateGasArgs.operation,
    safeTxGas: manualSafeTxGas,
    manualGasPrice,
    manualGasLimit,
  })

  const [buttonStatus] = useEstimationStatus(txEstimationExecutionStatus)

  const safeModules = useMemo(() => modules?.map((pair) => pair[1]) || [], [modules])

  useEffect(() => {
    const { spendingLimitTxData } = calculateSpendingLimitsTxData(
      safeAddress,
      safeVersion,
      spendingLimits,
      existentSpendingLimit,
      txToken,
      values,
      safeModules,
    )
    setEstimateGasArgs(spendingLimitTxData)
  }, [safeAddress, safeVersion, spendingLimits, existentSpendingLimit, txToken, values, safeModules])

  const handleSubmit = (txParameters: TxParameters): void => {
    const { ethGasPrice, ethGasLimit, ethGasPriceInGWei } = txParameters
    const advancedOptionsTxParameters = {
      ...txParameters,
      ethGasPrice: ethGasPrice || gasPrice,
      ethGasPriceInGWei: ethGasPriceInGWei || gasPriceFormatted,
      ethGasLimit: ethGasLimit || gasLimit,
    }

    if (safeAddress) {
      const { spendingLimitTxData } = calculateSpendingLimitsTxData(
        safeAddress,
        safeVersion,
        spendingLimits,
        existentSpendingLimit,
        txToken,
        values,
        safeModules,
        advancedOptionsTxParameters,
      )

      dispatch(createTransaction(spendingLimitTxData))
    }
  }

  const resetTimeLabel = useMemo(
    () => (values.withResetTime ? getResetTimeOptions().find(({ value }) => value === values.resetTime)?.label : ''),
    [values.resetTime, values.withResetTime],
  )

  const previousResetTime = (existentSpendingLimit: SpendingLimit) =>
    getResetTimeOptions().find(({ value }) => value === (+existentSpendingLimit.resetTimeMin).toString())?.label ??
    'One-time spending limit'

  const closeEditModalCallback = (txParameters: TxParameters) => {
    const oldGasPrice = gasPriceFormatted
    const newGasPrice = txParameters.ethGasPrice
    const oldSafeTxGas = gasEstimation
    const newSafeTxGas = txParameters.safeTxGas

    if (newGasPrice && oldGasPrice !== newGasPrice) {
      setManualGasPrice(txParameters.ethGasPrice)
    }

    if (txParameters.ethGasLimit && gasLimit !== txParameters.ethGasLimit) {
      setManualGasLimit(txParameters.ethGasLimit)
    }

    if (newSafeTxGas && oldSafeTxGas !== newSafeTxGas) {
      setManualSafeTxGas(newSafeTxGas)
    }
  }

  let confirmButtonText = 'Submit'
  if (ButtonStatus.LOADING === buttonStatus) {
    confirmButtonText = txEstimationExecutionStatus === EstimationStatus.LOADING ? 'Estimating' : 'Submitting'
  }

  return (
    <EditableTxParameters
      isOffChainSignature={isOffChainSignature}
      isExecution={isExecution}
      ethGasLimit={gasLimit}
      ethGasPrice={gasPriceFormatted}
      safeTxGas={gasEstimation}
      closeEditModalCallback={closeEditModalCallback}
    >
      {(txParameters, toggleEditMode) => (
        <>
          <ModalHeader onClose={onClose} title="New spending limit" subTitle="2 of 2" />
          <Hairline />

          <Modal.Body>
            <Col margin="lg">
              <AddressInfo address={values.beneficiary} title="Beneficiary" />
            </Col>
            <Col margin="lg">
              <TokenInfo
                amount={fromTokenUnit(toTokenUnit(values.amount, txToken.decimals), txToken.decimals)}
                title="Amount"
                token={txToken}
              />
              {existentSpendingLimit && (
                <Text size="lg" color="error">
                  Previous Amount: {existentSpendingLimit.amount}
                </Text>
              )}
            </Col>
            <Col margin="lg">
              <ResetTimeInfo title="Reset Time" label={resetTimeLabel} />
              {existentSpendingLimit && (
                <Row align="center" margin="md">
                  <Text size="lg" color="error">
                    Previous Reset Time: {previousResetTime(existentSpendingLimit)}
                  </Text>
                </Row>
              )}
            </Col>

            {existentSpendingLimit && (
              <Col margin="md">
                <Text size="xl" color="error" center strong>
                  You are about to replace an existent spending limit
                </Text>
              </Col>
            )}
            {/* Tx Parameters */}
            <TxParametersDetail
              txParameters={txParameters}
              onEdit={toggleEditMode}
              isTransactionCreation={isCreation}
              isTransactionExecution={isExecution}
              isOffChainSignature={isOffChainSignature}
            />
          </Modal.Body>
          <ReviewInfoText
            gasCostFormatted={gasCostFormatted}
            isCreation={isCreation}
            isExecution={isExecution}
            isOffChainSignature={isOffChainSignature}
            safeNonce={txParameters.safeNonce}
            txEstimationExecutionStatus={txEstimationExecutionStatus}
          />

          <Modal.Footer withoutBorder={buttonStatus !== ButtonStatus.LOADING}>
            <Modal.Footer.Buttons
              cancelButtonProps={{
                onClick: () => onBack({ values: {}, txToken: makeToken(), step: CREATE }),
                text: 'Back',
              }}
              confirmButtonProps={{
                onClick: () => handleSubmit(txParameters),
                disabled: existentSpendingLimit === undefined,
                status: buttonStatus,
                text: confirmButtonText,
              }}
            />
          </Modal.Footer>
        </>
      )}
    </EditableTxParameters>
  )
}
