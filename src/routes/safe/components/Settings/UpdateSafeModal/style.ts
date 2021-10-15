import { makeStyles, createStyles } from '@material-ui/core'

import { lg, md } from 'src/theme/variables'

export const useStyles = makeStyles(({ palette }) =>
  createStyles({
    modalContent: {
      padding: `${md} ${lg}`,
    },
    gasCostsContainer: {
      backgroundColor: palette.backgroundColor[palette.type],
      padding: `0 ${lg}`,
    },
  }),
)
