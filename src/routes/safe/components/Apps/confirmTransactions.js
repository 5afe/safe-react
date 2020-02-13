// @flow
import React from 'react'
import styled from 'styled-components'

import Img from '~/components/layout/Img'
import Heading from '~/components/layout/Heading'
import Bold from '~/components/layout/Bold'
import { getEthAsToken } from '~/logic/tokens/utils/tokenHelpers'
import {
  ModalTitle,
  ModalFooterConfirmation,
  AddressInfo,
  DividerLine,
  Collapse,
  TextBox,
} from '~/components-v2'

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
  safeAddress: string,
  safeName: string,
  ethBalance: string,
  txs: Array<any>,
  openModal: () => void,
  closeModal: () => void,
  onConfirm: () => void
) => {
  const title = <ModalTitle title="Compound" />

  const body = (
    <>
      <AddressInfo
        safeAddress={safeAddress}
        safeName={safeName}
        ethBalance={ethBalance}
      />
      <DividerLine withArrow />
      {txs.map((tx, index) => {
        return (
          <Wrapper>
            <Collapse
              key={index}
              title={`Transaction ${index + 1}`}
              description={<AddressInfo safeAddress={tx.to} />}
            >
              <CollapseContent>
                <div className="section">
                  <Heading tag="h3">Value</Heading>
                  <div className="value-section">
                    <Img
                      src={getEthAsToken('0').logoUri}
                      height={40}
                      alt="Ether"
                    />
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
    <ModalFooterConfirmation
      okText="Submit"
      cancelText="Cancel"
      handleOk={onConfirm}
      handleCancel={closeModal}
    />
  )

  openModal({
    title,
    body,
    footer,
    onClose: closeModal,
  })
}

export default confirmTransactions
