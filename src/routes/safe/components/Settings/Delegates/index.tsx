import { ReactElement, useEffect, useState } from 'react'

import Block from 'src/components/layout/Block'
import Heading from 'src/components/layout/Heading'
import Paragraph from 'src/components/layout/Paragraph/index'
import styled from 'styled-components'
import { lg } from 'src/theme/variables'
import { useSelector } from 'react-redux'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { getChainInfo } from 'src/config'

const StyledBlock = styled(Block)`
  minheight: 420px;
`

const StyledHeading = styled(Heading)`
  padding: ${lg};
  padding-bottom: 0;
`

const StyledParagraph = styled(Paragraph)`
  padding-left: ${lg};
`

const Delegates = (): ReactElement => {
  const { address: safeAddress } = useSelector(currentSafeWithNames)
  const [delegatesList, setDelegatesList] = useState([])
  const { transactionService } = getChainInfo()

  useEffect(() => {
    if (!safeAddress || !transactionService) return

    const url = `${transactionService}/api/v1/safes/${safeAddress}/delegates/`
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setDelegatesList(data.results)
      })
  }, [safeAddress, transactionService])

  return (
    <StyledBlock>
      <StyledHeading tag="h2">Manage Safe Delegates</StyledHeading>
      <StyledParagraph>Get, add and delete delegates.</StyledParagraph>
      <pre>{JSON.stringify(delegatesList, undefined, 2)}</pre>
    </StyledBlock>
  )
}

export default Delegates
