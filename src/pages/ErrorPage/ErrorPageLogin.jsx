import React from 'react'
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import classes from './ErrorPage.module.css'
import classNames from 'classnames/bind';

const cx = classNames.bind(classes);

export const ErrorPageLogin = () => {
  const navigate = useNavigate();
  return (
    <div className={cx('error-page')}>
      <Result
        status="error"
        title="Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!"
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            Quay lại trang đăng nhập
          </Button>
        }
      />
    </div>

  )

}
