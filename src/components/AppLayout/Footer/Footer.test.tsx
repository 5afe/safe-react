import Footer from './index'
import { render, fireEvent, screen } from 'src/utils/test-utils'

describe('<Footer>', () => {
  it('Should render Footer component', () => {
    const { container } = render(<Footer />)

    const footerNode = container.querySelector('footer')

    expect(footerNode).toBeInTheDocument()
  })

  it('Should show footer links', () => {
    render(<Footer />)

    const gnosisCopyrightNode = screen.getByText(/©\d{4} Gnosis/)

    expect(gnosisCopyrightNode).toBeInTheDocument()

    const termsLinkNode = screen.getByText('Terms')
    expect(termsLinkNode).toBeInTheDocument()

    const privacyLinkNode = screen.getByText('Privacy')
    expect(privacyLinkNode).toBeInTheDocument()

    const LicensesLinkNode = screen.getByText('Licenses')
    expect(LicensesLinkNode).toBeInTheDocument()

    const imprintLinkNode = screen.getByText('Imprint')
    expect(imprintLinkNode).toBeInTheDocument()

    const cookiePolicyLinkNode = screen.getByText('Cookie Policy')
    expect(cookiePolicyLinkNode).toBeInTheDocument()

    const preferencesLinkNode = screen.getByText('Preferences')
    expect(preferencesLinkNode).toBeInTheDocument()
  })

  it('Should redirect to Terms and Conditions page in a new tab', () => {
    render(<Footer />)

    const termsLinkNode = screen.getByText('Terms')

    expect(termsLinkNode).toHaveAttribute('href', 'https://www.enya.ai/utility/terms')
    expect(termsLinkNode).toHaveAttribute('target', '_blank')
  })

  it('Should redirect to Privacy Policy page in a new tab', () => {
    render(<Footer />)

    const privacyLinkNode = screen.getByText('Privacy')

    expect(privacyLinkNode).toHaveAttribute('href', 'https://www.enya.ai/utility/privacy')
    expect(privacyLinkNode).toHaveAttribute('target', '_blank')
  })

  it('Should redirect to Licenses page in a new tab', () => {
    render(<Footer />)

    const LicensesLinkNode = screen.getByText('Licenses')

    expect(LicensesLinkNode).toHaveAttribute('href', 'https://gnosis-safe.io/licenses')
    expect(LicensesLinkNode).toHaveAttribute('target', '_blank')
  })

  it('Should redirect to Imprint page in a new tab', () => {
    render(<Footer />)

    const imprintLinkNode = screen.getByText('Imprint')

    expect(imprintLinkNode).toHaveAttribute('href', 'https://www.enya.ai/company/contact')
    expect(imprintLinkNode).toHaveAttribute('target', '_blank')
  })

  it('Should redirect to Cookie Policy page in a new tab', () => {
    render(<Footer />)

    const cookiePolicyLinkNode = screen.getByText('Cookie Policy')

    expect(cookiePolicyLinkNode).toHaveAttribute('href', 'https://gnosis-safe.io/cookie')
    expect(cookiePolicyLinkNode).toHaveAttribute('target', '_blank')
  })

  it('Should show the current Safe React version if its defined in environment variables', () => {
    process.env.REACT_APP_APP_VERSION = '1.1.1'

    render(<Footer />)

    const safeReactVersionNode = screen.getByText('v1.1.1')

    expect(safeReactVersionNode).toBeInTheDocument()
    expect(safeReactVersionNode).toHaveAttribute('href', 'https://github.com/gnosis/safe-react/releases')
    expect(safeReactVersionNode).toHaveAttribute('target', '_blank')
  })

  it('should show Versions text if no version of Safe React is defined', () => {
    process.env.REACT_APP_APP_VERSION = undefined

    render(<Footer />)

    const safeReactVersionNode = screen.getByText('Versions')

    expect(safeReactVersionNode).toBeInTheDocument()
    expect(safeReactVersionNode).toHaveAttribute('href', 'https://github.com/gnosis/safe-react/releases')
    expect(safeReactVersionNode).toHaveAttribute('target', '_blank')
  })
})
