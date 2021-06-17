import { createStyles, makeStyles } from '@material-ui/core/styles'

import { lg, md, sm } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    heading: {
      boxSizing: 'border-box',
      justifyContent: 'space-between',
      minHeight: '74px',
      padding: `${sm} ${lg}`,
    },
    container: {
      minHeight: '369px',
      padding: `${sm}`,
    },
    manage: {
      fontSize: lg,
    },
    close: {
      height: '35px',
      width: '35px',
    },
    owner: {
      padding: md,
      alignItems: 'center',
    },
    description: {
      padding: md,
    },
  }),
)
