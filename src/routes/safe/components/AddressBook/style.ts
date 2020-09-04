import { lg, marginButtonImg, md, sm } from 'src/theme/variables'
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
  controlsRow: {
    backgroundColor: 'white',
    padding: lg,
    borderRadius: sm,
  },
  editEntryButton: {
    cursor: 'pointer',
    marginBottom: marginButtonImg,
  },
  editEntryButtonNonOwner: {
    cursor: 'pointer',
  },
  removeEntryButton: {
    marginLeft: lg,
    marginRight: lg,
    marginBottom: marginButtonImg,
    cursor: 'pointer',
  },
  removeEntryButtonDisabled: {
    marginLeft: lg,
    marginRight: lg,
    marginBottom: marginButtonImg,
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
  iconSmall: {
    fontSize: 16,
  },
})
