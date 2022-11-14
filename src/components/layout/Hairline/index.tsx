import { ReactElement } from 'react'

import { getSize } from 'src/theme/size'
import { border } from 'src/theme/variables'

const calculateStyleFrom = (color, margin) => ({
  width: '100%',
  minHeight: '2px',
  height: '2px',
  backgroundColor: "#000",
  margin: `${getSize(margin)} 0px`,
})

const Hairline = ({ className, color, margin, style }: any): ReactElement => {
  const calculatedStyles = calculateStyleFrom(color, margin)
  const mergedStyles = { ...calculatedStyles, ...(style || {}) }

  return <div className={className} style={mergedStyles} />
}

export default Hairline
