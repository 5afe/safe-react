import { createStyles, makeStyles } from '@material-ui/core/styles'

import { lg, md, secondaryText, sm } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    heading: {
      padding: `${sm} ${lg}`,
      justifyContent: 'flex-start',
      boxSizing: 'border-box',
      height: '74px',
    },
    manage: {
      fontSize: lg,
    },
    annotation: {
      lineHeight: 'normal',
      color: secondaryText,
      marginRight: 'auto',
      marginLeft: '20px',
    },
    closeIcon: {
      height: '35px',
      width: '35px',
    },
    headingText: {
      fontSize: md,
    },
    formContainer: {
      padding: `${md} ${lg}`,
      minHeight: '340px',
    },
    ownersText: {
      marginLeft: sm,
    },
    inputRow: {
      position: 'relative',
    },
    errorText: {
      position: 'absolute',
      bottom: '-25px',
    },
  }),
)
