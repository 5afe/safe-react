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
    gap: md,
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
    marginBottom: md,
  },
  editEntryButtonNonOwner: {
    cursor: 'pointer',
  },
  removeEntryButton: {
    marginRight: md,
    marginBottom: md,
    cursor: 'pointer',
  },
  removeEntryButtonDisabled: {
    marginRight: md,
    marginBottom: md,
    cursor: 'default',
  },
  removeEntryButtonNonOwner: {
    marginRight: md,
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
