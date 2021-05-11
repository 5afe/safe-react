import { createStyles, makeStyles } from '@material-ui/core'
import { background, lg, md, sm } from 'src/theme/variables'

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
    closeIcon: {
      height: '35px',
      width: '35px',
    },
    container: {
      padding: `${md} ${lg}`,
    },
    nonceNumber: {
      marginTop: sm,
      fontSize: md,
    },
    gasCostsContainer: {
      backgroundColor: background,
      padding: `0 ${lg}`,
    },
  }),
)
