// @flow
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import Stepper from '~/components/Stepper'
import styles from '~/components/layout/PageFrame/index.scss'
import WithdrawForm from './index'


const FrameDecorator = story => (
  <div className={styles.frame} style={{ textAlign: 'center' }}>
    { story() }
  </div>
)

storiesOf('Components', module)
  .addDecorator(FrameDecorator)
  .add('WithdrawForm', () => (
    <Stepper
      finishedTransaction={false}
      finishedButton={<Stepper.FinishButton title="RESET" />}
      onSubmit={() => {}}
      steps={['Fill Withdraw Form', 'Review Withdraw']}
      onReset={() => {}}
    >
      <Stepper.Page dailyLimit={10} spentToday={7}>
        { WithdrawForm }
      </Stepper.Page>
    </Stepper>
  ))
