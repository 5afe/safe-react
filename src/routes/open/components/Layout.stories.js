// @flow
import { storiesOf } from '@storybook/react'
import { State, Store } from '@sambego/storybook-state'
import * as React from 'react'
import styles from '~/components/layout/PageFrame/index.scss'
import { getAccountsFrom, getThresholdFrom } from '~/routes/open/utils/safeDataExtractor'
import Web3Integration from '~/logic/wallets/web3Integration'
import { sleep } from '~/utils/timer'
import Component from './Layout'

const FrameDecorator = (story) => <div className={styles.frame}>{story()}</div>

const store = new Store({
  safeAddress: '',
  safeTx: '',
})

storiesOf('Routes /open', module)
  .addDecorator(FrameDecorator)
  .add('Open safe with all props set', () => {
    Web3Integration.getProviderInfo()
    const provider = 'METAMASK'
    const userAccount = '0x03db1a8b26d08df23337e9276a36b474510f0023'
    const onCallSafeContractSubmit = async (values: Object): Promise<void> => {
      const accounts = getAccountsFrom(values)
      const numConfirmations = getThresholdFrom(values)
      const data = {
        userAccount,
        accounts,
        requiredConfirmations: numConfirmations,
      }
      // eslint-disable-next-line
      console.log(`Generating and sending a eth tx based on: ${JSON.stringify(data, null, 2)}`)

      await sleep(3000)

      store.set({
        safeAddress: '0x03db1a8b26d08df23337e9276a36b474510f0025',
        // eslint-disable-next-line
        safeTx: {
          transactionHash: '0x4603de1ab6a92b4ee1fd67189089f5c02f5df5d135bf85af84083c27808c0544',
          transactionIndex: 0,
          blockHash: '0x593ce7d85fef2a492e8f759f485c8b66ff803773e77182c68dd45c439b7a956d',
          blockNumber: 19,
          gasUsed: 3034193,
          cumulativeGasUsed: 3034193,
          contractAddress: '0xfddda33736fb95b587cbfecc1ff4a50f717adc00',
          logs: [],
          status: '0x01',
          logsBloom:
            '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        },
      })
    }

    return (
      <State store={store}>
        <Component
          network="rinkeby"
          provider={provider}
          userAccount={userAccount}
          safeAddress={store.get('safeAddress')}
          safeTx={store.get('safeTx')}
          onCallSafeContractSubmit={onCallSafeContractSubmit}
        />
      </State>
    )
  })
