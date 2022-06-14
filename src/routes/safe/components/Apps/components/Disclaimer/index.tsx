import { memo } from 'react'
import styled from 'styled-components'
import { Icon } from '@gnosis.pm/safe-react-components'
import Grid from '@material-ui/core/Grid'
import Slider from './Slider'
import LegalDisclaimer from './LegalDisclaimer'
import { alpha } from '@material-ui/core/styles'
import SecurityStepList from './SecurityStepList'
import WarningDefaultList from './WarningDefaultList'
import { SECURITY_STEPS } from './utils'
import SecurityStepContent from './SecurityStepContent'

interface OwnProps {
  onCancel: () => void
  onConfirm: () => void
  isConsentAccepted?: boolean
  isSafeAppInDefaultList: boolean
  isFirstTimeAccessingApp: boolean
  isExtendedListReviewed: boolean
}

const SafeAppsDisclaimer = ({
  onCancel,
  onConfirm,
  isConsentAccepted,
  isSafeAppInDefaultList,
  isFirstTimeAccessingApp,
  isExtendedListReviewed,
}: OwnProps): JSX.Element => {
  const handleComplete = () => {
    onConfirm()
  }

  return (
    <StyledContainer>
      <StyledWrapper>
        <Grid container justifyContent="center" alignItems="center" direction="column">
          <StyledIcon type="apps" size="md" color="primary" />
          <Slider onCancel={onCancel} onComplete={handleComplete}>
            {!isConsentAccepted && <LegalDisclaimer />}
            {isFirstTimeAccessingApp && isExtendedListReviewed && <SecurityStepList />}
            {isFirstTimeAccessingApp &&
              !isExtendedListReviewed &&
              SECURITY_STEPS.map((step, index) => (
                <SecurityStepContent key={index} title={step.title} image={step.image} />
              ))}
            {!isSafeAppInDefaultList && <WarningDefaultList />}
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
`

const StyledIcon = styled(Icon)`
  svg {
    width: 46px;
    height: 46px;
  }
`

export default memo(SafeAppsDisclaimer)
