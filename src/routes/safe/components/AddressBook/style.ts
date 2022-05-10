import { background, lg, md, sm } from 'src/theme/variables'
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
      backgroundColor: `${background}`,
    },
    '&:hover $actions': {
      visibility: 'initial',
    },
  },
  actions: {
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  },
  editEntryButtonNonOwner: {
    cursor: 'pointer',
  },
  removeEntryButton: {
    cursor: 'pointer',
  },
  removeEntryButtonDisabled: {
    cursor: 'default',
  },
  removeEntryButtonNonOwner: {
    cursor: 'pointer',
  },
  leftIcon: {
    marginRight: sm,
  },
  iconSmall: {
    fontSize: 16,
  },
})
