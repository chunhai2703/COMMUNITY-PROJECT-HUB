import { Button, Result } from 'antd'
import React from 'react'
export const ErrorPage = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
      extra={<Button type="primary" onClick={() => window.location.href = '/'}>Quay về</Button>}
    />
  )
}
