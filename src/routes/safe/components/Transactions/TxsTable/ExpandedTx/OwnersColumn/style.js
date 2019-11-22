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
    borderLeft: 'solid 1px #d4d53d',
  },
  icon: {
    marginRight: sm,
  },
  owner: {
    borderBottom: `1px solid ${border}`,
  },
  executeOlderFirst: {
    width: '100%',
  },
})
