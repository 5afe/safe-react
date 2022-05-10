import { lg, md, sm } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
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
})

export const selectedTokenStyles = createStyles({
  container: {
    background: 'none !important',
    padding: '0',
    width: '100%',
  },
  tokenData: {
    padding: 0,
    margin: 0,
    lineHeight: '14px',
  },
  tokenImage: {
    display: 'block',
    marginRight: sm,
    height: 28,
    width: 'auto',
  },
})

export const selectStyles = createStyles({
  selectMenu: {
    paddingRight: 0,
  },
  tokenImage: {
    marginRight: sm,
  },
})
