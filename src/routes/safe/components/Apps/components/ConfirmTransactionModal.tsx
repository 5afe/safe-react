import React, { useEffect, useState } from 'react'
import { Icon, Text, Title, GenericModal, ModalFooterConfirmation } from '@gnosis.pm/safe-react-components'
import { Transaction, SendTransactionParams } from '@gnosis.pm/safe-apps-sdk'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'

import AddressInfo from 'src/components/AddressInfo'
import DividerLine from 'src/components/DividerLine'
import Collapse from 'src/components/Collapse'
import TextBox from 'src/components/TextBox'
import ModalTitle from 'src/components/ModalTitle'
import { mustBeEthereumAddress } from 'src/components/forms/validator'
import Bold from 'src/components/layout/Bold'
import Heading from 'src/components/layout/Heading'
import Img from 'src/components/layout/Img'
import { getEthAsToken } from 'src/logic/tokens/utils/tokenHelpers'
import { SafeApp } from 'src/routes/safe/components/Apps/types.d'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import createTransaction from 'src/logic/safe/store/actions/createTransaction'
import { MULTI_SEND_ADDRESS } from 'src/logic/contracts/safeContracts'
import { DELEGATE_CALL, TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { encodeMultiSendCall } from 'src/logic/safe/transactions/multisend'
import { estimateSafeTxGas } from 'src/logic/safe/transactions/gas'

import GasEstimationInfo from './GasEstimationInfo'
import { getNetworkInfo } from 'src/config'

const isTxValid = (t: Transaction): boolean => {
  if (!['string', 'number'].includes(typeof t.value)) {
    return false
  }

  if (typeof t.value === 'string' && !/^(0x)?[0-9a-f]+$/i.test(t.value)) {
    return false
  }

  const isAddressValid = mustBeEthereumAddress(t.to) === undefined
  return isAddressValid && !!t.data && typeof t.data === 'string'
}

const Wrapper = styled.div`
  margin-bottom: 15px;
`
const CollapseContent = styled.div`
  padding: 15px 0;

  .section {
    margin-bottom: 15px;
  }

  .value-section {
    display: flex;
    align-items: center;
  }
`

const IconText = styled.div`
  display: flex;
  align-items: center;

  span {
    margin-right: 4px;
  }
`
const StyledTextBox = styled(TextBox)`
  max-width: 444px;
`

type OwnProps = {
  isOpen: boolean
  app: SafeApp
  txs: Transaction[]
  params?: SendTransactionParams
  safeAddress: string
  safeName: string
  ethBalance: string
  onUserConfirm: (safeTxHash: string) => void
  onTxReject: () => void
  onClose: () => void
}

const { nativeCoin } = getNetworkInfo()

const ConfirmTransactionModal = ({
  isOpen,
  app,
  txs,
  safeAddress,
  ethBalance,
  safeName,
  params,
  onUserConfirm,
  onClose,
  onTxReject,
}: OwnProps): React.ReactElement | null => {
  const [estimatedSafeTxGas, setEstimatedSafeTxGas] = useState(0)
  const [estimatingGas, setEstimatingGas] = useState(false)

  useEffect(() => {
    const estimateGas = async () => {
      try {
        setEstimatingGas(true)
        const safeTxGas = await estimateSafeTxGas(
          undefined,
          safeAddress,
          encodeMultiSendCall(txs),
          MULTI_SEND_ADDRESS,
          '0',
          DELEGATE_CALL,
        )

        setEstimatedSafeTxGas(safeTxGas)
      } catch (err) {
        console.error(err)
      } finally {
        setEstimatingGas(false)
      }
    }
    if (params?.safeTxGas) {
      estimateGas()
    }
  }, [params, safeAddress, txs])

  const dispatch = useDispatch()
  if (!isOpen) {
    return null
  }

  const handleTxRejection = () => {
    onTxReject()
    onClose()
  }

  const handleUserConfirmation = (safeTxHash: string): void => {
    onUserConfirm(safeTxHash)
    onClose()
  }

  const confirmTransactions = async () => {
    const txData = encodeMultiSendCall(txs)

    await dispatch(
      createTransaction(
        {
          safeAddress,
          to: MULTI_SEND_ADDRESS,
          valueInWei: '0',
          txData,
          operation: DELEGATE_CALL,
          notifiedTransaction: TX_NOTIFICATION_TYPES.STANDARD_TX,
          origin: app.id,
          navigateToTransactionsTab: false,
          safeTxGas: Math.max(params?.safeTxGas || 0, estimatedSafeTxGas),
        },
        handleUserConfirmation,
        handleTxRejection,
      ),
    )
  }

  const areTxsMalformed = txs.some((t) => !isTxValid(t))

  const body = areTxsMalformed ? (
    <>
      <IconText>
        <Icon color="error" size="md" type="info" />
        <Title size="xs">Transaction error</Title>
      </IconText>
      <Text size="lg">
        This Safe App initiated a transaction which cannot be processed. Please get in touch with the developer of this
        Safe App for more information.
      </Text>
    </>
  ) : (
    <>
      <AddressInfo ethBalance={ethBalance} safeAddress={safeAddress} safeName={safeName} />
      <DividerLine withArrow />
      {txs.map((tx, index) => (
        <Wrapper key={index}>
          <Collapse description={<AddressInfo safeAddress={tx.to} />} title={`Transaction ${index + 1}`}>
            <CollapseContent>
              <div className="section">
                <Heading tag="h3">Value</Heading>
                <div className="value-section">
                  <Img alt="Ether" height={40} src={getEthAsToken('0').logoUri} />
                  <Bold>
                    {fromTokenUnit(tx.value, nativeCoin.decimals)} {nativeCoin.name}
                  </Bold>
                </div>
              </div>
              <div className="section">
                <Heading tag="h3">Data (hex encoded)*</Heading>
                <StyledTextBox>{tx.data}</StyledTextBox>
              </div>
            </CollapseContent>
          </Collapse>
        </Wrapper>
      ))}
      <DividerLine withArrow={false} />
      {params?.safeTxGas && (
        <div className="section">
          <Heading tag="h3">SafeTxGas</Heading>
          <StyledTextBox>{params?.safeTxGas}</StyledTextBox>
          <GasEstimationInfo
            appEstimation={params.safeTxGas}
            internalEstimation={estimatedSafeTxGas}
            loading={estimatingGas}
          />
        </div>
      )}
    </>
  )

  return (
    <GenericModal
      title={<ModalTitle title={app.name} iconUrl={app.iconUrl} />}
      body={body}
      footer={
        <ModalFooterConfirmation
          cancelText="Cancel"
          handleCancel={handleTxRejection}
          handleOk={confirmTransactions}
          okDisabled={areTxsMalformed}
          okText="Submit"
        />
      }
      onClose={handleTxRejection}
    />
  )
}

export default ConfirmTransactionModal
