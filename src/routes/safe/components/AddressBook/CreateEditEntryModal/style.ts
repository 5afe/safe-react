import { createStyles, makeStyles } from '@material-ui/core/styles'

import { lg, md } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    heading: {
      padding: lg,
      justifyContent: 'space-between',
      boxSizing: 'border-box',
    },
    manage: {
      fontSize: lg,
    },
    container: {
      padding: `${md} ${lg}`,
    },
    close: {
      height: '35px',
      width: '35px',
    },
    buttonRow: {
      height: '84px',
      justifyContent: 'center',
    },
    smallerModalWindow: {
      height: 'auto',
    },
  }),
)
