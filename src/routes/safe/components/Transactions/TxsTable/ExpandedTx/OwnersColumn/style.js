// @flow
import { border, sm, boldFont } from '~/theme/variables'

export const styles = () => ({
  ownersList: {
    width: '100%',
    padding: 0,
    height: '192px',
    overflowY: 'scroll',
  },
  rightCol: {
    boxSizing: 'border-box',
    borderLeft: `2px solid ${border}`,
  },
  icon: {
    marginRight: sm,
  },
  owner: {
    borderBottom: `1px solid ${border}`,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: '5px',
    paddingLeft: '20px',

  },
  ownerListTitle: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    paddingLeft: '20px',
    fontSize: '11px',
    fontWeight: boldFont,
    lineHeight: 1.27,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  name: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    height: '20px',
  },
  address: {
    height: '20px',
  },
  iconState: {
    width: '20px',
    display: 'flex',
    justifyContent: 'center',
    marginRight: '10px',
    '& > img': {
      display: 'block',
    },
  },
  button: {
    textAlign: 'center',
    justifyContent: 'center',
  }
})
