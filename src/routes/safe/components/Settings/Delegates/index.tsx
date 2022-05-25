import { ReactElement, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Table, TableHeader, TableRow, Text } from '@gnosis.pm/safe-react-components'

import Block from 'src/components/layout/Block'
import Heading from 'src/components/layout/Heading'
import Paragraph from 'src/components/layout/Paragraph/index'
import { lg } from 'src/theme/variables'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { getChainInfo } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

type Page<T> = {
  next?: string
  previous?: string
  results: Array<T>
}

type Delegate = {
  safe?: string
  delegate: string
  delegator: string
  label: string
}

type DelegateResponse = Page<Delegate>

const StyledBlock = styled(Block)`
  minheight: 420px;
  padding: ${lg};
`

const StyledHeading = styled(Heading)`
  padding-bottom: 0;
`

const Delegates = (): ReactElement => {
  const { address: safeAddress } = useSelector(currentSafeWithNames)
  const [delegatesList, setDelegatesList] = useState<DelegateResponse['results']>([])
  const { transactionService } = getChainInfo()

  const headerCells: TableHeader[] = useMemo(
    () => [
      { id: 'delegate', label: 'Delegate' },
      { id: 'delegator', label: 'Delegator' },
      { id: 'label', label: 'Label' },
    ],
    [],
  )
  const rows: TableRow[] = useMemo(() => [], [])

  useEffect(() => {
    if (!safeAddress || !transactionService) return

    const url = `${transactionService}/api/v1/safes/${safeAddress}/delegates/`
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setDelegatesList(data.results)
      })
  }, [safeAddress, transactionService])

  useEffect(() => {
    if (delegatesList.length) {
      let index = 0
      for (const obj of delegatesList) {
        rows.push({
          id: `${index++}`,
          cells: [
            { id: 'delegate', content: <Text size="xl">{checksumAddress(obj.delegate)}</Text> },
            { id: 'delegator', content: <Text size="xl">{checksumAddress(obj.delegator)}</Text> },
            { id: 'label', content: <Text size="xl">{obj.label}</Text> },
          ],
        })
      }
    }
  }, [delegatesList, rows])

  return (
    <StyledBlock>
      <StyledHeading tag="h2">Manage Safe Delegates</StyledHeading>
      <Paragraph>Get, add and delete delegates.</Paragraph>
      <pre>{JSON.stringify(delegatesList, undefined, 2)}</pre>
      <Table headers={headerCells} rows={rows} />
    </StyledBlock>
  )
}

export default Delegates
