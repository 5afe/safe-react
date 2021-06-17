import { createStyles, makeStyles } from '@material-ui/core/styles'
import { background, border, lg, screenSm, sm } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    root: {
      minHeight: '300px',
      [`@media (min-width: ${screenSm}px)`]: {
        flexDirection: 'row',
      },
    },
    detailsColumn: {
      minWidth: '100%',
      [`@media (min-width: ${screenSm}px)`]: {
        minWidth: '0',
      },
    },
    ownersColumn: {
      minWidth: '100%',
      [`@media (min-width: ${screenSm}px)`]: {
        minWidth: '0',
      },
    },
    details: {
      padding: lg,
      borderRight: `solid 1px ${border}`,
      height: '100%',
    },
    info: {
      backgroundColor: background,
      flexDirection: 'column',
      justifyContent: 'center',
      padding: lg,
      textAlign: 'center',
    },
    owners: {
      padding: lg,
    },
    name: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
    owner: {
      alignItems: 'center',
      minWidth: 'fit-content',
      padding: sm,
      paddingLeft: lg,
    },
    user: {
      justifyContent: 'left',
      '& > p': {
        marginRight: sm,
      },
    },
    open: {
      paddingLeft: sm,
      width: 'auto',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  }),
)
