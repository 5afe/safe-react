import { lazy, useMemo } from 'react'
import styled from 'styled-components'
import { Divider } from '@gnosis.pm/safe-react-components'
import { useDispatch } from 'react-redux'

import List, { ListItemType, StyledListItem, StyledListItemText } from 'src/components/List'
import SafeHeader from './SafeHeader'
import { IS_PRODUCTION, BEAMER_ID } from 'src/utils/constants'
import { wrapInSuspense } from 'src/utils/wrapInSuspense'
import Track from 'src/components/Track'
import { OVERVIEW_EVENTS } from 'src/utils/events/overview'
import ListIcon from 'src/components/List/ListIcon'
import { openCookieBanner } from 'src/logic/cookies/store/actions/openCookieBanner'
import { loadFromCookie } from 'src/logic/cookies/utils'
import { COOKIES_KEY, BannerCookiesType, COOKIE_IDS } from 'src/logic/cookies/model/cookie'
import { background, primaryLite } from 'src/theme/variables'

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

const StyledList = styled(List)`
  background-color: #000;
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

// This doesn't play well if exported to its own file
const lazyLoad = (path: string): React.ReactElement => {
  // import(path) does not work unless it is a template literal
  const Component = lazy(() => import(`${path}`))
  return wrapInSuspense(<Component />)
}

const isDesktop = process.env.REACT_APP_BUILD_FOR_DESKTOP

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
  const debugToggle = useMemo(() => (IS_PRODUCTION ? null : lazyLoad('./DebugToggle')), [])
  const dispatch = useDispatch()

  const handleClick = (): void => {
    const cookiesState = loadFromCookie<BannerCookiesType>(COOKIES_KEY)
    if (!cookiesState) {
      dispatch(openCookieBanner({ cookieBannerOpen: true }))
      return
    }
    if (!cookiesState.acceptedSupportAndUpdates) {
      dispatch(
        openCookieBanner({
          cookieBannerOpen: true,
          key: COOKIE_IDS.BEAMER,
        }),
      )
    }
  }

  return (
    <>
      <div style={{ marginTop: '2rem' }}>
        <SafeHeader
          address={safeAddress}
          safeName={safeName}
          granted={granted}
          balance={balance}
          onToggleSafeList={onToggleSafeList}
          onReceiveClick={onReceiveClick}
          onNewTransactionClick={onNewTransactionClick}
        />
      </div>

      {items.length ? (
        <>
          <List items={items} />
        </>
      ) : null}

      <HelpContainer>
        {debugToggle}

        <HelpList>
          {/* icons color needs to be changed */}
          {!isDesktop && BEAMER_ID && (
            <Track {...OVERVIEW_EVENTS.WHATS_NEW}>
              <StyledListItem className="beamer-trigger" button onClick={handleClick}>
                <ListIcon type="gift" size="sm" color="primary" />
                <StyledListItemText>What&apos;s new</StyledListItemText>
              </StyledListItem>
            </Track>
          )}
        </HelpList>
      </HelpContainer>
    </>
  )
}

export default Sidebar
