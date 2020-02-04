// @flow
import React from 'react'

export const SafeDetailsIcon = (props: Props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <g fill="none" fillRule="evenodd">
      <path d="M0 0h24v24H0z" />
      <rect width="2" height="8" x="11" y="10" className="fill" rx="1" />
      <path className="fill" fillRule="nonzero" d="M12 5.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" />
      <path
        className="fill"
        fillRule="nonzero"
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-2a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
      />
    </g>
  </svg>
)
