export const copyToClipboard = (text) => {
  const range = document.createRange()
  range.selectNodeContents(document.body)
  document.getSelection().addRange(range)

  function listener(e) {
    e.clipboardData.setData('text/plain', text)
    e.preventDefault()
  }
  document.addEventListener('copy', listener)
  document.execCommand('copy')
  document.removeEventListener('copy', listener)

  document.getSelection().removeAllRanges()
}
