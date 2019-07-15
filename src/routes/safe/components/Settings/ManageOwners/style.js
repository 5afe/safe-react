// @flow
import { lg } from '~/theme/variables'

export const styles = () => ({
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
