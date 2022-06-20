import { memo, useState } from 'react'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import { alpha } from '@material-ui/core/styles'
import { Text, Icon } from '@gnosis.pm/safe-react-components'
import Slider from './Slider'
import LegalDisclaimer from './LegalDisclaimer'
import SecurityFeedbackList from './SecurityFeedbackList'
import UnknownAppWarning from './UnknownAppWarning'
import { SECURITY_PRACTICES } from './constants'
import SecurityFeedbackContent from './SecurityFeedbackContent'
import { SecurityFeedbackPractice } from '../../types'

interface SecurityFeedbackModalProps {
  onCancel: () => void
  onConfirm: (hideWarning: boolean) => void
  appUrl: string
  isConsentAccepted?: boolean
  isSafeAppInDefaultList: boolean
  isFirstTimeAccessingApp: boolean
  isExtendedListReviewed: boolean
}

const SecurityFeedbackModal = ({
  onCancel,
  onConfirm,
  appUrl,
  isConsentAccepted,
  isSafeAppInDefaultList,
  isFirstTimeAccessingApp,
  isExtendedListReviewed,
}: SecurityFeedbackModalProps): JSX.Element => {
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
              <SecurityFeedbackList practices={SECURITY_PRACTICES} appUrl={appUrl} />
            )}
            {isFirstTimeAccessingApp &&
              !isExtendedListReviewed &&
              SECURITY_PRACTICES.map((practice: SecurityFeedbackPractice) => {
                return practice.imageSrc ? (
                  <SecurityFeedbackContent key={practice.id} {...practice} />
                ) : (
                  <SecurityFeedbackContent key={practice.id} title={practice.title}>
                    <StyledSecurityFeedbackContentText size="xl">{appUrl}</StyledSecurityFeedbackContentText>
                  </SecurityFeedbackContent>
                )
              })}
            {!isSafeAppInDefaultList && isFirstTimeAccessingApp && <UnknownAppWarning onHideWarning={setHideWarning} />}
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

const StyledSecurityFeedbackContentText = styled(Text)`
  font-weight: bold;
  overflow-wrap: anywhere;
`

export default memo(SecurityFeedbackModal)
