import { createStyles, makeStyles } from '@material-ui/core'

import { lg, md } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    formContainer: {
      padding: `${md} ${lg}`,
      minHeight: '340px',
    },
    buttonRow: {
      height: '84px',
      justifyContent: 'center',
      gap: '16px',
    },
  }),
)
