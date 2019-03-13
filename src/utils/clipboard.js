// @flow

export const copyToClipboard = (text: string) => {
  if (!navigator.clipboard) {
    return
  }

  try {
    navigator.clipboard.writeText(text)
  } catch (err) {
    console.error(err.message)
  }
}
