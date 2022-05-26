import { ReactElement, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { makeStyles, TableCell, TableContainer, TableRow } from '@material-ui/core'
import { ButtonLink, Icon } from '@gnosis.pm/safe-react-components'
import { keccak256, fromAscii } from 'web3-utils'
import cn from 'classnames'

import Block from 'src/components/layout/Block'
import Heading from 'src/components/layout/Heading'
import Paragraph from 'src/components/layout/Paragraph/index'
import { lg } from 'src/theme/variables'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { getChainInfo, getExplorerInfo } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import Table from 'src/components/Table'
import { cellWidth } from 'src/components/Table/TableHead'
import { DELEGATE_ADDRESS_ID, DELEGATOR_ADDRESS_ID, generateColumns } from './columns'
import { styles } from './style'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import Row from 'src/components/layout/Row'
import ButtonHelper from 'src/components/ButtonHelper'
import { AddDelegateModal } from 'src/routes/safe/components/Settings/Delegates/AddDelegateModal'
import { RemoveDelegateModal } from 'src/routes/safe/components/Settings/Delegates/RemoveDelegateModal'
import { EditDelegateModal } from 'src/routes/safe/components/Settings/Delegates/EditDelegateModal'

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

const useStyles = makeStyles(styles)

const Delegates = (): ReactElement => {
  const { address: safeAddress } = useSelector(currentSafeWithNames)
  const userAccount = useSelector(userAccountSelector)
  const { transactionService } = getChainInfo()
  const [delegatesList, setDelegatesList] = useState<DelegateResponse['results']>([])
  const [addDelegateModalOpen, setAddDelegateModalOpen] = useState<boolean>(false)
  const [editDelegateModalOpen, setEditDelegateModalOpen] = useState<boolean>(false)
  const [delegateToEdit, setDelegateToEdit] = useState<string>('')
  const [removeDelegateModalOpen, setRemoveDelegateModalOpen] = useState<boolean>(false)
  const [addressToRemove, setAddressToRemove] = useState<string>('')
  const columns = generateColumns()
  const autoColumns = columns.filter(({ custom }) => !custom)

  const classes = useStyles(styles)

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
    const msg = checksumAddress(delegate) + totp
    const hashMessage = keccak256(fromAscii(msg))

    const web3 = getWeb3()
    const signature = await web3.eth.sign(hashMessage, userAccount)

    return signature
  }

  useEffect(() => {
    if (!safeAddress || !transactionService) return
    fetchDelegates()
  }, [fetchDelegates, safeAddress, transactionService])

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

  const handleEditDelegateLabel = async (label) => {
    // close Edit delegate modal
    setEditDelegateModalOpen(false)

    const delegate = checksumAddress(delegateToEdit)
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

  const handleRemoveDelegate = async (address: string) => {
    // close Remove delegate modal
    setRemoveDelegateModalOpen(false)

    const delegate = checksumAddress(address)
    const signature = await getSignature(delegate)

    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        signature: signature,
      }),
    }

    const url = `${transactionService}/api/v1/safes/${safeAddress}/delegates/${delegate}/`
    fetch(url, requestOptions).then(() => {
      setAddressToRemove('')
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
      <TableContainer>
        <Table columns={columns} data={delegatesList} defaultFixed disableLoadingOnEmptyTable disablePagination>
          {(data) =>
            data.map((row, index) => {
              const hideBorderBottom = index >= 3 && index === data.size - 1 && classes.noBorderBottom
              return (
                <TableRow className={cn(classes.hide, hideBorderBottom)} key={index}>
                  {autoColumns.map((column) => {
                    const displayEthHash = [DELEGATE_ADDRESS_ID, DELEGATOR_ADDRESS_ID].includes(column.id)
                    return (
                      <TableCell component="td" key={column.id} style={cellWidth(column.width)}>
                        {displayEthHash ? (
                          <Block justify="left">
                            <PrefixedEthHashInfo
                              hash={row[column.id]}
                              shortenHash={4}
                              showCopyBtn
                              showAvatar
                              explorerUrl={getExplorerInfo(row[column.id])}
                            />
                          </Block>
                        ) : (
                          row[column.id]
                        )}
                      </TableCell>
                    )
                  })}
                  <TableCell component="td">
                    <Row align="end" className={classes.actions}>
                      <ButtonHelper
                        onClick={() => {
                          setDelegateToEdit(row[DELEGATE_ADDRESS_ID])
                          setEditDelegateModalOpen(true)
                        }}
                      >
                        <Icon size="sm" type="edit" tooltip="Edit delegate" className={classes.editEntryButton} />
                      </ButtonHelper>
                      <ButtonHelper
                        onClick={() => {
                          setAddressToRemove(row[DELEGATE_ADDRESS_ID])
                          setRemoveDelegateModalOpen(true)
                        }}
                      >
                        <Icon
                          size="sm"
                          type="delete"
                          color="error"
                          tooltip="Remove delegate"
                          className={classes.removeEntryButton}
                        />
                      </ButtonHelper>
                    </Row>
                  </TableCell>
                </TableRow>
              )
            })
          }
        </Table>
      </TableContainer>
      <AddDelegateModal
        isOpen={addDelegateModalOpen}
        onClose={() => setAddDelegateModalOpen(false)}
        onSubmit={handleAddDelegate}
      />
      <EditDelegateModal
        delegate={delegateToEdit}
        isOpen={editDelegateModalOpen}
        onClose={() => setEditDelegateModalOpen(false)}
        onSubmit={handleEditDelegateLabel}
      />
      <RemoveDelegateModal
        delegateToDelete={addressToRemove}
        isOpen={removeDelegateModalOpen}
        onClose={() => setRemoveDelegateModalOpen(false)}
        onSubmit={handleRemoveDelegate}
      />
    </StyledBlock>
  )
}

export default Delegates
