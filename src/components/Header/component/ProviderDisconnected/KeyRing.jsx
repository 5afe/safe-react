// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Dot from '@material-ui/icons/FiberManualRecord'
import Img from '~/components/layout/Img'
import { fancy, border } from '~/theme/variables'

const key = require('../../assets/key.svg')

const styles = () => ({
  root: {
    display: 'flex',
  },
  dot: {
    position: 'relative',
    backgroundColor: '#ffffff',
    color: fancy,
  },
  key: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: border,
  },
})

type Props = {
  classes: Object,
  keySize: number,
  circleSize: number,
  dotSize: number,
  dotTop: number,
  dotRight: number,
  center?: boolean,
}

const buildKeyStyleFrom = (size: number, center: boolean, dotSize: number) => ({
  width: `${size}px`,
  height: `${size}px`,
  marginLeft: center ? `${dotSize}px` : 'none',
  borderRadius: `${size}px`,
})

const buildDotStyleFrom = (size: number, top: number, right: number) => ({
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: `${size}px`,
  top: `${top}px`,
  right: `${right}px`,
})

const KeyRing = ({
  classes, circleSize, keySize, dotSize, dotTop, dotRight, center = false,
}: Props) => {
  const keyStyle = buildKeyStyleFrom(circleSize, center, dotSize)
  const dotStyle = buildDotStyleFrom(dotSize, dotTop, dotRight)

  return (
    <React.Fragment>
      <Block className={classes.root}>
        <Block className={classes.key} style={keyStyle}>
          <Img src={key} height={keySize} alt="Status disconnected" />
        </Block>
        <Dot className={classes.dot} style={dotStyle} />
      </Block>
    </React.Fragment>
  )
}

export default withStyles(styles)(KeyRing)
