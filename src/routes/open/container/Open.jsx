// @flow
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
//import queryString from 'query-string'

import Opening from '../../opening'
import Layout from '../components/Layout'

import actions, { type Actions, type AddSafe } from './actions'
import selector from './selector'

import { Loader } from '~/components-v2'
import Page from '~/components/layout/Page'
import { /* getGnosisSafeInstanceAt, */ getSafeDeploymentTransaction } from '~/logic/contracts/safeContracts'
import { checkReceiptStatus } from '~/logic/wallets/ethTransactions'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import {
  getAccountsFrom,
  getNamesFrom,
  getOwnersFrom,
  getSafeNameFrom,
  getThresholdFrom,
} from '~/routes/open/utils/safeDataExtractor'
import { SAFELIST_ADDRESS /* , OPENING_ADDRESS, stillInOpeningView */ } from '~/routes/routes'
import { buildSafe } from '~/routes/safe/store/actions/fetchSafe'
import { history } from '~/store'
import { loadFromStorage, removeFromStorage, saveToStorage } from '~/utils/storage'

const SAFE_PENDING_CREATION_HASH_STORAGE_KEY = 'SAFE_PENDING_CREATION_HASH_STORAGE_KEY'

type Props = Actions & {
  provider: string,
  userAccount: string,
  network: string,
}

export type OpenState = {
  safeAddress: string,
}

export type SafePropsType = {
  name: string,
  ownerAddresses: string[],
  ownerNames: string[],
  threshold: string,
}

// const validateQueryParams = (
//   ownerAddresses?: string[],
//   ownerNames?: string[],
//   threshold?: string,
//   safeName?: string,
// ) => {
//   if (!ownerAddresses || !ownerNames || !threshold || !safeName) {
//     return false
//   }
//   if (!ownerAddresses.length === 0 || ownerNames.length === 0) {
//     return false
//   }

//   if (Number.isNaN(Number(threshold))) {
//     return false
//   }
//   if (threshold > ownerAddresses.length) {
//     return false
//   }
//   return true
// }

export const getSafeProps = async (safeAddress, safeName, ownersNames, ownerAddresses) => {
  const safeProps = await buildSafe(safeAddress, safeName)
  const owners = getOwnersFrom(ownersNames, ownerAddresses)
  safeProps.owners = owners

  return safeProps
}

export const createSafe = (values: Object, userAccount: string, addSafe: AddSafe): Promise<OpenState> => {
  const numConfirmations = getThresholdFrom(values)
  const name = getSafeNameFrom(values)
  const ownersNames = getNamesFrom(values)
  const ownerAddresses = getAccountsFrom(values)

  const deploymentTxMethod = getSafeDeploymentTransaction(ownerAddresses, numConfirmations, userAccount)

  const promiEvent = deploymentTxMethod.send({ from: userAccount, value: 0 })

  promiEvent
    .once('transactionHash', txHash => {
      saveToStorage(SAFE_PENDING_CREATION_HASH_STORAGE_KEY, { txHash, name, ownerAddresses, ownersNames })
    })
    .then(async receipt => {
      //-------------------------------
      // check if this is really needed
      await checkReceiptStatus(receipt.transactionHash)

      const safeAddress = receipt.events.ProxyCreation.address
      const safeProps = await getSafeProps(safeAddress, name, ownersNames, ownerAddresses)

      // returning info for testing purposes, in app is fully async
      return { safeAddress: safeProps.address, safeTx: receipt }
    })
    .catch(error => {
      debugger
      console.log(error)
    })

  return promiEvent
}

