// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Dot from '@material-ui/icons/FiberManualRecord'
import Block from '~/components/layout/Block'
import Img from '~/components/layout/Img'
import { fancy, border, warning, screenSm } from '~/theme/variables'

const key = require('../assets/key.svg')
const triangle = require('../assets/triangle.svg')

const styles = () => ({
  root: {
    display: 'none',
    [`@media (min-width: ${screenSm}px)`]: {
      display: 'flex',
    },
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
  warning: {
    position: 'relative',
    top: '-2px',
  },
})

type Mode = 'error' | 'warning'

type Props = {
  classes: Object,
  keySize: number,
  circleSize: number,
  dotSize: number,
  dotTop: number,
  dotRight: number,
  mode: Mode,
  center?: boolean,
  hideDot?: boolean,
}

const buildKeyStyleFrom = (size: number, center: boolean, dotSize: number) => ({
  width: `${size}px`,
  height: `${size}px`,
  marginLeft: center ? `${dotSize}px` : 'none',
  borderRadius: `${size}px`,
})

const buildDotStyleFrom = (size: number, top: number, right: number, mode: Mode) => ({
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: `${size}px`,
  top: `${top}px`,
  right: `${right}px`,
  color: mode === 'error' ? fancy : warning,
})

const KeyRing = ({
  classes,
  circleSize,
  keySize,
  dotSize,
  dotTop,
  dotRight,
  mode,
  center = false,
  hideDot = false,
}: Props) => {
  const keyStyle = buildKeyStyleFrom(circleSize, center, dotSize)
  const dotStyle = buildDotStyleFrom(dotSize, dotTop, dotRight, mode)
  const isWarning = mode === 'warning'
  const img = isWarning ? triangle : key

  return (
    <>
      <Block className={classes.root}>
        <Block className={classes.key} style={keyStyle}>
          <Img
            src={img}
            height={keySize}
            width={isWarning ? keySize + 2 : keySize}
            alt="Status connection"
            className={isWarning ? classes.warning : undefined}
          />
        </Block>
        {!hideDot && <Dot className={classes.dot} style={dotStyle} />}
      </Block>
    </>
  )
}

export default withStyles(styles)(KeyRing)
