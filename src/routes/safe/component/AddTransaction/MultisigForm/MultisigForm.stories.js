// @flow
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import Stepper from '~/components/Stepper'
import styles from '~/components/layout/PageFrame/index.scss'
import MultisigForm from './index'


const FrameDecorator = story => (
  <div className={styles.frame} style={{ textAlign: 'center' }}>
    { story() }
  </div>
)

storiesOf('Components', module)
  .addDecorator(FrameDecorator)
  .add('MultisigForm', () => (
    <Stepper
      finishedTransaction={false}
      finishedButton={<Stepper.FinishButton title="SEE TXS" />}
      onSubmit={() => {}}
      steps={['Multisig TX Form', 'Review TX']}
      onReset={() => {}}
    >
      <Stepper.Page balance={10}>
        { MultisigForm }
      </Stepper.Page>
    </Stepper>
  ))
