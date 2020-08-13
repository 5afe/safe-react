import React from 'react'
import styled from 'styled-components'
import { Divider, IconText } from '@gnosis.pm/safe-react-components'

import List, { ListItemType } from '../../List'
import WalletInfo from '../WalletInfo'

const StyledDivider = styled(Divider)`
  margin: 16px -8px;
`

const HelpContainer = styled.div`
  margin-bottom: 8px;
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
        <IconText iconSize="md" textSize="sm" iconType="question" text="Help Center" />
      </HelpContainer>
    </>
  )
}

export default Sidebar
