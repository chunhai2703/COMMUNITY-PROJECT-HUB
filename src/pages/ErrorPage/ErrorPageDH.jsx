import React from 'react'
import { Button, Result } from 'antd';
import { useNavigate, useRouteError } from 'react-router-dom';
export const ErrorPageDH = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  let message = "Đã xảy ra lỗi !";

  if (error.status === 500) {
    message = JSON.parse(error.data).message;
  }

  if (error.status === 404) {

    message = "Không tìm thấy tài nguyên hoặc trang bạn yêu cầu.";
  }
  return (
    <Result
      status={error.status || "404"}
      title={error.status || "404"}
      subTitle={message || "Xin lỗi, trang bạn truy cập không tồn tại."}
      extra={<Button type="primary" onClick={() => navigate('/home-department-head')}>Trở về</Button>}
    />
  )
}
