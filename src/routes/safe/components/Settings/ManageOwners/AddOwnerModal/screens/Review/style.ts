import { background, border, lg, secondaryText, sm } from 'src/theme/variables'
import { createStyles } from '@material-ui/core/styles'

export const styles = createStyles({
  root: {
    height: '372px',
  },
  heading: {
    padding: `${sm} ${lg}`,
    justifyContent: 'flex-start',
    boxSizing: 'border-box',
    height: '74px',
  },
  annotation: {
    color: secondaryText,
    marginRight: 'auto',
    marginLeft: '20px',
    lineHeight: 'normal',
  },
  manage: {
    fontSize: lg,
  },
  closeIcon: {
    height: '35px',
    width: '35px',
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
  gasCostsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    backgroundColor: background,
  },
})
