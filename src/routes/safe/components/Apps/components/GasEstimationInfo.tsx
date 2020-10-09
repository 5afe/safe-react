import React from 'react'
import Img from 'src/components/layout/Img'
import CheckIcon from 'src/assets/icons/check.svg'
import AlertIcon from 'src/assets/icons/alert.svg'

type OwnProps = {
  appEstimation: number
  internalEstimation: number
  loading: boolean
}

const GasEstimationInfo = ({ appEstimation, internalEstimation, loading }: OwnProps): React.ReactElement => {
  if (loading) {
    return <p>Loading...</p>
  }

  if (appEstimation > internalEstimation) {
    return (
      <div>
        <Img alt="Success" src={CheckIcon} /> The estimation is correct
      </div>
    )
  }

  if (internalEstimation > appEstimation) {
    return (
      <div>
        <Img alt="Warning" src={AlertIcon} /> Gas estimation provided by developer is too low. The transaction most
        likely will fail.
      </div>
    )
  }

  return (
    <div>
      success: <Img alt="Success" src={CheckIcon} /> <Img alt="Warning" src={AlertIcon} />
    </div>
  )
}

export default GasEstimationInfo
