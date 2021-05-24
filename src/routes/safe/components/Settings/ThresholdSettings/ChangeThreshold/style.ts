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
      fontSize: '20px',
    },
    close: {
      height: '35px',
      width: '35px',
    },
    modalContent: {
      padding: `${md} ${lg}`,
    },
    ownersText: {
      marginLeft: sm,
    },
    inputRow: {
      position: 'relative',
    },
    gasCostsContainer: {
      backgroundColor: background,
      padding: `${sm} ${lg}`,
    },
  }),
)
