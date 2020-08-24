import React from 'react'
import styled from 'styled-components'
import { Divider, IconText } from '@gnosis.pm/safe-react-components'

import List, { ListItemType } from 'src/components/List'
import WalletInfo from 'src/components/SidebarLayout/WalletInfo'

const StyledDivider = styled(Divider)`
  margin: 16px -8px 0;
`

const HelpContainer = styled.div`
  height: 58px;
`

const HelpCenterLink = styled.a`
  height: 30px;
  width: 166px;
  padding: 10px 0 0 16px;
  margin: 10px 0px;
  text-decoration: none;
  display: block;

  &:hover {
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.background};
    box-sizing: content-box;
  }
  p {
    font-family: ${({ theme }) => theme.fonts.fontFamily};
    font-size: 0.76em;
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: 1px;
    color: ${({ theme }) => theme.colors.placeHolder};
    text-transform: uppercase;
    padding: 0 0 0 4px;
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
        <HelpCenterLink href="https://help.gnosis-safe.io/en/" target="_blank" title="Help Center of Gnosis Safe">
          <IconText text="HELP CENTER" iconSize="md" textSize="md" color="placeHolder" iconType="question" />
        </HelpCenterLink>
      </HelpContainer>
    </>
  )
}

export default Sidebar
