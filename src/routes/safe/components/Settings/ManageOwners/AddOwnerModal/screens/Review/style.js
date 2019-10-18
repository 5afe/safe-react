// @flow
import {
  lg, sm, border, background, secondaryText,
} from '~/theme/variables'

export const styles = () => ({
  root: {
    height: '372px',
  },
  heading: {
    padding: `${sm} ${lg}`,
    justifyContent: 'flex-start',
    boxSizing: 'border-box',
    maxHeight: '75px',
  },
  annotation: {
    color: secondaryText,
    marginRight: 'auto',
    marginLeft: '20px',
    lineHeight: 'normal',
  },
  manage: {
    fontSize: '24px',
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
  address: {
    marginRight: sm,
  },
  owner: {
    padding: sm,
    alignItems: 'center',
  },
  name: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  userName: {
    whiteSpace: 'nowrap',
  },
  selectedOwner: {
    padding: sm,
    alignItems: 'center',
    backgroundColor: '#fff3e2',
  },
  user: {
    justifyContent: 'left',
  },
  open: {
    paddingLeft: sm,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  gasCostsContainer: {
    padding: `0 ${lg}`,
    textAlign: 'center',
    width: '100%',
  },
})
