// @flow
import { lg, md, sm } from '~/theme/variables'

export const styles = () => ({
  heading: {
    padding: `${sm} ${lg}`,
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    maxHeight: '75px',
  },
  annotation: {
    letterSpacing: '-1px',
    color: '#a2a8ba',
    marginRight: 'auto',
    marginLeft: '20px',
  },
  headingText: {
    fontSize: '20px',
  },
  close: {
    height: '35px',
    width: '35px',
  },
  modalContent: {
    padding: `${md} ${lg}`,
  },
  ownersText: {
    marginLeft: sm,
  },
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
})
