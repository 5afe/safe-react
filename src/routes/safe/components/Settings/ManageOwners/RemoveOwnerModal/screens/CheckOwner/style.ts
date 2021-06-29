import { createStyles, makeStyles } from '@material-ui/core'

import { lg, md, secondaryText, sm } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    heading: {
      padding: `${sm} ${lg}`,
      justifyContent: 'flex-start',
      boxSizing: 'border-box',
      height: '74px',
    },
    annotation: {
      lineHeight: 'normal',
      color: secondaryText,
      marginRight: 'auto',
      marginLeft: '20px',
    },
    manage: {
      fontSize: lg,
    },
    closeIcon: {
      height: '35px',
      width: '35px',
    },
    formContainer: {
      padding: `${md} ${lg}`,
      minHeight: '340px',
    },
  }),
)
