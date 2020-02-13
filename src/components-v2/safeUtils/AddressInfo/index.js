// @flow
import React from 'react'
import styled from 'styled-components'

import Paragraph from '~/components/layout/Paragraph'
import EtherscanBtn from '~/components/EtherscanBtn'
import CopyBtn from '~/components/CopyBtn'
import Identicon from '~/components/Identicon'
import Bold from '~/components/layout/Bold'
import { xs, border } from '~/theme/variables'
import Block from '~/components/layout/Block'

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

const AddressInfo = ({ safeName, safeAddress, ethBalance }: Props) => {
  return (
    <Wrapper>
      <div className="icon-section">
        <Identicon address={safeAddress} diameter={32} />
      </div>
      <div className="data-section">
        {safeName && (
          <Paragraph weight="bolder" noMargin>
            {safeName}
          </Paragraph>
        )}
        <div className="address">
          <Paragraph weight="bolder" noMargin>
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
