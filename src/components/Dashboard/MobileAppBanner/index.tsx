import { ReactElement, useCallback, useState } from 'react'
import styled from 'styled-components'
import { Grid } from '@material-ui/core'
import { Button } from '@gnosis.pm/safe-react-components'
import AppstoreButton from 'src/components/AppstoreButton'
import { trackEvent, CustomEvent } from 'src/utils/googleTagManager'
import useCachedState from 'src/utils/storage/useCachedState'
import MOBILE_APP_EVENTS from 'src/utils/events/mobile-app-promotion'
import { WidgetTitle } from '../styled'

const MAX_SLIDES = 5
const CLOSE_SLIDE = 6
const localStorageKey = 'mobileBannerClosed'

const StyledContainer = styled.div`
  position: relative;
  width: 480px;
  height: 224px;
`

const StyledBanner = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 8px;
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: 100%;
  background-image: ${({ $count }: { $count: number }) => `url(./mobile-banner/${$count}.png)`};
  transition: background-image 100ms linear;
  cursor: ${({ $count }: { $count: number }) => ($count === 1 ? 'default' : 'pointer')};
  height: 100%;
  width: 100%;

  &:after {
    content: '';
    background-image: ${({ $count }: { $count: number }) =>
      $count !== CLOSE_SLIDE ? `url(./mobile-banner/${$count + 1}.png)` : 'none'};
  }

  &:before {
    content: '';
    position: absolute;
    z-index: 2;
    right: 24px;
    bottom: 27px;
    width: 119px;
    height: 38px;
    cursor: pointer;
  }
`

const StyledAppstoreButton = styled.div`
  position: absolute;
  z-index: 2;
  left: 37px;
  bottom: 27px;
  opacity: 0;
  cursor: pointer;
`

const StyledCloseButton = styled.button`
  position: absolute;
  z-index: 2;
  right: 21px;
  top: 22px;
  opacity: 0.5;
  width: 20px;
  height: 20px;
  cursor: pointer;
  opacity: 0;
`

const StyledBackButton = styled.button`
  position: absolute;
  z-index: 2;
  left: 38px;
  bottom: 30px;
  opacity: 0.5;
  width: 35px;
  height: 35px;
  cursor: pointer;
  opacity: 0;
`

const StyledButtons = styled.div`
  position: absolute;
  z-index: 2;
  left: 22px;
  bottom: 30px;
  cursor: pointer;
  opacity: 0;
`

const UserSurvey = ({ onDone }: { onDone: () => void }): ReactElement => {
  const onReply = useCallback(
    (event: CustomEvent) => {
      trackEvent(event)

      setTimeout(() => {
        onDone()
      }, 300)
    },
    [onDone],
  )

  return (
    <>
      <StyledBanner $count={CLOSE_SLIDE} />

      <StyledButtons>
        <Button size="md" variant="outlined" color="primary" onClick={() => onReply(MOBILE_APP_EVENTS.alreadyUse)}>
          Already use it!
        </Button>

        <Button size="md" variant="outlined" color="primary" onClick={() => onReply(MOBILE_APP_EVENTS.notInterested)}>
          Not interested
        </Button>
      </StyledButtons>
    </>
  )
}

const MobileAppBanner = (): ReactElement | null => {
  const [count, setCount] = useState<number>(1)
  const [closing, setClosing] = useState<boolean>(false)
  const [closed, setClosed] = useCachedState(localStorageKey)

  const onClick = useCallback(() => {
    setCount((prevCount) => (prevCount === MAX_SLIDES ? 1 : prevCount + 1))
    trackEvent(MOBILE_APP_EVENTS.dashboardBannerClick)
  }, [])

  const onBack = useCallback(() => {
    setCount((prevCount) => (prevCount === 1 ? MAX_SLIDES : prevCount - 1))
    trackEvent(MOBILE_APP_EVENTS.dashboardBannerClick)
  }, [])

  const onClose = useCallback(() => {
    setClosing(true)
    trackEvent(MOBILE_APP_EVENTS.dashboardBannerClose)
  }, [])

  const onDone = useCallback(() => {
    setClosed(true)
  }, [setClosed])

  return closed ? null : (
    <Grid item xs={12} lg={6}>
      <WidgetTitle>&nbsp;</WidgetTitle>

      <StyledContainer>
        {closing ? (
          <UserSurvey onDone={onDone} />
        ) : (
          <>
            <StyledBanner $count={count} onClick={onClick} />

            <StyledCloseButton onClick={onClose} aria-label="Close mobile banner" />

            <StyledBackButton onClick={onBack} aria-label="Previous mobile banner slide" />

            {count === 1 && (
              <StyledAppstoreButton>
                <AppstoreButton placement="dashboard" />
              </StyledAppstoreButton>
            )}
          </>
        )}
      </StyledContainer>
    </Grid>
  )
}

export default MobileAppBanner
