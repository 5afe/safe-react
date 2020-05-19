import { makeStyles } from '@material-ui/core/styles'
// import CallMade from '@material-ui/icons/CallMade'
import cn from 'classnames'
import * as React from 'react'
import { useSelector } from 'react-redux'

import Button from 'src/components/layout/Button'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { fontColor, sm, xs } from 'src/theme/variables'

const useStyles = makeStyles({
  item: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 10px 0 rgba(33, 48, 77, 0.10)',
    boxSizing: 'border-box',
    cursor: (props) => (props.granted ? 'pointer' : 'default'),
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    minHeight: '250px',
    minWidth: '0',
    position: 'relative',

    '&:hover .showOnHover': {
      opacity: '1',
    },
    '&:active .showOnHover': {
      opacity: '1',
    },
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    position: 'relative',
    zIndex: '1',
  },
  extraContent: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 243, 226, 0.6)',
    bottom: '0',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    left: '0',
    opacity: '0',
    position: 'absolute',
    right: '0',
    top: '0',
    transition: 'opacity 0.15s ease-out',
    zIndex: '5',
  },
  image: {
    backgroundColor: (props) => `#${props.backgroundColor}` || '#f0efee',
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    borderRadius: '8px',
    height: '178px',
    flexGrow: '1',
    width: '100%',
  },
  textContainer: {
    boxSizing: 'border-box',
    color: fontColor,
    flexShrink: '0',
    fontSize: '12px',
    lineHeight: '1.4',
    padding: '15px 22px 20px',
  },
  title: {
    fontWeight: 'bold',
    margin: '0',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  text: {
    margin: '0',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  buttonIcon: {
    fontSize: 16,
    marginRight: sm,
  },
  sendButton: {
    borderRadius: xs,
    minWidth: '85px',

    '& > span': {
      fontSize: '14px',
    },
  },
} as any)

const Item = ({ data, onSend }) => {
  const granted = useSelector(grantedSelector)
  const classes = useStyles({ backgroundColor: data.color, granted })

  return (
    <div className={classes.item}>
      <div className={classes.mainContent}>
        <div className={classes.image} style={{ backgroundImage: `url(${data.image})` }} />
        <div className={classes.textContainer}>
          {data.name && (
            <h3 className={classes.title} title={data.name}>
              {data.name}
            </h3>
          )}
          {data.description && (
            <p className={classes.text} title={data.description}>
              {data.description}
            </p>
          )}
        </div>
      </div>
      {granted && (
        <div className={cn(classes.extraContent, 'showOnHover')}>
          <Button className={classes.sendButton} color="primary" onClick={onSend} size="small" variant="contained">
            {/* <CallMade alt="Send" className={classes.buttonIcon} />  */}
            Send
          </Button>
        </div>
      )}
    </div>
  )
}

export default Item
