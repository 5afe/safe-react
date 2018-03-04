import React from 'react'
import Header from '../../Header'
import styles from './index.css';

const Page = ({children}) => (
  <div className={styles.page}>
    <Header />
    {children}
  </div>
)

export default Page
