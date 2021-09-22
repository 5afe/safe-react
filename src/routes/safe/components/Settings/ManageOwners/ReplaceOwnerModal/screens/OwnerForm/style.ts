import { lg, md, sm } from 'src/theme/variables'
import { createStyles, makeStyles } from '@material-ui/core'

export const useStyles = makeStyles(
  createStyles({
    formContainer: {
      padding: `${md} ${lg}`,
      minHeight: '340px',
    },
    owner: {
      alignItems: 'center',
    },
    address: {
      marginRight: sm,
    },
  }),
)
