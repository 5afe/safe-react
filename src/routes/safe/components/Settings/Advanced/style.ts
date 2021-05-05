import { createStyles } from '@material-ui/core'
import { background, border, error, fontColor, lg, md, secondaryText, sm, smallFontSize, xl } from 'src/theme/variables'

export const styles = createStyles({
  title: {
    padding: lg,
    paddingBottom: 0,
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
  modalHeading: {
    boxSizing: 'border-box',
    justifyContent: 'space-between',
    height: '74px',
    padding: `${sm} ${lg}`,
  },
  modalManage: {
    fontSize: lg,
  },
  modalClose: {
    height: '35px',
    width: '35px',
  },
  modalButtonRow: {
    height: '84px',
    justifyContent: 'center',
  },
  modalButtonRemove: {
    color: '#fff',
    backgroundColor: error,
    height: '42px',
  },
  modalName: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  modalUserName: {
    whiteSpace: 'nowrap',
  },
  modalOwner: {
    padding: md,
    alignItems: 'center',
  },
  modalUser: {
    justifyContent: 'left',
  },
  modalDescription: {
    padding: md,
  },
  modalOpen: {
    paddingLeft: sm,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  gasCostsContainer: {
    backgroundColor: background,
    padding: `0 ${lg}`,
  },
  accordionContainer: {
    margin: `0 ${md}`,
  },
})
