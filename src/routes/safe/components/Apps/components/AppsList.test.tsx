import AppsList from './AppsList'
import { render, screen } from 'src/utils/test-utils'

const customState = {
  router: {
    location: {
      pathname: '/apps',
    },
  },
}

describe('Safe Apps -> AppsList -> Search', () => {
  it('Shows apps matching the search query', () => {
    render(<AppsList />, customState)
  })

  it('Shows app matching the name first for a query that matches in name and description of multiple apps', () => {
    render(<AppsList />, customState)
  })

  it('Shows "no apps found" message when not able to find apps matching the query', () => {
    render(<AppsList />, customState)
  })

  it('Clears the search result when you press on clear button and shows all apps again', () => {
    render(<AppsList />, customState)
  })
})
