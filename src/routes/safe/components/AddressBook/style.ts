import { lg, md, sm } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
  formContainer: {
    minHeight: '250px',
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
      backgroundColor: '#f7f5f5',
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
  controlsRow: {
    backgroundColor: 'white',
    padding: lg,
    borderRadius: sm,
  },
  editEntryButton: {
    cursor: 'pointer',
    marginBottom: '16px',
  },
  editEntryButtonNonOwner: {
    cursor: 'pointer',
  },
  removeEntryButton: {
    marginLeft: lg,
    marginRight: lg,
    marginBottom: '16px',
    cursor: 'pointer',
  },
  removeEntryButtonDisabled: {
    marginLeft: lg,
    marginRight: lg,
    marginBottom: '16px',
    cursor: 'default',
  },
  removeEntryButtonNonOwner: {
    marginLeft: lg,
    marginRight: lg,
    cursor: 'pointer',
  },
  message: {
    padding: `${md} 0`,
    maxHeight: '54px',
    boxSizing: 'border-box',
    justifyContent: 'flex-end',
  },
  leftIcon: {
    marginRight: sm,
  },
  iconSmall: {
    fontSize: 16,
  },
})
