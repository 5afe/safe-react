import { Icon } from '@gnosis.pm/safe-react-components'
import { Button, withStyles } from '@material-ui/core'
import useCachedState from 'src/utils/storage/useCachedState'
import styled from 'styled-components'
import { Tooltip } from '../layout/Tooltip'

/**
 * The OnboardingTooltip renders a sticky Tooltip with an arrow pointing towards the wrapped component.
 * This Tooltip contains a button to hide it. This decision will be stored in the local storage such that the OnboardingTooltip will only popup until clicked away once.
 *
 * As this renders a MUI Tooltip it comes with the same restrictions (https://v4.mui.com/components/tooltips/).
 */
export const OnboardingTooltip = ({
  children,
  widgetLocalStorageId,
  defaultHidden,
  text,
}: {
  children: React.ReactElement
  widgetLocalStorageId: string
  defaultHidden?: boolean
  text: string
}): React.ReactElement => {
  const [widgetHidden, setWidgetHidden] = useCachedState<boolean>(widgetLocalStorageId)

  return widgetHidden || defaultHidden ? (
    children
  ) : (
    <StyledTooltip
      open
      interactive
      TransitionProps={{
        appear: false,
      }}
      arrow
      title={
        <StyledOnboardingContent>
          <Icon size="md" type="info" color="primary" />
          <span>{text}</span>
          <Button color="secondary" variant="text" onClick={() => setWidgetHidden(true)}>
            Got it!
          </Button>
        </StyledOnboardingContent>
      }
    >
      {children}
    </StyledTooltip>
  )
}

const StyledTooltip = withStyles(() => ({
  tooltip: {
    maxWidth: '500px',
  },
}))(Tooltip)

const StyledOnboardingContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
