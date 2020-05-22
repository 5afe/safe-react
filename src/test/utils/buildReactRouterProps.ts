// 
import { } from 'react-router-dom'

export const buildMatchPropsFrom = (address) => ({
  params: {
    address,
  },
  isExact: true,
  path: '',
  url: '',
})
