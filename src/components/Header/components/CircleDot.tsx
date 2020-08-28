import { withStyles } from '@material-ui/core/styles'
import Dot from '@material-ui/icons/FiberManualRecord'
import * as React from 'react'

import Block from 'src/components/layout/Block'
import Img from 'src/components/layout/Img'
import { border, fancy, screenSm, warning } from 'src/theme/variables'

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

const buildKeyStyleFrom = (size, center, dotSize) => ({
  width: `${size}px`,
  height: `${size}px`,
  marginLeft: center ? `${dotSize}px` : 'none',
  borderRadius: `${size}px`,
})

const buildDotStyleFrom = (size, top, right, mode) => ({
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: `${size}px`,
  top: `${top}px`,
  right: `${right}px`,
  color: mode === 'error' ? fancy : warning,
})

const KeyRing = ({
  center = false,
  circleSize,
  classes,
  dotRight,
  dotSize,
  dotTop,
  hideDot = false,
  keySize,
  mode,
}) => {
  const keyStyle = buildKeyStyleFrom(circleSize, center, dotSize)
  const dotStyle = buildDotStyleFrom(dotSize, dotTop, dotRight, mode)
  const isWarning = mode === 'warning'
  const img = isWarning ? triangle : key

  return (
    <>
      <Block className={classes.root}>
        <Block className={classes.key} style={keyStyle}>
          <Img
            alt="Status connection"
            className={isWarning ? classes.warning : undefined}
            height={keySize}
            src={img}
            width={isWarning ? keySize + 2 : keySize}
          />
        </Block>
        {!hideDot && <Dot className={classes.dot} style={dotStyle} />}
      </Block>
    </>
  )
}

export default withStyles(styles as any)(KeyRing)
