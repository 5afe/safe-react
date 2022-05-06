import { ReactElement } from 'react'
import { Theme, Tooltip, TooltipProps } from '@material-ui/core'
import Alert, { AlertProps } from '@material-ui/lab/Alert'
import { withStyles } from '@material-ui/styles'
import styled from 'styled-components'

import { orange500, black500, orange200, green500, green200 } from 'src/theme/variables'

// Tooltip doesn't accept a className, preventing use of `styled-components`
const StyledTooltip = withStyles(({ palette }: Theme) => ({
  arrow: {
    '&::before': {
      backgroundColor: palette.common.white,
      boxShadow: '1px 2px 10px rgba(40, 54, 61, 0.18)',
    },
    // Align arrow with Alert icon
    left: '10px !important',
  },
  tooltip: {
    color: palette.common.black,
    backgroundColor: palette.common.white,
    borderRadius: '8px',
    boxShadow: '1px 2px 10px rgba(40, 54, 61, 0.18)',
    fontSize: '14px',
    padding: '16px',
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
  <StyledTooltip title={tooltip} arrow placement="top-start">
    <StyledAlert severity="info" $isWarning={isWarning}>
      {message}
    </StyledAlert>
  </StyledTooltip>
)

export default AlertTooltipWarning
