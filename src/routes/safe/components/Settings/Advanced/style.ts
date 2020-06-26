import { createStyles } from '@material-ui/core'
import { border, fontColor, lg, secondaryText, smallFontSize, xl } from 'src/theme/variables'

export const styles = createStyles({
  title: {
    padding: lg,
    paddingBottom: 0,
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
  annotation: {
    paddingLeft: lg,
  },
  ownersText: {
    color: secondaryText,
    '& b': {
      color: fontColor,
    },
  },
  container: {
    padding: lg,
  },
  buttonRow: {
    padding: lg,
    position: 'absolute',
    left: 0,
    bottom: 0,
    boxSizing: 'border-box',
    width: '100%',
    justifyContent: 'flex-end',
    borderTop: `2px solid ${border}`,
  },
  modifyBtn: {
    height: xl,
    fontSize: smallFontSize,
  },
  removeModuleIcon: {
    marginLeft: lg,
    cursor: 'pointer',
  },
})
