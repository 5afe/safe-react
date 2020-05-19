export const enhancedFetch = async (url, errMsg) => {
  const header = new Headers({
    'Access-Control-Allow-Origin': '*',
  })

  const sentData: any = {
    mode: 'cors',
    header,
  }

  const response = await fetch(url, sentData)
  if (!response.ok) {
    return Promise.reject(new Error(errMsg))
  }

  return Promise.resolve(response.json())
}
