import { lg, md } from 'src/theme/variables'
import { createStyles, makeStyles } from '@material-ui/core'

export const useStyles = makeStyles(
  createStyles({
    modalContent: {
      padding: `${md} ${lg}`,
    },
  }),
)
