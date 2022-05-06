import { ReactElement } from 'react'
import { Tooltip, TooltipProps } from '@material-ui/core'
import Alert, { AlertProps } from '@material-ui/lab/Alert'
import { withStyles } from '@material-ui/styles'
import styled from 'styled-components'

import { orange500, black500 } from 'src/theme/variables'

// Tooltip doesn't accept a className, preventing use of `styled-components`
const StyledTooltip = withStyles({
  arrow: {
    '&::before': {
      backgroundColor: '#fff',
      boxShadow: '1px 2px 10px rgba(40, 54, 61, 0.18)',
    },
    // Align arrow with Alert icon
    left: '10px !important',
  },
  tooltip: {
    color: '#000',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '1px 2px 10px rgba(40, 54, 61, 0.18)',
    fontSize: '14px',
    padding: '16px',
  },
})(Tooltip)

const StyledAlert = styled(Alert)`
  &.MuiAlert-root {
    border-left: 3px solid ${orange500};
    display: inline-flex;
    padding: 0px 10px;
    height: 36px;
    margin-bottom: 10px;
    align-self: start;
  }
  &.MuiAlert-standardWarning .MuiAlert-icon {
    margin-right: 8px;
    color: ${orange500};
  }
  &.MuiAlert-standardWarning {
    font-weight: 700;
    color: ${black500};
  }
`

type Props = {
  tooltip: TooltipProps['title']
  warning: AlertProps['children']
}

const AlertTooltipWarning = ({ tooltip, warning }: Props): ReactElement => (
  <StyledTooltip title={tooltip} arrow placement="top-start">
    <StyledAlert severity="info" color="warning">
      {warning}
    </StyledAlert>
  </StyledTooltip>
)

export default AlertTooltipWarning
