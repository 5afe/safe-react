// @flow
import { sm } from '~/theme/variables'

export const styles = (theme: Object) => ({
  root: {
    width: '20px',
    marginRight: sm,
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
  hide: {
    '&:hover': {
      backgroundColor: '#fff3e2',
    },
    '&:hover $actions': {
      visibility: 'initial',
    },
    '&:focus $actions': {
      visibility: 'initial',
    },
  },
  actions: {
    justifyContent: 'flex-end',
    visibility: 'hidden',
  },
  receive: {
    width: '95px',
    minWidth: '95px',
  },
  send: {
    width: '75px',
    minWidth: '75px',
    marginLeft: sm,
  },
  leftIcon: {
    marginRight: sm,
  },
  links: {
    textDecoration: 'underline',
    '&:hover': {
      cursor: 'pointer',
    },
  },
})
