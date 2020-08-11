import React from 'react'
import styled from 'styled-components'
import { Divider, IconText } from '@gnosis.pm/safe-react-components'

import NestedList from '../../List'
import WalletInfo from '../WalletInfo'

const StyledDivider = styled(Divider)`
  margin: 16px -8px;
`

const HelpContainer = styled.div`
  margin-bottom: 8px;
`
type Props = {
  onToggleSafeList: () => void
  onReceiveClick: () => void
  onNewTransactionClick: () => void
}

const Sidebar = ({ onToggleSafeList, onReceiveClick, onNewTransactionClick }: Props): React.ReactElement => {
  return (
    <>
      <WalletInfo
        address="0xEE63624cC4Dd2355B16b35eFaadF3F7450A9438B"
        safeName="SomeName"
        balance="$111,111"
        onToggleSafeList={onToggleSafeList}
        onReceiveClick={onReceiveClick}
        onNewTransactionClick={onNewTransactionClick}
      />

      <StyledDivider />
      <NestedList />

      <HelpContainer>
        <StyledDivider />
        <IconText iconSize="md" textSize="sm" iconType="question" text="Help Center" />
      </HelpContainer>
    </>
  )
}

export default Sidebar
