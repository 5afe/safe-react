// @flow
import {
  sm, xs, md, lg, border,
} from '~/theme/variables'

export const styles = () => ({
  title: {
    padding: `${lg} 20px`,
    fontSize: '16px',
  },
  formContainer: {
    minHeight: '369px',
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
  editOwnerIcon: {
    cursor: 'pointer',
  },
  replaceOwnerIcon: {
    marginLeft: lg,
    cursor: 'pointer',
  },
  removeOwnerIcon: {
    marginLeft: lg,
    cursor: 'pointer',
  },
})
