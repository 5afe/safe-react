import { createStyles } from '@material-ui/core/styles'
import { background, error, lg, md, sm } from 'src/theme/variables'

export const styles = createStyles({
  heading: {
    boxSizing: 'border-box',
    justifyContent: 'space-between',
    maxHeight: '75px',
    padding: `${sm} ${lg}`,
  },
  container: {
    minHeight: '369px',
  },
  manage: {
    fontSize: lg,
  },
  close: {
    height: '35px',
    width: '35px',
  },
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
  },
  buttonRemove: {
    color: '#fff',
    backgroundColor: error,
    height: '42px',
  },
  name: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  userName: {
    whiteSpace: 'nowrap',
  },
  owner: {
    backgroundColor: background,
    padding: md,
    alignItems: 'center',
  },
  user: {
    justifyContent: 'left',
  },
  description: {
    padding: md,
  },
  open: {
    paddingLeft: sm,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  modal: {
    height: 'auto',
    maxWidth: 'calc(100% - 30px)',
    overflow: 'hidden',
  },
})
