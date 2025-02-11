import React from 'react'
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

export const ErrorPageLogin = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="error"
      title="Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!"
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          Quay lại trang đăng nhập
        </Button>
      }
    />
  )

}
