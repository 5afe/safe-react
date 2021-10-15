import { makeStyles } from '@material-ui/core'

import { boldFont, border, error, fontColor, lg, md, secondaryText, sm, smallFontSize, xl } from 'src/theme/variables'

export const useStyles = makeStyles(({ palette }) => ({
  title: {
    padding: lg,
    paddingBottom: 0,
  },
  hide: {
    '&:hover': {
      backgroundColor: palette.backgroundColor[palette.type],
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
  actionButton: {
    fontWeight: boldFont,
    marginRight: sm,
  },
  buttonRow: {
    padding: lg,
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
  modalContainer: {
    minHeight: '369px',
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
    color: palette.surface01dp[palette.type],
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
    backgroundColor: palette.backgroundColor[palette.type],
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
  amountInput: {
    width: '100% !important',
  },
  gasCostsContainer: {
    backgroundColor: palette.backgroundColor[palette.type],
    padding: `0 ${lg}`,
  },
}))
