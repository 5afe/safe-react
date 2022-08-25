import { render, screen, fireEvent, within, act, waitFor } from 'src/utils/test-utils'
import AppFrame from './AppFrame'
import axios from 'axios'
import * as safeAppsUtils from 'src/routes/safe/components/Apps/utils'

jest.mock('axios')

describe('Safe Apps -> AppFrame', () => {
  beforeEach(() => {
    // @ts-ignore
    safeAppsUtils.canLoadAppImage = jest.fn().mockResolvedValue(true)
    // @ts-ignore
    axios.get.mockImplementation((url: string) => {
      return Promise.resolve({
        data: {
          name: 'Safe Test App',
          description: 'Safe Test App description',
          iconPath: '/image-path.svg',
        },
      })
    })
  })

  it('should render the correct allow attribute', async () => {
    render(<AppFrame appUrl="http://test.eth" allowedFeaturesList="camera; microphone" />)

    const iframeElement = await screen.findByTitle('Safe Test App')

    expect(iframeElement).toBeInTheDocument()
    expect(iframeElement).toHaveAttribute('allow', 'camera; microphone')
  })
})
