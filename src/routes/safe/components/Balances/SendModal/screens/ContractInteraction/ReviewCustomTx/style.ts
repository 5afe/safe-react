import { makeStyles, createStyles } from '@material-ui/core'

import { border, lg, md, sm } from 'src/theme/variables'

export const useStyles = makeStyles(({ palette }) =>
  createStyles({
    container: {
      padding: `${md} ${lg}`,
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
    gasCostsContainer: {
      backgroundColor: palette.backgroundColor[palette.type],
      padding: `${sm} ${lg}`,
    },
  }),
)
