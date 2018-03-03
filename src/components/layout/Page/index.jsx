import React from 'react'
import Header from '../../Header'
import './index.css'

const Page = ({children}) => (
  <div className="page">
    <Header />
    {children}
  </div>
)

export default Page
