import { createStyles, makeStyles } from '@material-ui/core/styles'
import { lg, md, sm } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    heading: {
      padding: `${md} ${lg}`,
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      height: '74px',
    },
    manage: {
      fontSize: lg,
    },
    disclaimer: {
      marginBottom: `-${md}`,
      paddingTop: md,
      textAlign: 'center',
    },
    disclaimerText: {
      fontSize: md,
      marginBottom: `${md}`,
    },
    closeIcon: {
      height: '35px',
      width: '35px',
    },
    buttonColumn: {
      margin: '52px 0 44px 0',
    },
    firstButton: {
      marginBottom: 12,
    },
    iconSmall: {
      fontSize: 16,
    },
    leftIcon: {
      marginRight: sm,
    },
  }),
)
