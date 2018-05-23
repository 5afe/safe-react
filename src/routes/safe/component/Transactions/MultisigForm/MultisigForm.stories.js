// @flow
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import Stepper from '~/components/Stepper'
import styles from '~/components/layout/PageFrame/index.scss'
import MultisigForm from './index'


const FrameDecorator = story => (
  <div className={styles.frame}>
    { story() }
  </div>
)

storiesOf('Components', module)
  .addDecorator(FrameDecorator)
  .add('MultisigForm', () => (
    <Stepper.Page>
      { MultisigForm }
    </Stepper.Page>
  ))
