import { background, lg, md, sm } from 'src/theme/variables'
import { createStyles, makeStyles } from '@material-ui/core'

export const useStyles = makeStyles(
  createStyles({
    heading: {
      padding: `${sm} ${lg}`,
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      height: '74px',
    },
    headingText: {
      fontSize: lg,
    },
    close: {
      height: '35px',
      width: '35px',
    },
    modalContent: {
      padding: `${md} ${lg}`,
    },
    gasCostsContainer: {
      backgroundColor: background,
      padding: `0 ${lg}`,
    },
  }),
)
