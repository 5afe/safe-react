import { createStyles, makeStyles } from '@material-ui/core'

import { lg, md, sm } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    modalContent: {
      padding: `${md} ${lg}`,
    },
    ownersText: {
      marginLeft: sm,
    },
    inputRow: {
      position: 'relative',
    },
  }),
)
