import classNames from 'classnames/bind'
import * as React from 'react'

import styles from './index.module.scss'

import { capitalize } from 'src/utils/css'

const cx = classNames.bind(styles)

const Heading = (props) => {
  const { align, children, className = '', color, margin, tag, testId, truncate, ...rest } = props

  const classes = cx(className, 'heading', align, tag, margin ? capitalize(margin, 'margin') : undefined, color, {
    truncate,
  })

  return React.createElement(tag, { ...rest, className: classes, 'data-testid': testId || '' }, children)
}

export default Heading
