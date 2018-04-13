// @flow
import { List } from 'immutable'
import * as React from 'react'
import NoSafe from '~/components/NoSafe'
import { type Safe } from '~/routes/safe/store/model/safe'
import SafeTable from '~/routes/safeList/components/SafeTable'

type Props = {
  safes: List<Safe>,
  provider: string,
}

const SafeList = ({ safes, provider }: Props) => {
  const safesAvailable = safes && safes.count() > 0

  return (
    <React.Fragment>
      { safesAvailable
        ? <SafeTable safes={safes} />
        : <NoSafe provider={provider} text="No safes created, please create a new one" />
      }
    </React.Fragment>
  )
}

export default SafeList
