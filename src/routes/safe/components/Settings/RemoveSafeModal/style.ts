import { createStyles } from '@material-ui/core/styles'
import { lg, md, sm } from 'src/theme/variables'

export const styles = createStyles({
  heading: {
    boxSizing: 'border-box',
    justifyContent: 'space-between',
    minHeight: '74px',
    padding: `${sm} ${lg}`,
  },
  container: {
    minHeight: '369px',
    padding: `${sm}`,
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
    marginLeft: '16px',
  },
  name: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  userName: {
    whiteSpace: 'nowrap',
  },
  owner: {
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
})
