import { sm } from 'src/theme/variables'
import { createStyles, makeStyles } from '@material-ui/core'

export const useStyles = makeStyles(({ palette }) =>
  createStyles({
    iconSmall: {
      fontSize: 16,
    },
    tooltipInfo: {
      position: 'relative',
      top: '3px',
      left: '3px',
    },
    hide: {
      '&:hover': {
        backgroundColor: palette.backgroundColor[palette.type],
      },
      '&:hover $actions': {
        visibility: 'initial',
      },
      '&:focus $actions': {
        visibility: 'initial',
      },
    },
    actions: {
      justifyContent: 'flex-end',
      visibility: 'hidden',
    },
    leftIcon: {
      marginRight: sm,
    },
    currencyValueRow: {
      textAlign: 'right',
    },
  }),
)
