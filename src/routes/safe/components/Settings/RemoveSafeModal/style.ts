import { createStyles } from '@material-ui/core/styles'
import { error, lg, md, sm } from 'src/theme/variables'

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
    color: '#fff',
    backgroundColor: error,
    height: '42px',
  },
  owner: {
    padding: md,
    alignItems: 'center',
  },
  description: {
    padding: md,
  },
})
