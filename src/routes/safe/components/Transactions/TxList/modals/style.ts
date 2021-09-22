import { createStyles, makeStyles } from '@material-ui/core'
import { background, lg, md, sm } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    container: {
      padding: `${md} ${lg}`,
    },
    nonceNumber: {
      marginTop: sm,
      fontSize: md,
    },
    gasCostsContainer: {
      backgroundColor: background,
      padding: `0 ${lg}`,
    },
  }),
)
