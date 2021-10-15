import { createStyles, makeStyles } from '@material-ui/core'

import { lg, md, secondaryText } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    heading: {
      padding: `${md} ${lg}`,
      justifyContent: 'flex-start',
      boxSizing: 'border-box',
      maxHeight: '74px',
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
    chainIndicator: {
      padding: `0 ${md}`,
      height: '20px',
      alignItems: 'center',
    },
    icon: {
      width: '20px',
      marginRight: '10px',
    },
  }),
)
