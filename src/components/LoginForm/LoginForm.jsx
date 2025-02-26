import React, { useState } from 'react'
import classes from './LoginForm.module.css'
import classNames from 'classnames/bind'
import loginImg from '../../assets/login-img.png';
import loginImg2 from '../../assets/logo-transparent.png'
import { LockFilled, MailFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { CircularProgress } from '@mui/material';


const cx = classNames.bind(classes)

export const LoginForm = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);




  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    await login(email, password);

    setIsLoading(false);
  };

  return (
    <div className={cx('login-form-backdrop')}>
      <div className={cx('login-form-container')}>
        <h3 className={cx('login-form-title')}>Đăng nhập</h3>
        <div className={cx('login-form-content')}>
          <form className={cx('login-form')} onSubmit={handleSubmit}>
            <div className={cx('input-group')}>
              <div className={cx('input-container')}>
                <MailFilled />
                <input
                  type="text"
                  className={cx('email-input', "input")}
                  placeholder="Email or Tên tài khoản"
                  name='email'
                  id='email'
                  required
                />
              </div>
              <div className={cx('input-container')}>
                <LockFilled />
                <input
                  type="password"
                  className={cx('password-input', "input")}
                  placeholder="Mật khẩu"
                  name='password'
                  id='password'
                  required
                />
              </div>
            </div>
            <Link to="/forgot-password" className={cx('forgot-password')}>Quên Mật Khẩu ?</Link>
            <button className={cx('login-button')} type="submit" disabled={isLoading}>
              {isLoading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CircularProgress size={24} sx={{ color: "white" }} />
                </div>
              ) : (
                "ĐĂNG NHẬP"
              )}
            </button>
          </form>
          <div className={cx('login-form-image')}>
            <img src={loginImg} alt="" className={cx('login-img')} />
            <h2 style={{ color: '#4e9bbb', fontSize: "20px", fontWeight: "600" }}>Community Project Hub</h2>
          </div>
        </div>
      </div>
    </div>
  )
}
