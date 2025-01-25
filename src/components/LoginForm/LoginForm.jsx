import React from 'react'
import classes from './LoginForm.module.css'
import classNames from 'classnames/bind'
import loginImg from '../../assets/login-img.png';
import { LockFilled, MailFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const cx = classNames.bind(classes)

export const LoginForm = () => {
  return (
    <div className={cx('login-form-backdrop')}>
      <div className={cx('login-form-container')}>
        <h3 className={cx('login-form-title')}>Đăng nhập</h3>
        <div className={cx('login-form-content')}>
          <form className={cx('login-form')}>
            <div className={cx('input-group')}>
              <div className={cx('input-container')}>
                <MailFilled />
                <input type="text" className={cx('email-input', "input")} placeholder="Email" name='email' id='email' />
              </div>
              <div className={cx('input-container')}>
                <LockFilled />
                <input type="password" className={cx('password-input', "input")} placeholder="Mật khẩu" name='password' id='password' />
              </div>
            </div>
            <Link to="/forgot-password" className={cx('forgot-password')}>Quên Mật Khẩu ?</Link>
            <button className={cx('login-button')} type='submit'>Đăng Nhập</button>
          </form>
          <div className={cx('login-form-image')}>
            <img src={loginImg} alt="" className={cx('login-img')} />
            <p className={cx('no-account')}>Bạn không có tài khoản ?</p>
          </div>

        </div>
      </div>

    </div>
  )
}
