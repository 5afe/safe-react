// @flow
import { sm, md } from '~/theme/variables'

export const styles = (theme: Object) => ({
  root: {
    width: '20px',
    marginRight: sm,
  },
  message: {
    margin: `${sm} 0`,
    padding: `${md} 0`,
    maxHeight: '54px',
    boxSizing: 'border-box',
    justifyContent: 'flex-end',
  },
  actionIcon: {
    marginRight: theme.spacing(1),
  },
  iconSmall: {
    fontSize: 16,
  },
  receiveModal: {
    height: '544px',
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
    marginLeft: sm,
    borderRadius: '4px',
    '& > span': {
      fontSize: '14px',
    },
  },
  send: {
    width: '75px',
    minWidth: '75px',
    borderRadius: '4px',
    '& > span': {
      fontSize: '14px',
    },
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
