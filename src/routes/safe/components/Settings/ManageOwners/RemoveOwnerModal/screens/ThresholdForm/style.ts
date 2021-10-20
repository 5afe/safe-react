import { createStyles, makeStyles } from '@material-ui/core/styles'

import { lg, md, sm } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
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
