import React from 'react'
import styled from 'styled-components'

import CopyBtn from 'src/components/CopyBtn'
import EtherscanBtn from 'src/components/EtherscanBtn'
import Identicon from 'src/components/Identicon'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import Paragraph from 'src/components/layout/Paragraph'
import { border, xs } from 'src/theme/variables'

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
interface Props {
  safeName?: string
  safeAddress: string
  ethBalance?: string
}

const AddressInfo = ({ ethBalance, safeAddress, safeName }: Props): JSX.Element => {
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
