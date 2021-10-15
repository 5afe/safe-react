import { makeStyles, createStyles } from '@material-ui/core'

import { lg, md, sm } from 'src/theme/variables'

export const useStyles = makeStyles(({ palette }) =>
  createStyles({
    container: {
      padding: `${md} ${lg}`,
    },
    amount: {
      marginLeft: sm,
    },
    buttonRow: {
      height: '84px',
      justifyContent: 'center',
      gap: '16px',
    },
    gasCostsContainer: {
      backgroundColor: palette.backgroundColor[palette.type],
      padding: `0 ${lg}`,
    },
  }),
)
