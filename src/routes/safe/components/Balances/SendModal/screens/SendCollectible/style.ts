import { lg, md } from 'src/theme/variables'
import { createStyles, makeStyles } from '@material-ui/core'

export const useStyles = makeStyles(
  createStyles({
    qrCodeBtn: {
      cursor: 'pointer',
    },
    formContainer: {
      padding: `${md} ${lg}`,
    },
    buttonRow: {
      height: '84px',
      justifyContent: 'center',
      gap: '16px',
    },
  }),
)
