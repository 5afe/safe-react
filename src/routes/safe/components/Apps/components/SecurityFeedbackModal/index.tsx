import { memo, useMemo, useState } from 'react'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import { alpha } from '@material-ui/core/styles'
import Slider from './Slider'
import LegalDisclaimer from './LegalDisclaimer'
import SecurityFeedbackList from './SecurityFeedbackList'
import UnknownAppWarning from './UnknownAppWarning'
import { SECURITY_PRACTICES } from './constants'
import SecurityFeedbackContent from './SecurityFeedbackContent'
import {
  AllowedFeatures,
  AllowedFeatureSelection,
  PermissionStatus,
  SecurityFeedbackPractice,
} from 'src/routes/safe/components/Apps/types'
import SecurityFeedbackDomain from './SecurityFeedbackDomain'
import SecurityFeedbackAllowedFeatures from './SecurityFeedbackAllowedFeatures'
import { BrowserPermission } from '../../hooks/permissions/useBrowserPermissions'

interface SecurityFeedbackModalProps {
  onCancel: () => void
  onConfirm: (hideWarning: boolean, browserPermisisons: BrowserPermission[]) => void
  appUrl: string
  features: AllowedFeatures[]
  isConsentAccepted?: boolean
  isSafeAppInDefaultList: boolean
  isFirstTimeAccessingApp: boolean
  isExtendedListReviewed: boolean
  isPermissionsReviewCompleted: boolean
}

const SecurityFeedbackModal = ({
  onCancel,
  onConfirm,
  appUrl,
  features,
  isConsentAccepted,
  isSafeAppInDefaultList,
  isFirstTimeAccessingApp,
  isExtendedListReviewed,
  isPermissionsReviewCompleted,
}: SecurityFeedbackModalProps): JSX.Element => {
  const [hideWarning, setHideWarning] = useState(false)
  const [selectedFeatures, setSelectedFeatures] = useState<AllowedFeatureSelection[]>(
    features.map((feature) => {
      return {
        feature,
        checked: true,
      }
    }),
  )
  const [currentSlide, setCurrentSlide] = useState(0)

  const totalSlides = useMemo(() => {
    let totalSlides = 0

    if (!isConsentAccepted) {
      totalSlides += 1
    }

    if (isFirstTimeAccessingApp && isExtendedListReviewed) {
      totalSlides += 1
    }

    if (isFirstTimeAccessingApp && !isExtendedListReviewed) {
      totalSlides += SECURITY_PRACTICES.length
    }

    if (!isSafeAppInDefaultList && isFirstTimeAccessingApp) {
      totalSlides += 1
    }

    if (!isPermissionsReviewCompleted) {
      totalSlides += 1
    }

    return totalSlides
  }, [
    isConsentAccepted,
    isExtendedListReviewed,
    isFirstTimeAccessingApp,
    isSafeAppInDefaultList,
    isPermissionsReviewCompleted,
  ])

  const handleSlideChange = (newStep: number) => {
    const isFirstStep = newStep === -1
    const isLastStep = newStep === totalSlides

    if (isFirstStep) {
      onCancel()
    }

    if (isLastStep) {
      onConfirm(
        hideWarning,
        selectedFeatures.map(({ feature, checked }) => {
          return {
            feature,
            status: checked ? PermissionStatus.GRANTED : PermissionStatus.DENIED,
          }
        }),
      )
    }

    setCurrentSlide(newStep)
  }

  const progressValue = useMemo(() => {
    return ((currentSlide + 1) * 100) / totalSlides
  }, [currentSlide, totalSlides])

  const isLastSlide = useMemo(() => {
    return currentSlide === totalSlides - 1
  }, [currentSlide, totalSlides])

  const shouldShowUnknownAppWarning = useMemo(
    () => !isSafeAppInDefaultList && isFirstTimeAccessingApp,
    [isFirstTimeAccessingApp, isSafeAppInDefaultList],
  )

  const handleFeatureSelectionChange = (feature: AllowedFeatures, checked: boolean) => {
    setSelectedFeatures(
      selectedFeatures.map((feat) => {
        if (feat.feature === feature) {
          return {
            feature,
            checked,
          }
        }
        return feat
      }),
    )
  }

  return (
    <StyledContainer>
      <StyledWrapper>
        <StyledLinearProgress
          variant="determinate"
          value={progressValue}
          $isWarningStep={isLastSlide && shouldShowUnknownAppWarning}
        />
        <StyledGrid container justifyContent="center" alignItems="center" direction="column">
          <Slider onSlideChange={handleSlideChange}>
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
                  <SecurityFeedbackContent key={practice.id} {...practice}>
                    <SecurityFeedbackDomain url={appUrl} />
                  </SecurityFeedbackContent>
                )
              })}
            {!isPermissionsReviewCompleted && (
              <SecurityFeedbackAllowedFeatures
                features={selectedFeatures}
                onFeatureSelectionChange={handleFeatureSelectionChange}
              />
            )}
            {shouldShowUnknownAppWarning && <UnknownAppWarning url={appUrl} onHideWarning={setHideWarning} />}
          </Slider>
        </StyledGrid>
      </StyledWrapper>
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const StyledWrapper = styled.div`
  width: 450px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  box-shadow: 1px 2px 10px 0 ${({ theme }) => alpha(theme.colors.shadow.color, 0.18)};
`

const StyledGrid = styled(Grid)`
  text-align: center;
  padding: 24px;
`

const StyledLinearProgress = styled(LinearProgress)<{ $isWarningStep: boolean }>`
  height: 6px;
  background-color: #fff;
  border-radius: 8px 8px 0 0;
  .MuiLinearProgress-bar {
    background-color: ${({ theme, $isWarningStep }) => ($isWarningStep ? '#e8663d' : theme.colors.primary)};
    border-radius: 8px;
  }
`

export default memo(SecurityFeedbackModal)
