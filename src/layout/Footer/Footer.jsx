import React from 'react'
import classes from './Footer.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(classes)

export const Footer = () => {
  return (
    <footer className={cx('footer')}>
      <p>Copyright&copy; 2025 Community Project Hub. All right reserved.</p>
    </footer>
  )
}
