import { makeStyles, createStyles } from '@material-ui/core'

import { lg, md, sm } from 'src/theme/variables'

export const useStyles = makeStyles(({ palette }) =>
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
      backgroundColor: palette.backgroundColor[palette.type],
      padding: `${sm} ${lg}`,
    },
  }),
)
