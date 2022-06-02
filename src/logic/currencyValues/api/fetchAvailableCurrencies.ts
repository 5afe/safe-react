import axios from 'axios'

export const fetchAvailableCurrencies = async (): Promise<string[]> => {
  const [apiCurrencies, fiats] = await Promise.all([fetchApiCurrencies(), fetchFiats])
  return apiCurrencies.filter((currency) => fiats[currency])
}

export const fetchApiCurrencies = async (): Promise<string[]> => {
  const url = 'https://api.coingecko.com/api/v3/simple/supported_vs_currencies'
  const response = await axios.get<string[]>(url)
  return response.data.map((currency) => currency.toUpperCase())
}

type FiatData = {
  [currency: string]: string
}

export const fetchFiats = async (): Promise<FiatData> => {
  const url = 'https://openexchangerates.org/api/currencies.json'
  const response = await axios.get<FiatData>(url)
  return response.data
}
