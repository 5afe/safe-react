// @flow
import * as React from 'react'
import Paragraph from '~/components/layout/Paragraph'
import OpenPaper from '../OpenPaper'

const SafeNameForm = () => () => (
  <OpenPaper>
    <Paragraph size="md" color="primary">
      This setup will create a Safe with one or more owners. Optionally give the Safe a local name.
      By continuing you consent with the terms of use and privacy policy.
    </Paragraph>
    <Paragraph size="md" color="primary" weight="bolder">
      &#9679; I understand that my funds are held securely in my Safe. They cannot be accessed by Gnosis.
    </Paragraph>
    <Paragraph size="md" color="primary" weight="bolder">
      &#9679; My Safe is a smart contract on the Ethereum blockchain.
    </Paragraph>
  </OpenPaper>
)

export default SafeNameForm
