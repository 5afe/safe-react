import { ReactElement, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import { Modal } from 'src/components/Modal'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import useTokenInfo from 'src/logic/safe/hooks/useTokenInfo'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { getDeleteAllowanceTxData } from 'src/logic/safe/utils/spendingLimits'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { SPENDING_LIMIT_MODULE_ADDRESS } from 'src/utils/constants'
import { getResetTimeOptions } from './FormFields/ResetTime'
import { AddressInfo, ResetTimeInfo } from './InfoDisplay'
import { SpendingLimitTable } from './LimitsTable/dataFetcher'
import { extractSafeAddress } from 'src/routes/routes'
import { TxModalWrapper } from 'src/routes/safe/components/Transactions/helpers/TxModalWrapper'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import Paragraph from 'src/components/layout/Paragraph'
import styled from 'styled-components'
import Block from 'src/components/layout/Block'
import { grey500 } from 'src/theme/variables'

interface RemoveSpendingLimitModalProps {
  onClose: () => void
  spendingLimit: SpendingLimitTable
  open: boolean
}

export const RemoveLimitModal = ({ onClose, spendingLimit, open }: RemoveSpendingLimitModalProps): ReactElement => {
  const tokenInfo = useTokenInfo(spendingLimit.spent.tokenAddress)
  const safeAddress = extractSafeAddress()
  const [txData, setTxData] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    const {
      beneficiary,
      spent: { tokenAddress },
    } = spendingLimit
    const txData = getDeleteAllowanceTxData({ beneficiary, tokenAddress })
    setTxData(txData)
  }, [spendingLimit])

  const removeSelectedSpendingLimit = (txParameters: TxParameters, delayExecution: boolean) => {
    try {
      dispatch(
        createTransaction({
          safeAddress,
          to: SPENDING_LIMIT_MODULE_ADDRESS,
          valueInWei: '0',
          txData,
          txNonce: txParameters.safeNonce,
          safeTxGas: txParameters.safeTxGas,
          ethParameters: txParameters,
          notifiedTransaction: TX_NOTIFICATION_TYPES.REMOVE_SPENDING_LIMIT_TX,
          delayExecution,
        }),
      )
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
        txTo={SPENDING_LIMIT_MODULE_ADDRESS}
        onSubmit={removeSelectedSpendingLimit}
        submitText="Remove"
      >
        <ModalHeader onClose={onClose} title="Remove spending limit" />
        <Hairline />

        <Modal.Body>
          <Col align="center" margin="md">
            {tokenInfo && (
              <AmountWrapper>
                <StyledBlock>
                  <img alt={tokenInfo.name} onError={setImageToPlaceholder} src={tokenInfo.logoUri || ''} />
                </StyledBlock>
                <Paragraph size="xl" color="black600" noMargin style={{ marginTop: '8px' }}>
                  {fromTokenUnit(spendingLimit.spent.amount, tokenInfo.decimals)} {tokenInfo.symbol}
                </Paragraph>
              </AmountWrapper>
            )}
          </Col>
          <Col margin="md">
            <AddressInfo title="Beneficiary" address={spendingLimit.beneficiary} />
          </Col>
          <Col>
            <ResetTimeInfo title="Reset Time" label={resetTimeLabel} />
          </Col>
        </Modal.Body>
      </TxModalWrapper>
    </Modal>
  )
}

const AmountWrapper = styled.div`
  width: 100%;
  text-align: center;
`

const StyledBlock = styled(Block)`
  background-color: ${grey500};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  & img {
    width: 26px;
  }
`
