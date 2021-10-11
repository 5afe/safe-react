const surface01dp = '#fff'
const background = '#f7f5f5'
const border = '#e8e7e6'
const connectedColor = '#008C73'
const disabled = '#5D6D74'
const errorColor = '#f02525'
const fancyColor = '#f02525'
const fontColor = '#001428'
const headerHeight = '52px'
const lg = '24px'
const marginButtonImg = '12px'
const md = '16px'
const primary = '#001428'
const secondary = '#008C73'
const secondaryTextOrSvg = '#B2B5B2'
const secondaryBackground = '#f0efee'
const sm = '8px'
const warningColor = '#ffc05f'
const xl = '32px'
const xs = '4px'
const xxl = '40px'

const darkColors = {
  surface01dp: '#1e1e1e',
  background: '#1C1C1E',
  border: '#3A3A3C',
  disabled: '#8D8D93',
  errorColor: '#FF453A',
  primary: '#FFFFFF',
  secondary: '#029F7F',
  secondaryTextOrSvg: '#626269',
  secondaryBackground: '#2C2C2E',
  warningColor, // default
}

module.exports = {
  background,
  boldFont: 700,
  bolderFont: 500,
  border,
  buttonLargeFontSize: '16px',
  connected: connectedColor,
  disabled,
  error: errorColor,
  extraBoldFont: 800,
  extraLargeFontSize: '20px',
  extraSmallFontSize: '11px',
  fancy: fancyColor,
  fontColor,
  fontSizeHeadingLg: 32,
  fontSizeHeadingMd: 20,
  fontSizeHeadingSm: 16,
  fontSizeHeadingXs: 13,
  headerHeight,
  largeFontSize: '16px',
  lg,
  lightFont: 300,
  mainFontFamily: 'Averta, sans-serif',
  marginButtonImg,
  md,
  mediumFontSize: '14px',
  primary,
  prefersDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  regularFont: 400,
  screenLg: 1200,
  screenMd: 992,
  screenMdMax: 1199,
  screenSm: 768,
  screenSmMax: 991,
  screenXs: 480,
  screenXsMax: 767,
  secondary,
  secondaryFontFamily: 'Averta, monospace',
  secondaryText: secondaryTextOrSvg,
  secondaryBackground,
  sm,
  smallFontSize: '12px',
  warning: warningColor,
  xl,
  xs,
  xxl,
  xxlFontSize: '32px',
  darkColors,
  surface01dp,
}
