import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { ButtonLink, Table, TableHeader, TableRow, Text } from '@gnosis.pm/safe-react-components'

import Block from 'src/components/layout/Block'
import Heading from 'src/components/layout/Heading'
import Paragraph from 'src/components/layout/Paragraph/index'
import { lg } from 'src/theme/variables'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { getChainInfo } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { AddDelegateModal } from 'src/routes/safe/components/Settings/Delegates/AddDelegateModal'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { keccak256, fromAscii } from 'web3-utils'

// TODO: these types will come from the Client GW SDK once #72 is merged
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
  const userAccount = useSelector(userAccountSelector)
  const { transactionService } = getChainInfo()
  const [delegatesList, setDelegatesList] = useState<DelegateResponse['results']>([])
  const [addDelegateModalOpen, setAddDelegateModalOpen] = useState<boolean>(false)

  const headerCells: TableHeader[] = useMemo(
    () => [
      { id: 'delegate', label: 'Delegate' },
      { id: 'delegator', label: 'Delegator' },
      { id: 'label', label: 'Label' },
    ],
    [],
  )
  const rows: TableRow[] = useMemo(() => [], [])

  const fetchDelegates = useCallback(() => {
    const url = `${transactionService}/api/v1/safes/${safeAddress}/delegates/`
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setDelegatesList(data.results)
      })
  }, [safeAddress, transactionService])

  const getSignature = async (delegate) => {
    const totp = Math.floor(Date.now() / 1000 / 3600)
    const web3 = getWeb3()
    const msg = checksumAddress(delegate) + totp

    const hashMessage = keccak256(fromAscii(msg))
    const signature = await web3.eth.sign(hashMessage, userAccount)

    return signature
  }

  useEffect(() => {
    if (!safeAddress || !transactionService) return
    fetchDelegates()
  }, [fetchDelegates, safeAddress, transactionService])

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

  const handleAddDelegate = async ({ address, label }) => {
    // close Add delegate modal
    setAddDelegateModalOpen(false)

    const delegate = checksumAddress(address)

    const signature = await getSignature(delegate)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        safe: safeAddress,
        delegate: delegate,
        signature: signature,
        label: label,
      }),
    }

    const url = `${transactionService}/api/v1/safes/${safeAddress}/delegates/`
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then(() => {
        fetchDelegates()
      })
  }

  return (
    <StyledBlock>
      <StyledHeading tag="h2">Manage Safe Delegates</StyledHeading>
      <Paragraph>Get, add and delete delegates.</Paragraph>
      <ButtonLink
        onClick={() => {
          setAddDelegateModalOpen(true)
        }}
        color="primary"
        iconType="add"
        iconSize="sm"
        textSize="xl"
      >
        Add delegate
      </ButtonLink>
      <pre>{JSON.stringify(delegatesList, undefined, 2)}</pre>
      <Table headers={headerCells} rows={rows} />
      <AddDelegateModal
        isOpen={addDelegateModalOpen}
        onClose={() => setAddDelegateModalOpen(false)}
        onSubmit={handleAddDelegate}
      />
    </StyledBlock>
  )
}

export default Delegates
