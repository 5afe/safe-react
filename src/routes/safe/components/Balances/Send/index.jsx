// @flow
import React, { useState } from 'react'
import ChooseTxType from './screens/ChooseTxType'

type Props = {
  onClose: () => void,
}

const Send = ({ onClose }: Props) => {
  const [activeScreen, setActiveScreen] = useState('chooseTxType')

  return (
    <React.Fragment>
      {activeScreen === 'chooseTxType' && <ChooseTxType onClose={onClose} setActiveScreen={setActiveScreen} />}
    </React.Fragment>
  )
}

export default Send
