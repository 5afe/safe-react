import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { EthHashInfo, Text } from '@gnosis.pm/safe-react-components'
import Link from 'src/components/layout/Link'
import { SAFELIST_ADDRESS, LOAD_ADDRESS } from 'src/routes/routes'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
  margin-right: 28px;
  border-bottom: 1px solid #e8e7e6;

  & > a:last-child {
    text-decoration: underline;
  }
`

type Props = {
  address: string
  onClick: () => unknown
}

export const UnsavedAddress = ({ address, onClick }: Props): ReactElement => {
  return (
    <Wrapper>
      <Link to={`${SAFELIST_ADDRESS}/${address}/balances`} onClick={onClick}>
        <EthHashInfo hash={address} showAvatar shortenHash={4} />
      </Link>

      <Link to={`${LOAD_ADDRESS}/${address}`} onClick={onClick}>
        <Text size="sm" color="primary">
          Add Safe
        </Text>
      </Link>
    </Wrapper>
  )
}
