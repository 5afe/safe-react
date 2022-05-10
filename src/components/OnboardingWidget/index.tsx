import { Icon } from '@gnosis.pm/safe-react-components'
import { withStyles, Theme, Tooltip, Button } from '@material-ui/core'
import useCachedState from 'src/utils/storage/useCachedState'
import styled from 'styled-components'

export const OnboardingWidget = ({
  children,
  widgetLocalStorageId,
  text,
}: {
  children: React.ReactElement
  widgetLocalStorageId: string
  text: string
}): React.ReactElement => {
  const [widgetHidden, setWidgetHidden] = useCachedState<boolean>(widgetLocalStorageId)

  return widgetHidden ? (
    children
  ) : (
    <OnboardingTooltip
      open
      interactive
      TransitionProps={{
        appear: false,
      }}
      arrow
      title={
        <StyledOnboardingContent>
          <StyledIcon size="md" type="info" color="primary" />
          <span>{text}</span>
          <StyledOnboardingConfirmButton color="primary" variant="contained" onClick={() => setWidgetHidden(true)}>
            Got it
          </StyledOnboardingConfirmButton>
        </StyledOnboardingContent>
      }
    >
      {children}
    </OnboardingTooltip>
  )
}
const OnboardingTooltip = withStyles(({ palette }: Theme) => ({
  arrow: {
    '&::before': {
      backgroundColor: palette.common.white,
      bottom: '5px',
      zIndex: 1500,
    },
  },
  tooltip: {
    color: palette.common.black,
    backgroundColor: palette.common.white,
    borderRadius: '8px',
    boxShadow: '1px 2px 10px rgba(40, 54, 61, 0.18)',
    fontSize: '14px',
    padding: '16px',
    maxWidth: '500px',
    zIndex: -1,
  },
}))(Tooltip)

const StyledIcon = styled(Icon)`
  float: inline-start;
  align-self: flex-start;
`

const StyledOnboardingContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const StyledOnboardingConfirmButton = styled(Button)`
  align-self: flex-end;
`
