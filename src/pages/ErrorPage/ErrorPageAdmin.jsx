import React from 'react'
import { Button, Result } from 'antd';
import { useNavigate, useRouteError } from 'react-router-dom';
import classes from './ErrorPage.module.css'
import classNames from 'classnames/bind';

const cx = classNames.bind(classes);
export const ErrorPageAdmin = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  let message = "Xin lỗi, trang bạn truy cập không tồn tại.";

  if (error.status === 500) {
    message = JSON.parse(error.data).message;
  }

  if (error.status === 404) {

    message = "Không tìm thấy tài nguyên hoặc trang bạn yêu cầu.";
  }
  return (
    <div className={cx('error-page')}>
      <Result
        status={error.status || "404"}
        title={error.status || "404"}
        subTitle={message}
        extra={<Button type="primary" onClick={() => navigate('/home-admin')}>Trở về</Button>}
      />
    </div>

  )
}
