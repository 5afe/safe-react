import { withStateHandlers } from 'recompose'

export default withStateHandlers(() => ({ open: false }), {
  toggle: ({ open }) => () => ({ open: !open }),
  clickAway: () => () => ({ open: false }),
})
