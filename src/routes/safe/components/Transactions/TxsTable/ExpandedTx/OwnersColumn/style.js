// @flow
import {
  border, sm, boldFont, primary, secondary, secondaryText,
} from '~/theme/variables'

export const styles = () => ({
  ownersList: {
    width: '100%',
    padding: 0,
    height: '192px',
    overflowY: 'scroll',
  },
  rightCol: {
    boxSizing: 'border-box',
    borderLeft: `2px solid ${border}`,
  },
  verticalLineProgressPending: {
    position: 'absolute',
    borderLeft: `2px solid ${secondaryText}`,
    height: '52px',
    top: '-26px',
    left: '29px',
    zIndex: '10',
  },
  verticalLineProgressDone: {
    position: 'absolute',
    borderLeft: `2px solid ${secondary}`,
    height: '52px',
    top: '-26px',
    left: '29px',
    zIndex: '10',
  },
  icon: {
    marginRight: sm,
  },
  owner: {
    borderBottom: `1px solid ${border}`,
  },
  container: {
    position: 'relative',
    display: 'flex',
    padding: '5px 20px',
  },
  ownerListTitle: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    paddingLeft: '20px',
    fontSize: '11px',
    fontWeight: boldFont,
    lineHeight: 1.27,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  olderTxAnnotation: {
    textAlign: 'center',
  },
  ownerListTitleDone: {
    color: secondary,
  },
  name: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    height: '15px',
  },
  address: {
    height: '20px',
  },
  spacer: {
    flex: 'auto',
  },
  iconState: {
    width: '20px',
    display: 'flex',
    justifyContent: 'center',
    marginRight: '10px',
    zIndex: '100',
    '& > img': {
      display: 'block',
    },
  },
  button: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  executor: {
    borderRadius: '3px',
    padding: '3px 5px',
    background: border,
    color: primary,
    alignSelf: 'center',
    fontSize: '11px',
  },
})
