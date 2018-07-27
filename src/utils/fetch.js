// @flow

export const enhancedFetch = async (url: string, errMsg: string) => {
  const header = new Headers({
    'Access-Control-Allow-Origin': '*',
  })

  const sentData = {
    mode: 'cors',
    header,
  }

  const response = await fetch(url, sentData)
  if (!response.ok) {
    throw new Error(errMsg)
  }

  return response.json()
}
