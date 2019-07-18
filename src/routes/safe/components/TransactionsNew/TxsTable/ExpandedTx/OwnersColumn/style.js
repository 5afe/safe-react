// @flow
import { border, sm } from '~/theme/variables'

export const styles = () => ({
  ownersList: {
    width: '100%',
    padding: 0,
    height: '192px',
    overflowY: 'scroll',
  },
  rightCol: {
    boxSizing: 'border-box',
    borderLeft: 'solid 1px #c8ced4',
  },
  icon: {
    marginRight: sm,
  },
  owner: {
    borderBottom: `1px solid ${border}`,
  },
})
