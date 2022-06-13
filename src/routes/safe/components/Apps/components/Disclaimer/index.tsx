import { memo } from 'react'
import styled from 'styled-components'
import { Icon } from '@gnosis.pm/safe-react-components'
import Grid from '@material-ui/core/Grid'
import Slider, { SliderItem } from './Slider'
import LegalDisclaimer from './LegalDisclaimer'
import { alpha } from '@material-ui/core/styles'
import SecuritySteps from './SecuritySteps'
import WarningDefaultList from './WarningDefaultList'
import { useAppList } from '../../hooks/appList/useAppList'
import { useEffect } from 'react'

interface OwnProps {
  onCancel: () => void
  onConfirm: () => void
  appUrl: string
  isConsentAccepted?: boolean
  isSafeAppInDefaultList: boolean
  isFirstTimeAccessingApp: boolean
}

//eslint-disable-next-line
const SafeAppsDisclaimer = ({
  onCancel,
  onConfirm,
  appUrl,
  isConsentAccepted,
  isSafeAppInDefaultList,
  isFirstTimeAccessingApp,
}: OwnProps): JSX.Element => {
  const { appList } = useAppList()

  const handleComplete = () => {
    onConfirm()
  }

  useEffect(() => {
    console.log(appList, isConsentAccepted, appUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appList])

  return (
    <StyledContainer>
      <StyledWrapper>
        <Grid container justifyContent="center" alignItems="center" direction="column">
          <StyledIcon type="apps" size="md" color="primary" />
          <Slider onCancel={onCancel} onComplete={handleComplete}>
            {!isConsentAccepted && (
              <SliderItem>
                <LegalDisclaimer />
              </SliderItem>
            )}

            {isFirstTimeAccessingApp && (
              <SliderItem>
                <SecuritySteps />
              </SliderItem>
            )}

            {!isSafeAppInDefaultList && (
              <SliderItem>
                <WarningDefaultList />
              </SliderItem>
            )}
          </Slider>
        </Grid>
      </StyledWrapper>
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledWrapper = styled.div`
  width: 450px;
  padding: 50px 24px 24px 24px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  box-shadow: 1px 2px 10px 0 ${({ theme }) => alpha(theme.colors.shadow.color, 0.18)};

  '&:focus': {
    outline: 'none';
  }
`

const StyledIcon = styled(Icon)`
  svg {
    width: 46px;
    height: 46px;
  }
`

export default memo(SafeAppsDisclaimer)
