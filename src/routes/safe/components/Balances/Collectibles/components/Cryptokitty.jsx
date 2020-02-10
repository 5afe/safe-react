// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import Button from '~/components/layout/Button'
import {
  fontColor,
} from '~/theme/variables'

const styles = () => ({
  item: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',

    '&:hover .hideOnHover': {
      display: 'none',
    },
    '&:hover .showOnHover': {
      display: 'flex',
    },
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
  },
  hoverContent: {
    backgroundColor: '#fff3e2',
    cursor: 'pointer',
    display: 'none',
    height: '100%',
  },
  image: {
    backgroundColor: '#f0efee',
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '155px 155px',
    borderRadius: '8px',
    height: '178px',
    width: '100%',
  },
  textContainer: {
    color: fontColor,
    fontSize: '12px',
    lineHeight: '1.42',
    padding: '17px 24px 21px',
  },
  title: {
    fontWeight: 'bold',
    margin: '0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  text: {
    margin: '0',
  },
})

type Props = {
  classes: Object,
  data: any,
}


const Cryptokitty = ({ classes, data }: Props) => (
  <div className={classes.item}>
    <div className={cn(classes.mainContent, 'hideOnHover')}>
      <div className={classes.image} style={{ backgroundImage: `url(${data.image})`, backgroundColor: data.backgroundColor }} />
      <div className={classes.textContainer}>
        <h3 className={classes.title}>{data.title}</h3>
        <p className={classes.text}>{data.text}</p>
      </div>
    </div>
    <div className={cn(classes.hoverContent, 'showOnHover')}>S</div>
  </div>
)

export default withStyles(styles)(Cryptokitty)
