import { createStyles, makeStyles } from '@material-ui/core'

import { lg, md } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    manage: {
      fontSize: lg,
    },
    qrCodeBtn: {
      cursor: 'pointer',
    },
    formContainer: {
      padding: `${md} ${lg}`,
      minHeight: '216px',
    },
    buttonRow: {
      height: '84px',
      justifyContent: 'center',
      gap: '16px',
    },
    selectAddress: {
      cursor: 'pointer',
    },
  }),
)
