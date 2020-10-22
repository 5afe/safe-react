import React from 'react'
import styled from 'styled-components'
import Img from 'src/components/layout/Img'
import CheckIcon from 'src/assets/icons/check.svg'
import AlertIcon from 'src/assets/icons/alert.svg'

type OwnProps = {
  appEstimation: number
  internalEstimation: number
  loading: boolean
}

const Container = styled.div`
  display: flex;
  align-items: center;
`

const imgStyles = {
  marginRight: '5px',
}

const GasEstimationInfo = ({ appEstimation, internalEstimation, loading }: OwnProps): React.ReactElement => {
  if (loading) {
    return <p>Checking transaction parameters...</p>
  }

  let content: React.ReactElement | null = null
  if (appEstimation >= internalEstimation) {
    content = (
      <>
        <Img alt="Success" src={CheckIcon} style={imgStyles} /> Gas estimation is OK
      </>
    )
  }

  if (internalEstimation === 0) {
    content = (
      <>
        <Img alt="Warning" src={AlertIcon} style={imgStyles} /> Error while estimating gas. The transaction may fail.
      </>
    )
  }

  return <Container>{content}</Container>
}

export default GasEstimationInfo
