import React from 'react'
import styled from 'styled-components'
import { Divider, ButtonLink } from '@gnosis.pm/safe-react-components'

import List, { ListItemType } from '../../List'
import WalletInfo from '../WalletInfo'

const StyledDivider = styled(Divider)`
  margin: 16px -8px 0;
`

const HelpContainer = styled.div`
  height: 58px;
`

const StyledButtonLink = styled(ButtonLink)`
  height: 40px;
  width: 176px;
  padding: 0 0 0 16px;
  margin: 16px 0;
  text-decoration: none;

  &:hover {
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.background};
    box-sizing: border-box;
  }
  p {
    font-family: ${({ theme }) => theme.fonts.fontFamily};
    font-size: 0.76em;
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: 1px;
    color: ${({ theme }) => theme.colors.placeHolder};
    text-transform: uppercase;
    padding: 0 0 0 8px;
  }
`
type Props = {
  items: ListItemType[]
  safeAddress: string | null
  safeName: string | null
  balance: string | null
  granted: boolean
  onToggleSafeList: () => void
  onReceiveClick: () => void
  onNewTransactionClick: () => void
}

const Sidebar = ({
  items,
  balance,
  safeAddress,
  safeName,
  granted,
  onToggleSafeList,
  onReceiveClick,
  onNewTransactionClick,
}: Props): React.ReactElement => {
  return (
    <>
      <WalletInfo
        address={safeAddress}
        safeName={safeName}
        granted={granted}
        balance={balance}
        onToggleSafeList={onToggleSafeList}
        onReceiveClick={onReceiveClick}
        onNewTransactionClick={onNewTransactionClick}
      />

      {items.length ? (
        <>
          <StyledDivider />
          <List items={items} />
        </>
      ) : null}

      <HelpContainer>
        <StyledDivider />
        <StyledButtonLink
          onClick={() => window.open('https://help.gnosis-safe.io/en/')}
          color="placeHolder"
          iconType="question"
        >
          HELP CENTER
        </StyledButtonLink>
      </HelpContainer>
    </>
  )
}

export default Sidebar