const Open = ({ addSafe, /* location, */ network, provider, userAccount }: Props) => {
  // const [safeProps, setSafeProps] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showProgress, setShowProgress] = useState()
  const [creationTxPromise, setCreationTxPromise] = useState()
  const [safeCreationPendingInfo, setSafeCreationPendingInfo] = useState()
  const [formValues, setFormValues] = useState()

  //------------------------------------------------
  // Check with Mikhail,
  // I think is is not being used.
  // at least, these params are not sent from the app
  // useEffect(() => {
  //   const query: SafePropsType = queryString.parse(location.search, { arrayFormat: 'comma' })
  //   const { name, owneraddresses, ownernames, threshold } = query

  //   if (validateQueryParams(owneraddresses, ownernames, threshold, name)) {
  //     setSafeProps({
  //       name,
  //       ownerAddresses: owneraddresses,
  //       ownerNames: ownernames,
  //       threshold,
  //     })
  //   }
  // }, [])

  // removeFromStorage(SAFE_PENDING_CREATION_HASH_STORAGE_KEY)

  // saveToStorage('SAFES', {
  //   '0x9B333A19Ecf0F2f5Fb61469FB17633AAE57972D7': {
  //     name: 'single:ac1',
  //     address: '0x9B333A19Ecf0F2f5Fb61469FB17633AAE57972D7',
  //     threshold: 1,
  //     ethBalance: '0',
  //     owners: [{ name: 'My Wallet', address: '0x9cf2288d8FA37051970AeBa88E8b4Fb5960c2385' }],
  //     activeTokens: [],
  //     blacklistedTokens: [],
  //     balances: { '0x000': '0' },
  //     nonce: 0,
  //     latestIncomingTxBlock: 0,
  //   },
  //   '0x1de8f9874A5b60C94304888f8B42dB21f06813e6': {
  //     name: 'single:ac2',
  //     address: '0x1de8f9874A5b60C94304888f8B42dB21f06813e6',
  //     threshold: 1,
  //     ethBalance: '0.91',
  //     owners: [{ name: 'UNKNOWN', address: '0xDe75665F3BE46D696e5579628fA17b662e6fC04e' }],
  //     activeTokens: [
  //       '0xEBe09eB3411D18F4FF8D859e096C533CAC5c6B60',
  //       '0xddea378A6dDC8AfeC82C36E9b0078826bf9e68B6',
  //       '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
  //       '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
  //       '0xEBf1A11532b93a529b5bC942B4bAA98647913002',
  //       '0x6e894660985207feb7cf89Faf048998c71E8EE89',
  //       '0xbF7A7169562078c96f0eC1A8aFD6aE50f12e5A99',
  //       '0xd6801a1DfFCd0a410336Ef88DeF4320D6DF1883e',
  //       '0x577D296678535e4903D59A4C929B718e1D575e0A',
  //       '0x6D7F0754FFeb405d23C51CE938289d4835bE3b14',
  //     ],
  //     blacklistedTokens: [],
  //     balances: {
  //       '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b': '400',
  //       '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa': '1',
  //       '0x000': '0',
  //     },
  //     nonce: 19,
  //     latestIncomingTxBlock: 6114840,
  //   },
  //   '0xF5DeC41B8597Bded2706a8D57FE011d25A138d6A': {
  //     name: 'multi:ac1-ac2',
  //     address: '0xF5DeC41B8597Bded2706a8D57FE011d25A138d6A',
  //     threshold: 2,
  //     ethBalance: '0',
  //     owners: [
  //       { name: 'ac1', address: '0x9cf2288d8FA37051970AeBa88E8b4Fb5960c2385' },
  //       { name: 'ac2', address: '0xDe75665F3BE46D696e5579628fA17b662e6fC04e' },
  //     ],
  //     activeTokens: ['0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa'],
  //     blacklistedTokens: [],
  //     balances: { '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa': '2', '0x000': '0' },
  //     nonce: 1,
  //     latestIncomingTxBlock: 6116050,
  //   },
  // })

  // check if there is a safe being created
  useEffect(() => {
    const load = async () => {
      const pendingCreation = await loadFromStorage(SAFE_PENDING_CREATION_HASH_STORAGE_KEY)
      if (pendingCreation) {
        setSafeCreationPendingInfo(pendingCreation)
        setShowProgress(true)
      } else {
        setShowProgress(false)
      }
      setLoading(false)
    }

    load()
  }, [])

  const createSafeProxy = (values = formValues) => {
    setFormValues(values)
    const promiEvent = createSafe(values, userAccount, addSafe)
    setCreationTxPromise(promiEvent)
    setShowProgress(true)
  }

  const onSafeCreated = async () => {
    const web3 = getWeb3()
    //let safeProps
    //let receipt

    // if (formValues) {
    //   const name = getSafeNameFrom(formValues)
    //   const ownersNames = getNamesFrom(formValues)
    //   const ownerAddresses = getAccountsFrom(formValues)
    //   receipt = await creationTxPromise
    //   safeProps = getSafeProps(receipt, name, ownersNames, ownerAddresses)
    //   addSafe(safeProps)
    // } else {
    const pendingCreation = await loadFromStorage(SAFE_PENDING_CREATION_HASH_STORAGE_KEY)
    const receipt = await web3.eth.getTransactionReceipt(pendingCreation.txHash)

    // get the address for the just created safe
    const events = web3.eth.abi.decodeLog(
      [
        {
          type: 'address',
          name: 'ProxyCreation',
        },
      ],
      receipt.logs[0].data,
      receipt.logs[0].topics,
    )

    const safeAddress = events[0]

    const safeProps = await getSafeProps(
      safeAddress,
      safeCreationPendingInfo.name,
      safeCreationPendingInfo.ownersNames,
      safeCreationPendingInfo.ownerAddresses,
    )
    addSafe(safeProps)

    removeFromStorage(SAFE_PENDING_CREATION_HASH_STORAGE_KEY)
    const url = {
      pathname: `${SAFELIST_ADDRESS}/${safeProps.address}/balances`,
      state: {
        name,
        tx: safeCreationPendingInfo.txHash,
      },
    }

    history.push(url)
  }

  if (loading || showProgress === undefined) {
    return <Loader />
  }

  return (
    <Page>
      {showProgress ? (
        <Opening
          creationTxHash={safeCreationPendingInfo ? safeCreationPendingInfo.txHash : undefined}
          onRetry={createSafeProxy}
          onSuccess={onSafeCreated}
          submittedPromise={creationTxPromise}
        />
      ) : (
        <Layout
          network={network}
          onCallSafeContractSubmit={createSafeProxy}
          provider={provider}
          // safeProps={safeProps}
          userAccount={userAccount}
        />
      )}
    </Page>
  )
}

export default connect(selector, actions)(withRouter(Open))
