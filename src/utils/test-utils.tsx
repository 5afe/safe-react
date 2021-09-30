import { ReactElement } from 'react'
import { render, RenderResult } from '@testing-library/react'
import { theme as styledTheme } from '@gnosis.pm/safe-react-components'
import Providers from 'src/components/Providers'
import { createCustomStore, store } from 'src/store'
import { history } from 'src/routes/routes'
import theme from 'src/theme/mui'
import { makeProvider } from 'src/logic/wallets/store/model/provider'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function renderWithProviders(Components: ReactElement, customState?: any): RenderResult {
  const customStore = {
    ...customState,
    providers: makeProvider(customState?.providers),
  }
  const testStore = customState ? createCustomStore(customStore) : store
  return render(
    <Providers store={testStore} history={history} styledTheme={styledTheme} muiTheme={theme}>
      {Components}
    </Providers>,
  )
}

export * from '@testing-library/react'
export { renderWithProviders as render }
