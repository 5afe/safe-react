import { background, border, lg, sm } from 'src/theme/variables'
import { createStyles } from '@material-ui/core/styles'

export const styles = createStyles({
  root: {
    height: '372px',
  },
  info: {
    backgroundColor: background,
    padding: sm,
    justifyContent: 'center',
    textAlign: 'center',
    flexDirection: 'column',
  },
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
    gap: '16px',
  },
  details: {
    padding: lg,
    borderRight: `solid 2px ${border}`,
    height: '100%',
  },
  owners: {
    overflow: 'auto',
    height: '100%',
  },
  ownersTitle: {
    padding: lg,
  },
  owner: {
    padding: sm,
    alignItems: 'center',
  },
  name: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  selectedOwner: {
    padding: sm,
    alignItems: 'center',
    backgroundColor: '#f7f5f5',
  },
  open: {
    paddingLeft: sm,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
})
