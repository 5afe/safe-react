import { createStyles, makeStyles } from '@material-ui/core/styles'
import { md } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    disclaimer: {
      marginBottom: `-${md}`,
      paddingTop: md,
      textAlign: 'center',
    },
    disclaimerText: {
      fontSize: md,
      marginBottom: `${md}`,
    },
    buttonColumn: {
      margin: '52px 0 44px 0',
      alignItems: 'center',
    },
    firstButton: {
      marginBottom: 12,
    },
    lastButton: {
      padding: '0 24px !important',
    },
  }),
)
