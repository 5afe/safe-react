import { createStyles, makeStyles } from '@material-ui/core'

import { background, lg, md, sm } from 'src/theme/variables'

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
    gasCostsContainer: {
      backgroundColor: background,
      padding: `${sm} ${lg}`,
    },
  }),
)
