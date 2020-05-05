// @flow
import { BigNumber } from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'

import { AddressInfo, Collapse, DividerLine, ModalFooterConfirmation, ModalTitle, TextBox } from '~/components-v2'
import Bold from '~/components/layout/Bold'
import Heading from '~/components/layout/Heading'
import Img from '~/components/layout/Img'
import { getEthAsToken } from '~/logic/tokens/utils/tokenHelpers'

const humanReadableBalance = (balance, decimals) => BigNumber(balance).times(`1e-${decimals}`).toFixed()

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
  nameApp: string,
  iconApp: string,
  txs: Array<any>,
  openModal: () => void,
  closeModal: () => void,
  onConfirm: () => void,
) => {
  const title = <ModalTitle iconUrl={iconApp} title={nameApp} />

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
                    <Bold>{humanReadableBalance(tx.value, 18)} ETH</Bold>
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
