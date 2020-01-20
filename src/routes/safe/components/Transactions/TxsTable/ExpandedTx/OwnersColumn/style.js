// @flow
import {
  border, sm, boldFont, primary, secondary, secondaryText, error,
} from '~/theme/variables'

export const styles = () => ({
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
  verticalLineProgressPending: {
    borderLeft: `2px solid ${secondaryText}`,
    height: '52px',
    left: '27px',
    position: 'absolute',
    top: '-26px',
    zIndex: '10',
  },
  verticalLineProgressDone: {
    borderLeft: `2px solid ${secondary}`,
    height: '52px',
    left: '27px',
    position: 'absolute',
    top: '-26px',
    zIndex: '10',
  },
  verticalLineCancelProgressDone: {
    borderLeft: `2px solid ${error}`,
    height: '52px',
    left: '27px',
    position: 'absolute',
    top: '-26px',
    zIndex: '10',
  },
  icon: {
    marginRight: sm,
  },
  owner: {
    borderBottom: `1px solid ${border}`,
  },
  container: {
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
  iconState: {
    display: 'flex',
    justifyContent: 'center',
    marginRight: '18px',
    width: '20px',
    zIndex: '100',

    '& > img': {
      display: 'block',
    },
  },
  button: {
    alignSelf: 'center',
    flexGrow: '0',
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
