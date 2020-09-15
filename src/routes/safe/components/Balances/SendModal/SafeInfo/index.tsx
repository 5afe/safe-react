import React from 'react'
import { useSelector } from 'react-redux'

import AddressInfo from 'src/components/AddressInfo'
import { safeSelector } from 'src/logic/safe/store/selectors'

const SafeInfo = () => {
  const { address: safeAddress = '', ethBalance, name: safeName } = useSelector(safeSelector) || {}
  return <AddressInfo ethBalance={ethBalance} safeAddress={safeAddress} safeName={safeName} />
}

export default SafeInfo
