import { createStyles, makeStyles } from '@material-ui/core/styles'
import { lg, md, sm } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    heading: {
      padding: `${md} ${lg}`,
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      maxHeight: '75px',
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
    },
    closeIcon: {
      height: '35px',
      width: '35px',
    },
    buttonColumn: {
      padding: '52px 0',
      '& > button': {
        fontSize: md,
        fontFamily: 'Averta',
      },
    },
    firstButton: {
      boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
      marginBottom: 15,
    },
    iconSmall: {
      fontSize: 16,
    },
    leftIcon: {
      marginRight: sm,
    },
  }),
)
