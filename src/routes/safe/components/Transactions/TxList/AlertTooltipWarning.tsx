import { ReactElement } from 'react'
import { TooltipProps } from '@material-ui/core'
import Alert, { AlertProps } from '@material-ui/lab/Alert'
import { withStyles } from '@material-ui/styles'
import styled from 'styled-components'

import { orange500, black500, orange200, green500, green200 } from 'src/theme/variables'
import { Tooltip } from 'src/components/layout/Tooltip'

const StyledTooltip = withStyles(() => ({
  arrow: {
    // Align arrow with Alert icon
    left: '10px !important',
  },
}))(Tooltip)

const StyledAlert = styled(Alert)<{ $isWarning: boolean }>`
  font-weight: 700;
  color: ${black500};
  background-color: ${({ $isWarning }) => ($isWarning ? orange200 : green200)};
  display: inline-flex;
  padding: 0px 10px;
  height: 36px;
  margin-bottom: 10px;
  align-self: start;
  border-left: 3px solid ${({ $isWarning }) => ($isWarning ? orange500 : green500)};
  &.MuiAlert-standardInfo .MuiAlert-icon {
    margin-right: 8px;
    color: ${({ $isWarning }) => ($isWarning ? orange500 : green500)};
  }
`

type Props = {
  tooltip: TooltipProps['title']
  message: AlertProps['children']
  isWarning?: boolean
}

const AlertTooltipWarning = ({ tooltip, message, isWarning = false }: Props): ReactElement => (
  <StyledTooltip title={tooltip} arrow placement="top-start" interactive>
    <StyledAlert severity="info" $isWarning={isWarning}>
      {message}
    </StyledAlert>
  </StyledTooltip>
)

export default AlertTooltipWarning
