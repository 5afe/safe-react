import React from 'react'
import { Icon, Text, Title, GenericModal, ModalFooterConfirmation } from '@gnosis.pm/safe-react-components'
import { Transaction, RequestId } from '@gnosis.pm/safe-apps-sdk'
import styled from 'styled-components'

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
import { humanReadableValue } from 'src/logic/tokens/utils/humanReadableValue'

const isTxValid = (t: Transaction): boolean => {
  if (!['string', 'number'].includes(typeof t.value)) {
    return false
  }

  if (typeof t.value === 'string' && !/^(0x)?[0-9a-f]+$/i.test(t.value)) {
    return false
  }

  const isAddressValid = mustBeEthereumAddress(t.to) === undefined
  return isAddressValid && t.data && typeof t.data === 'string'
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
  safeAddress: string
  safeName: string
  ethBalance: string
  requestId: RequestId
  onCancel: () => void
  onConfirm: () => void
  onClose: () => void
}

const ConfirmTransactionModal = ({
  isOpen,
  app,
  txs,
  safeAddress,
  ethBalance,
  safeName,
  requestId,
  onCancel,
  onConfirm,
  onClose,
}: OwnProps): React.ReactElement => {
  if (!isOpen) {
    return null
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
      {txs.map((tx, index) => {
        return (
          <Wrapper key={index}>
            <Collapse description={<AddressInfo safeAddress={tx.to} />} title={`Transaction ${index + 1}`}>
              <CollapseContent>
                <div className="section">
                  <Heading tag="h3">Value</Heading>
                  <div className="value-section">
                    <Img alt="Ether" height={40} src={getEthAsToken('0').logoUri} />
                    <Bold>{humanReadableValue(tx.value, 18)} ETH</Bold>
                  </div>
                </div>
                <div className="section">
                  <Heading tag="h3">Data (hex encoded)*</Heading>
                  <StyledTextBox>{tx.data}</StyledTextBox>
                </div>
              </CollapseContent>
            </Collapse>
          </Wrapper>
        )
      })}
    </>
  )

  return (
    <GenericModal
      title={<ModalTitle title={app.name} iconUrl={app.iconUrl} />}
      body={body}
      footer={
        <ModalFooterConfirmation
          cancelText="Cancel"
          handleCancel={onCancel}
          handleOk={onConfirm}
          okDisabled={areTxsMalformed}
          okText="Submit"
        />
      }
      onClose={onClose}
    />
  )
}

export default ConfirmTransactionModal
