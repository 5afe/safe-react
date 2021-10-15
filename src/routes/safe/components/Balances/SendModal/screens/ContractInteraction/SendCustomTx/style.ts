import { createStyles, makeStyles } from '@material-ui/core'

import { lg, md } from 'src/theme/variables'

export const useStyles = makeStyles(({ palette }) =>
  createStyles({
    heading: {
      padding: `${md} ${lg}`,
      justifyContent: 'flex-start',
      boxSizing: 'border-box',
      maxHeight: '74px',
    },
    annotation: {
      letterSpacing: '-1px',
      color: palette.tertiary[palette.type], // Before dark mode: #a2a8ba
      marginRight: 'auto',
      marginLeft: '20px',
    },
    manage: {
      fontSize: lg,
    },
    closeIcon: {
      height: '35px',
      width: '35px',
    },
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
    dataInput: {
      '& TextField-root-294': {
        lineHeight: 'auto',
        border: 'green',
      },
    },
    selectAddress: {
      cursor: 'pointer',
    },
  }),
)
