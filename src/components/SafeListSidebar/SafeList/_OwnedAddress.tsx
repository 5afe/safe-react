import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { generatePath } from 'react-router-dom'
import styled from 'styled-components'
import { EthHashInfo, Text } from '@gnosis.pm/safe-react-components'

import Link from 'src/components/layout/Link'
import { SAFE_ROUTES, LOAD_ADDRESS } from 'src/routes/routes'
import { addressBookName } from 'src/logic/addressBook/store/selectors'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 16px;

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
  }

  & > a:first-of-type {
    flex: 1;
  }

  & > a:nth-of-type(2) {
    text-decoration: underline;
  }
`

type Props = {
  address: string
  isAdded: boolean
  onClick: () => unknown
  children: ReactElement
}

export const OwnedAddress = ({ address, isAdded, onClick, children }: Props): ReactElement => {
  const name = useSelector((state) => addressBookName(state, { address }))

  return (
    <Wrapper>
      {children}

      <Link
        to={generatePath(SAFE_ROUTES.ASSETS_BALANCES, {
          safeAddress: address,
        })}
        onClick={onClick}
      >
        <EthHashInfo hash={address} name={name} showAvatar shortenHash={4} />
      </Link>

      {!isAdded && (
        <Link to={`${LOAD_ADDRESS}/${address}`} onClick={onClick}>
          <Text size="sm" color="primary">
            Add Safe
          </Text>
        </Link>
      )}
    </Wrapper>
  )
}
