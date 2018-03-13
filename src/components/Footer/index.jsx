// @flow
import React from 'react'
import { Link } from 'react-router-dom'
import styles from './index.scss'

const Footer = () => (
  <footer className={styles.footer}>
    <div>
      <Link to="/wallet">
        Wallet
      </Link>
      <Link to="/transactions">
        Transactions
      </Link>
      <Link to="/settings">
        Settings
      </Link>
    </div>
  </footer>
)

export default Footer
