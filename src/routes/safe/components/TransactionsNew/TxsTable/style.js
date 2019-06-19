// @flow
import { xs, sm, md, lg } from '~/theme/variables'

export const styles = (theme: Object) => ({
  container: {
    marginTop: lg,
  },
  root: {
    width: '20px',
    marginRight: sm,
  },
  zero: {
    letterSpacing: '-0.5px',
  },
  message: {
    margin: `${sm} 0`,
  },
  actionIcon: {
    marginRight: theme.spacing(1),
  },
  iconSmall: {
    fontSize: 16,
  },
  cell: {
    paddingTop: md,
    paddingBottom: md,
  },
  row: {
    '&:hover': {
      backgroundColor: '#fff3e2',
    },
  },
  actions: {
    justifyContent: 'flex-end',
    visibility: 'hidden',
  },
  send: {
    minWidth: '0px',
    marginRight: sm,
    width: '70px',
  },
  receive: {
    minWidth: '0px',
    width: '95px',
  },
  leftIcon: {
    marginRight: xs,
  },
  links: {
    textDecoration: 'underline',
    '&:hover': {
      cursor: 'pointer',
    },
  },
})
