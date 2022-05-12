import { withStyles, Theme, Tooltip as MuiTooltip } from '@material-ui/core'

// Tooltip doesn't accept a className, preventing use of `styled-components`
export const Tooltip = withStyles(({ palette }: Theme) => ({
  arrow: {
    '&::before': {
      backgroundColor: palette.common.white,
      boxShadow: '1px 2px 10px rgba(40, 54, 61, 0.18)',
    },
  },
  tooltip: {
    color: palette.common.black,
    backgroundColor: palette.common.white,
    borderRadius: '8px',
    boxShadow: '1px 2px 10px rgba(40, 54, 61, 0.18)',
    fontSize: '14px',
    padding: '16px',
    lineHeight: 'normal',
  },
}))(MuiTooltip)
