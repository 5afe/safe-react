import { memo, useState } from 'react'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import { Text, Icon } from '@gnosis.pm/safe-react-components'
import Slider from './Slider'
import LegalDisclaimer from './LegalDisclaimer'
import { alpha } from '@material-ui/core/styles'
import SecurityStepList from './SecurityStepList'
import WarningDefaultList from './WarningDefaultList'
import { SECURITY_STEPS } from './utils'
import SecurityStepContent from './SecurityStepContent'
import { SecurityStep } from '../../types'

interface SafeAppsDisclaimerProps {
  onCancel: () => void
  onConfirm: (hideWarning: boolean) => void
  appUrl: string
  isConsentAccepted?: boolean
  isSafeAppInDefaultList: boolean
  isFirstTimeAccessingApp: boolean
  isExtendedListReviewed: boolean
}

const SafeAppsDisclaimer = ({
  onCancel,
  onConfirm,
  appUrl,
  isConsentAccepted,
  isSafeAppInDefaultList,
  isFirstTimeAccessingApp,
  isExtendedListReviewed,
}: SafeAppsDisclaimerProps): JSX.Element => {
  const [hideWarning, setHideWarning] = useState(false)

  const handleComplete = () => {
    onConfirm(hideWarning)
  }

  return (
    <StyledContainer>
      <StyledWrapper>
        <Grid container justifyContent="center" alignItems="center" direction="column">
          <StyledIcon type="apps" size="md" color="primary" />
          <Slider onCancel={onCancel} onComplete={handleComplete}>
            {!isConsentAccepted && <LegalDisclaimer />}
            {isFirstTimeAccessingApp && isExtendedListReviewed && (
              <SecurityStepList steps={SECURITY_STEPS} appUrl={appUrl} />
            )}
            {isFirstTimeAccessingApp &&
              !isExtendedListReviewed &&
              SECURITY_STEPS.map((step: SecurityStep) => {
                return step.imageSrc ? (
                  <SecurityStepContent key={step.id} {...step} />
                ) : (
                  <SecurityStepContent key={step.id} title={step.title}>
                    <StyledStepContentText size="xl">{appUrl}</StyledStepContentText>
                  </SecurityStepContent>
                )
              })}
            {!isSafeAppInDefaultList && isFirstTimeAccessingApp && (
              <WarningDefaultList onHideWarning={setHideWarning} />
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
`

const StyledIcon = styled(Icon)`
  svg {
    width: 46px;
    height: 46px;
  }
`

const StyledStepContentText = styled(Text)`
  font-weight: bold;
  overflow-wrap: anywhere;
`

export default memo(SafeAppsDisclaimer)
