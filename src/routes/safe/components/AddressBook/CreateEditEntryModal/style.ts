import { createStyles, makeStyles } from '@material-ui/core/styles'

import { lg, md } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    heading: {
      padding: lg,
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      height: '74px',
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
  }),
)
