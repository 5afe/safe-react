// @flow
import { type Match } from 'react-router-dom'

export const buildMathPropsFrom = (address: string): Match => ({
  params: {
    address,
  },
  isExact: true,
  path: '',
  url: '',
})
