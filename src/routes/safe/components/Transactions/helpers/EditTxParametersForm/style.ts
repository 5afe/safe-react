import { createStyles, makeStyles } from '@material-ui/core'

import { lg, md, secondaryText, sm } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    heading: {
      padding: `${md} ${lg}`,
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      height: '74px',
    },
    annotation: {
      letterSpacing: '-1px',
      color: secondaryText,
      marginRight: 'auto',
      marginLeft: '20px',
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
    amount: {
      marginLeft: sm,
    },
    address: {
      marginRight: sm,
    },
    buttonRow: {
      height: '52px',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '16px',
    },
  }),
)
