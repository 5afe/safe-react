import { boldFont, border, error, primary, secondary, secondaryText, sm, warning } from 'src/theme/variables'
import { createStyles } from '@material-ui/core/styles'

export const styles = createStyles({
  ownersList: {
    height: '192px',
    overflowY: 'scroll',
    padding: 0,
    width: '100%',
  },
  rightCol: {
    borderLeft: `2px solid ${border}`,
    boxSizing: 'border-box',
  },
  verticalLine: {
    backgroundColor: secondaryText,
    height: '55px',
    left: '27px',
    position: 'absolute',
    top: '-27px',
    width: '2px',
    zIndex: 12,
  },
  verticalLinePending: {
    backgroundColor: secondaryText,
  },
  verticalLineDone: {
    backgroundColor: secondary,
  },
  verticalLineCancel: {
    backgroundColor: error,
  },
  verticalPendingAction: {
    backgroundColor: warning,
  },
  icon: {
    marginRight: sm,
  },
  owner: {
    borderBottom: `1px solid ${border}`,
  },
  container: {
    alignItems: 'center',
    display: 'flex',
    padding: '13px 15px 13px 18px',
    position: 'relative',
  },
  ownerListTitle: {
    alignItems: 'center',
    display: 'flex',
    fontSize: '11px',
    fontWeight: boldFont,
    letterSpacing: '1px',
    lineHeight: 1.3,
    padding: '15px 15px 15px 18px',
    position: 'relative',
    textTransform: 'uppercase',
  },
  olderTxAnnotation: {
    textAlign: 'center',
  },
  ownerListTitleDone: {
    color: secondary,
  },
  ownerListTitleCancelDone: {
    color: error,
  },
  name: {
    height: '15px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  address: {
    height: '20px',
  },
  spacer: {
    flex: 'auto',
  },
  circleState: {
    display: 'flex',
    justifyContent: 'center',
    marginRight: '18px',
    width: '20px',
    zIndex: 13,

    '& > img': {
      display: 'block',
    },
  },
  button: {
    alignSelf: 'center',
    flexGrow: 0,
    fontSize: '16px',
    justifyContent: 'center',
    paddingLeft: '14px',
    paddingRight: '14px',
  },
  lastButton: {
    marginLeft: '10px',
  },
  executor: {
    alignSelf: 'center',
    background: border,
    borderRadius: '3px',
    color: primary,
    fontSize: '11px',
    height: '24px',
    lineHeight: '24px',
    padding: '0 12px',
  },
})
