// @flow
import { lg } from '~/theme/variables'

export const styles = () => ({
  formContainer: {
    minHeight: '420px',
  },
  title: {
    padding: lg,
    paddingBottom: 0,
  },
  annotation: {
    paddingLeft: lg,
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
  noBorderBottom: {
    '& > td': {
      borderBottom: 'none',
    },
  },
  editOwnerIcon: {
    cursor: 'pointer',
  },
  replaceOwnerIcon: {
    marginLeft: lg,
    cursor: 'pointer',
  },
  controlsRow: {
    backgroundColor: 'white',
    padding: lg,
    borderRadius: '8px',
  },
  removeOwnerIcon: {
    marginLeft: lg,
    cursor: 'pointer',
  },
})
