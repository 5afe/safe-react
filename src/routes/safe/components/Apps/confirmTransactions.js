// 
import React from 'react'
import styled from 'styled-components'

import { AddressInfo, Collapse, DividerLine, ModalFooterConfirmation, ModalTitle, TextBox } from 'src/components-v2'
import Bold from 'src/components/layout/Bold'
import Heading from 'src/components/layout/Heading'
import Img from 'src/components/layout/Img'
import { getEthAsToken } from 'src/logic/tokens/utils/tokenHelpers'

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

const confirmTransactions = (
  safeAddress,
  safeName,
  ethBalance,
  iconApp,
  txs,
  openModal,
  closeModal,
  onConfirm,
) => {
  const title = <ModalTitle iconUrl={iconApp} title="Compound" />

  const body = (
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
                    <Bold>{tx.value} ETH</Bold>
                  </div>
                </div>
                <div className="section">
                  <Heading tag="h3">Data (hex encoded)*</Heading>
                  <TextBox>{tx.data}</TextBox>
                </div>
              </CollapseContent>
            </Collapse>
          </Wrapper>
        )
      })}
    </>
  )
  const footer = (
    <ModalFooterConfirmation cancelText="Cancel" handleCancel={closeModal} handleOk={onConfirm} okText="Submit" />
  )

  openModal({
    title,
    body,
    footer,
    onClose: closeModal,
  })
}

export default confirmTransactions
