import { ReactElement } from 'react'

import { border } from 'src/theme/variables'

const style = {
  borderRight: `solid 2px ${border}`,
  height: '100%',
}

const Divider = ({ className }: { className?: string }): ReactElement => <div className={className} style={style} />

export default Divider
