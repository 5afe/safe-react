import { ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import { Modal } from 'src/components/Modal'
import { currentChainId } from 'src/logic/config/store/selectors'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import useTokenInfo from 'src/logic/safe/hooks/useTokenInfo'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { getDeleteAllowanceTxData } from 'src/logic/safe/utils/spendingLimits'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { getResetTimeOptions } from './FormFields/ResetTime'
import { AddressInfo, ResetTimeInfo } from './InfoDisplay'
import { SpendingLimitTable } from './LimitsTable/dataFetcher'
import { TxModalWrapper } from 'src/routes/safe/components/Transactions/helpers/TxModalWrapper'
import { TransferAmount } from 'src/routes/safe/components/Balances/SendModal/TransferAmount'
import { trackEvent } from 'src/utils/googleTagManager'
import { SETTINGS_EVENTS } from 'src/utils/events/settings'
import { getSpendingLimitModuleAddress } from 'src/logic/contracts/spendingLimitContracts'
import useSafeAddress from 'src/logic/currentSession/hooks/useSafeAddress'

interface RemoveSpendingLimitModalProps {
  onClose: () => void
  spendingLimit: SpendingLimitTable
  open: boolean
}

export const RemoveLimitModal = ({ onClose, spendingLimit, open }: RemoveSpendingLimitModalProps): ReactElement => {
  const tokenInfo = useTokenInfo(spendingLimit.spent.tokenAddress)
  const { safeAddress } = useSafeAddress()
  const [txData, setTxData] = useState('')
  const dispatch = useDispatch()
  const chainId = useSelector(currentChainId)

  const spendingLimitAddress = getSpendingLimitModuleAddress(chainId)

  useEffect(() => {
    const {
      beneficiary,
      spent: { tokenAddress },
    } = spendingLimit
    const txData = getDeleteAllowanceTxData({ beneficiary, tokenAddress })
    setTxData(txData)
  }, [spendingLimit])

  const removeSelectedSpendingLimit = (txParameters: TxParameters, delayExecution: boolean) => {
    if (!spendingLimitAddress) return
    try {
      dispatch(
        createTransaction({
          safeAddress,
          to: spendingLimitAddress,
          valueInWei: '0',
          txData,
          txNonce: txParameters.safeNonce,
          safeTxGas: txParameters.safeTxGas,
          ethParameters: txParameters,
          notifiedTransaction: TX_NOTIFICATION_TYPES.REMOVE_SPENDING_LIMIT_TX,
          delayExecution,
        }),
      )

      trackEvent(SETTINGS_EVENTS.SPENDING_LIMIT.LIMIT_REMOVED)
    } catch (e) {
      console.error(
        `failed to remove spending limit ${spendingLimit.beneficiary} -> ${spendingLimit.spent.tokenAddress}`,
        e.message,
      )
    }
  }

  const resetTimeLabel =
    getResetTimeOptions().find(({ value }) => +value === +spendingLimit.resetTime.resetTimeMin)?.label ?? ''

  return (
    <Modal
      handleClose={onClose}
      open={open}
      title="Remove spending limit"
      description="Remove the selected spending limit"
    >
      <TxModalWrapper
        txData={txData}
        txTo={spendingLimitAddress}
        onSubmit={removeSelectedSpendingLimit}
        onClose={onClose}
        submitText="Remove"
      >
        <ModalHeader onClose={onClose} title="Remove spending limit" />
        <Hairline />

        <Modal.Body>
          <Col align="center" margin="md">
            {tokenInfo && (
              <TransferAmount
                token={tokenInfo}
                text={`${fromTokenUnit(spendingLimit.spent.amount, tokenInfo.decimals)} ${tokenInfo.symbol}`}
              />
            )}
          </Col>
          <Col margin="md">
            <AddressInfo title="Beneficiary" address={spendingLimit.beneficiary} color="primary" />
          </Col>
          <Col>
            <ResetTimeInfo title="Reset Time" label={resetTimeLabel} color="primary" />
          </Col>
        </Modal.Body>
      </TxModalWrapper>
    </Modal>
  )
}
