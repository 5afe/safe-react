import { createStyles, makeStyles } from '@material-ui/core'
import { lg, md, sm } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    container: {
      padding: `${md} ${lg}`,
    },
    nonceNumber: {
      marginTop: sm,
      fontSize: md,
    },
  }),
)
