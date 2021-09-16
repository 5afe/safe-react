import { ReactElement } from 'react'

const style = {
  flexGrow: 1,
}

const Spacer = ({ className }: { className?: string }): ReactElement => <div className={className} style={style} />

export default Spacer
