// 
import * as React from 'react'

import { getSize } from 'theme/size'
import { border } from 'theme/variables'

const calculateStyleFrom = (color, margin) => ({
  width: '100%',
  minHeight: '2px',
  height: '2px',
  backgroundColor: color || border,
  margin: `${getSize(margin)} 0px`,
})


const Hairline = ({ className, color, margin, style }) => {
  const calculatedStyles = calculateStyleFrom(color, margin)
  const mergedStyles = { ...calculatedStyles, ...(style || {}) }

  return <div className={className} style={mergedStyles} />
}

export default Hairline
