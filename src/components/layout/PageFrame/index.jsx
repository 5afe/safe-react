import React from 'react'
import styles from './index.css';

const PageFrame = ({ children }) => (
  <main className={styles.container}>
    { children }
  </main>
)

export default PageFrame
