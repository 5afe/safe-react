// @flow
import { withStateHandlers } from 'recompose'

export type Open = {
  open: boolean,
  toggle: () => void,
  clickAway: () => void,
}

export default withStateHandlers(() => ({ open: false }), {
  toggle: ({ open }) => () => ({ open: !open }),
  clickAway: () => () => ({ open: false }),
})
