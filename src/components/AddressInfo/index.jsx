// @flow
import React from 'react'
import styled from 'styled-components'

import CopyBtn from '~/components/CopyBtn'
import EtherscanBtn from '~/components/EtherscanBtn'
import Identicon from '~/components/Identicon'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import Paragraph from '~/components/layout/Paragraph'
import { border, xs } from '~/theme/variables'

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  .icon-section {
    margin-right: 10px;
  }

  .data-section {
    display: flex;
    flex-direction: column;

    .address {
      display: flex;
    }
  }
`
const StyledBlock = styled(Block)`
  font-size: 12px;
  line-height: 1.08;
  letter-spacing: -0.5;
  background-color: ${border};
  width: fit-content;
  padding: 5px 10px;
  margin-top: ${xs};
  border-radius: 3px;
`
type Props = {
  safeName: string,
  safeAddress: string,
  ethBalance: string,
}

const AddressInfo = ({ ethBalance, safeAddress, safeName }: Props) => {
  return (
    <Wrapper>
      <div className="icon-section">
        <Identicon address={safeAddress} diameter={32} />
      </div>
      <div className="data-section">
        {safeName && (
          <Paragraph noMargin weight="bolder">
            {safeName}
          </Paragraph>
        )}
        <div className="address">
          <Paragraph noMargin weight="bolder">
            {safeAddress}
          </Paragraph>
          <CopyBtn content={safeAddress} />
          <EtherscanBtn type="address" value={safeAddress} />
        </div>
        {ethBalance && (
          <StyledBlock>
            <Paragraph noMargin>
              Balance: <Bold>{`${ethBalance} ETH`}</Bold>
            </Paragraph>
          </StyledBlock>
        )}
      </div>
    </Wrapper>
  )
}

export default AddressInfo
