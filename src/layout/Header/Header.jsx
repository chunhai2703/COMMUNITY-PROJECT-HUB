import React from 'react'
import logo from '../../assets/logo-fpt.png'
import classes from './Header.module.css'
import classNames from 'classnames/bind'
import { BellOutlined } from '@ant-design/icons'
import Avatar from 'antd/es/avatar/avatar'
import { Badge } from 'antd'


const cx = classNames.bind(classes)

export const Header = () => {
  return (
    <header className={cx('header')}>
      <img src={logo} alt="logo" className={cx('logo')} />
      <nav className={cx('nav')}>
        <ul className={cx('nav-list')}>
          <li>
            <div className={cx('nav-item-notification')}>
              <Badge count={5} size="small">
                <BellOutlined style={{ fontSize: 25, color: 'white' }} />
              </Badge>
              <span>Thông báo</span>

            </div>
          </li>
          <li>
            <div className={cx('nav-item-avatar')}>
              <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }} size={50}>V</Avatar>
              <div className={cx('user-info')}>
                <p>Võ Nguyễn Trung Hải</p>
                <button>Log out</button>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </header >
  )
}
