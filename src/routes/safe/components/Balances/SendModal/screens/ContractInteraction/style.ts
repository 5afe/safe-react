import { makeStyles, createStyles } from '@material-ui/core'

import { lg, md, sm, border } from 'src/theme/variables'

export const useStyles = makeStyles(({ palette }) =>
  createStyles({
    qrCodeBtn: {
      cursor: 'pointer',
    },
    formContainer: {
      padding: `${md} ${lg}`,
      wordBreak: 'break-word',
    },
    value: {
      marginLeft: sm,
    },
    outerData: {
      borderRadius: '5px',
      border: `1px solid ${border}`,
      padding: '11px',
      minHeight: '21px',
    },
    data: {
      wordBreak: 'break-all',
      overflow: 'auto',
      fontSize: '14px',
      fontFamily: 'Averta',
      maxHeight: '100px',
      letterSpacing: 'normal',
      fontStretch: 'normal',
      lineHeight: '1.43',
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
    fullWidth: {
      justifyContent: 'space-between',
    },
    gasCostsContainer: {
      backgroundColor: palette.backgroundColor[palette.type],
      padding: `0 ${lg}`,
    },
  }),
)
