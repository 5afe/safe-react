import React, { ReactElement } from 'react'
import { render, RenderResult } from '@testing-library/react'
import { theme as styledTheme } from '@gnosis.pm/safe-react-components'
import Providers from 'src/components/Providers'
import { history, store } from 'src/store'
import theme from 'src/theme/mui'

function renderWithProviders(Components: ReactElement): RenderResult {
  return render(
    <Providers store={store} history={history} styledTheme={styledTheme} muiTheme={theme}>
      {Components}
    </Providers>,
  )
}

export { renderWithProviders }
