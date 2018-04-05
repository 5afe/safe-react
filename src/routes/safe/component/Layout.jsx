// @flow
import * as React from 'react'
import NoSafe from '~/components/NoSafe'
import { type SelectorProps } from '~/routes/safe/container/selector'
import { type Safe } from '~/routes/safe/store/model/safe'

type Props = SelectorProps

type SafeProps = {
  safe: Safe,
}

const GnoSafe = ({ safe }: SafeProps) => (
  <div>Hello I am a safe: {safe.get('address')}</div>
)

const Layout = ({ safe }: Props) => (
  <React.Fragment>
    { safe
      ? <GnoSafe safe={safe} />
      : <NoSafe text="Not found safe" />
    }
  </React.Fragment>
)

export default Layout
