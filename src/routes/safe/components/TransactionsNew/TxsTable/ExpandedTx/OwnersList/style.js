// @flow
import { border, sm } from '~/theme/variables'

export const styles = () => ({
  ownersList: {
    width: '100%',
    padding: 0,
    maxHeight: '192px',
    overflowY: 'scroll',
  },
  icon: {
    marginRight: sm,
  },
  owner: {
    borderBottom: `1px solid ${border}`,
  },
})
