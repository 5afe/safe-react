import Footer from './index'
import CookiesBanner from 'src/components/CookiesBanner'
import { render, fireEvent, screen } from 'src/utils/test-utils'

describe('<Footer>', () => {
  it('Should render Footer component', () => {
    const { container } = render(<Footer />)

    const footerNode = container.querySelector('footer')

    expect(footerNode).toBeInTheDocument()
  })

  it('Should show footer links', () => {
    render(<Footer />)

    const gnosisCopyrightNode = screen.getByText(/©\d{4} cLabs/)

    expect(gnosisCopyrightNode).toBeInTheDocument()

    const termsLinkNode = screen.getByText('Terms')
    expect(termsLinkNode).toBeInTheDocument()

    const privacyLinkNode = screen.getByText('Privacy')
    expect(privacyLinkNode).toBeInTheDocument()

    const LicensesLinkNode = screen.getByText('Licenses')
    expect(LicensesLinkNode).toBeInTheDocument()

    const preferencesLinkNode = screen.getByText('Preferences')
    expect(preferencesLinkNode).toBeInTheDocument()
  })

  it('Should redirect to Terms and Conditions page in a new tab', () => {
    render(<Footer />)

    const termsLinkNode = screen.getByText('Terms')

    expect(termsLinkNode).toHaveAttribute('href', 'https://clabs.co/terms')
    expect(termsLinkNode).toHaveAttribute('target', '_blank')
  })

  it('Should redirect to Privacy Policy page in a new tab', () => {
    render(<Footer />)

    const privacyLinkNode = screen.getByText('Privacy')

    expect(privacyLinkNode).toHaveAttribute('href', 'https://clabs.co/privacy')
    expect(privacyLinkNode).toHaveAttribute('target', '_blank')
  })

  it('Should redirect to Licenses page in a new tab', () => {
    render(<Footer />)

    const LicensesLinkNode = screen.getByText('Licenses')

    expect(LicensesLinkNode).toHaveAttribute('href', 'https://github.com/celo-org/safe-react/blob/dev/LICENSE.md')
    expect(LicensesLinkNode).toHaveAttribute('target', '_blank')
  })

  it('Should show preference cookies banner form when clicks on Preferences Link', () => {
    render(
      <>
        <Footer />
        <CookiesBanner />
      </>,
    )

    expect(screen.queryByTestId('cookies-banner-form')).not.toBeInTheDocument()

    const preferencesCookiesNode = screen.getByText('Preferences')

    fireEvent.click(preferencesCookiesNode)

    expect(screen.queryByTestId('cookies-banner-form')).toBeInTheDocument()
  })

  it('Should show the current Safe React version if its defined in environment variables', () => {
    process.env.REACT_APP_APP_VERSION = '1.1.1'

    render(<Footer />)

    const safeReactVersionNode = screen.getByText('v1.1.1')

    expect(safeReactVersionNode).toBeInTheDocument()
    expect(safeReactVersionNode).toHaveAttribute('href', 'https://github.com/celo-org/safe-react/releases')
    expect(safeReactVersionNode).toHaveAttribute('target', '_blank')
  })

  it('should show Versions text if no version of Safe React is defined', () => {
    process.env.REACT_APP_APP_VERSION = undefined

    render(<Footer />)

    const safeReactVersionNode = screen.getByText('Versions')

    expect(safeReactVersionNode).toBeInTheDocument()
    expect(safeReactVersionNode).toHaveAttribute('href', 'https://github.com/celo-org/safe-react/releases')
    expect(safeReactVersionNode).toHaveAttribute('target', '_blank')
  })
})
