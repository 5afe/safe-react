import styled from 'styled-components'
import { Divider } from '@gnosis.pm/safe-react-components'

import List, { ListItemType, StyledListItemText } from 'src/components/List'
import SafeHeader from './SafeHeader'
import Track from 'src/components/Track'
import { OVERVIEW_EVENTS } from 'src/utils/events/overview'
import ListIcon from 'src/components/List/ListIcon'
import { background, primaryLite } from 'src/theme/variables'

const StyledDivider = styled(Divider)`
  margin: 16px -8px 0;
  border-top: 1px solid ${background};
`

const HelpContainer = styled.div`
  margin-top: auto;
`

const HelpList = styled.div`
  margin: 24px 0;
  padding: 0 12px;
`

const HelpCenterLink = styled.a`
  width: 100%;
  display: flex;
  position: relative;
  box-sizing: border-box;
  text-align: left;
  align-items: center;
  padding: 6px 12px;
  justify-content: flex-start;
  text-decoration: none;
  border-radius: 8px;

  &:hover {
    background-color: ${primaryLite};
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
  safeAddress?: string
  safeName?: string
  balance?: string
  granted: boolean
  onToggleSafeList: () => void
  onReceiveClick: () => void
  onNewTransactionClick: () => void
  items: ListItemType[]
}

// const isDesktop = process.env.REACT_APP_BUILD_FOR_DESKTOP

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
      <SafeHeader
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

        <HelpList>
          <Track {...OVERVIEW_EVENTS.HELP_CENTER}>
            <HelpCenterLink href="https://help.gnosis-safe.io/en/" target="_blank" title="Help Center of Gnosis Safe">
              <ListIcon type="question" color="secondary" size="sm" />
              <StyledListItemText>Help Center</StyledListItemText>
            </HelpCenterLink>
          </Track>
        </HelpList>
      </HelpContainer>
    </>
  )
}

export default Sidebar
