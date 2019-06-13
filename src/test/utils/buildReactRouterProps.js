// @flow
import { type Match } from 'react-router-dom'

export const buildMatchPropsFrom = (address: string): Match => ({
  params: {
    address,
  },
  isExact: true,
  path: '',
  url: '',
})
