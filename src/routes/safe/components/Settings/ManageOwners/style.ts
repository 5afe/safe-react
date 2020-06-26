import { lg, screenMdMax, sm } from 'src/theme/variables'

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
    minWidth: '100px',
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
    borderRadius: sm,
  },
  removeOwnerIcon: {
    marginLeft: lg,
    cursor: 'pointer',
  },
  tableRootContainer: {
    [`@media (min-width: ${screenMdMax}px)`]: {
      paddingRight: 0,
      paddingTop: '8px',
    },
  },
})
