// @flow
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styles from '~/components/layout/PageFrame/index.scss'
import Layout from './Layout'
import ProviderAccesible from './ProviderInfo/ProviderAccesible'
import UserDetails from './ProviderDetails/UserDetails'
import ProviderDisconnected from './ProviderInfo/ProviderDisconnected'
import ConnectDetails from './ProviderDetails/ConnectDetails'

const FrameDecorator = story => (
  <div className={styles.frame}>
    { story() }
  </div>
)

storiesOf('Components /Header', module)
  .addDecorator(FrameDecorator)
  .add('Connected', () => {
    const provider = 'Metamask'
    const userAddress = '0x873faa4cddd5b157e8e5a57e7a5479afc5d30moe'
    const network = 'RINKEBY'
    const info = <ProviderAccesible provider={provider} network={network} userAddress={userAddress} connected />
    const details = <UserDetails provider={provider} network={network} userAddress={userAddress} connected />

    return <Layout providerInfo={info} providerDetails={details} />
  })
  .add('Disconnected', () => {
    const info = <ProviderDisconnected />
    const details = <ConnectDetails />

    return <Layout providerInfo={info} providerDetails={details} />
  })
  .add('Connection Error', () => {
    const provider = 'Metamask'
    const userAddress = '0x873faa4cddd5b157e8e5a57e7a5479afc5d30moe'
    const network = 'RINKEBY'
    const info = <ProviderAccesible provider={provider} network={network} userAddress={userAddress} connected={false} />
    const details = (<UserDetails
      provider={provider}
      network={network}
      userAddress={userAddress}
      connected={false}
    />)

    return <Layout providerInfo={info} providerDetails={details} />
  })
