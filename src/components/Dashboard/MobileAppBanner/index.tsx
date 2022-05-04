import { ReactElement, useCallback, useState } from 'react'
import styled from 'styled-components'
import { Button } from '@gnosis.pm/safe-react-components'
import AppstoreButton from 'src/components/AppstoreButton'
import { trackCustomClick } from 'src/utils/googleTagManager'
import useCachedState from 'src/utils/storage/useCachedState'

const StyledContainer = styled.div`
  position: relative;
  width: 480px;
  height: 224px;
`

const StyledBanner = styled.div`
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: 100%;
  background-image: ${({ $count }: { $count: number }) => `url(./mobile-banner/${$count}.png)`};
  transition: background-image 100ms linear;
  cursor: pointer;
  height: 100%;
  width: 100%;
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

const StyledButtons = styled.div`
  position: absolute;
  z-index: 2;
  left: 22px;
  bottom: 30px;
  cursor: pointer;
  opacity: 0;
`

// Tracking
const eventCategory = 'mobile-app-promotion'
const eventAction = 'dashboard-banner'
const eventLabels = {
  alreadyUse: 'already-use',
  notInterested: 'not-interested',
}

const MAX_SLIDES = 5
const CLOSE_SLIDE = 6
const localStorageKey = 'mobileBannerClosed'

const MobileAppBanner = (): ReactElement | null => {
  const [count, setCount] = useState<number>(1)
  const [closing, setClosing] = useState<boolean>(false)
  const [closed, setClosed] = useCachedState(localStorageKey)

  const onClick = useCallback(() => {
    setCount((prevCount) => (prevCount === MAX_SLIDES ? 1 : prevCount + 1))
  }, [])

  const onClose = useCallback(() => {
    setClosing(true)
  }, [])

  const onReply = useCallback(
    (label: string) => {
      trackCustomClick(eventCategory, eventAction, label)
      setTimeout(() => {
        setClosed(true)
      }, 300)
    },
    [setClosed],
  )

  return closed ? null : (
    <StyledContainer>
      {closing ? (
        <>
          <StyledBanner $count={CLOSE_SLIDE} />

          <StyledButtons>
            <Button size="md" variant="outlined" color="primary" onClick={() => onReply(eventLabels.alreadyUse)}>
              Already use it!
            </Button>

            <Button size="md" variant="outlined" color="primary" onClick={() => onReply(eventLabels.notInterested)}>
              Not interested
            </Button>
          </StyledButtons>
        </>
      ) : (
        <>
          <StyledBanner $count={count} onClick={onClick} />

          <StyledCloseButton onClick={onClose} />

          {count === 1 && (
            <StyledAppstoreButton>
              <AppstoreButton placement="dashboard" />
            </StyledAppstoreButton>
          )}
        </>
      )}
    </StyledContainer>
  )
}

export default MobileAppBanner
