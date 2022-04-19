import { Button } from '@gnosis.pm/safe-react-components'
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import { ReactElement } from 'react'
import { useSelector } from 'react-redux'

import { NFTToken } from 'src/logic/collectibles/sources/collectibles'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { fontColor } from 'src/theme/variables'

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
    borderRadius: '8px',
    maxWidth: '200px',
    maxHeight: '200px',
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    margin: '12px 12px 0',
    alignSelf: 'center',
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
} as any)

const Item = ({ data, onSend }: { data: NFTToken; onSend: (nftToken: NFTToken) => void }): ReactElement => {
  const granted = useSelector(grantedSelector)
  const classes = useStyles({ granted })

  return (
    <div className={classes.item}>
      <div className={classes.mainContent}>
        <img src={data.image} className={classes.image} loading="lazy" />
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
          <Button color="primary" onClick={() => onSend(data)} size="md" variant="contained">
            Send
          </Button>
        </div>
      )}
    </div>
  )
}

export default Item
