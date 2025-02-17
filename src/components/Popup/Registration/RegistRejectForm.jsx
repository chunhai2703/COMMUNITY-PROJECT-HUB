import React from 'react'
import { ExclamationCircleFilled, CloseSquareOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import classes from './RegistRejectForm.module.css';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const cx = classNames.bind(classes);
export const RegistRejectForm = () => {
  const [modal, contextHolder] = Modal.useModal();
  const navigate = useNavigate();

  const confirm = () => {
    modal.confirm({
      title: 'Từ chối đơn đăng kí',
      icon: <ExclamationCircleFilled style={{ color: 'red' }} />,
      content: 'Bạn chắc chắn từ chối đơn đăng kí này?',
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      centered: true,
      okButtonProps: { className: cx('ok-button') },
      cancelButtonProps: { className: cx('cancel-button') },
      // onOk: async () => {
      //   try {
      //     await unActiveProject(params.projectId);
      //     toast.success('Vô hiệu hóa dự án thành công');
      //     navigate(`/home-department-head/projects`);
      //   } catch (error) {
      //     toast.error('Không thể vô hiệu hóa dự án');
      //   }
      // },
    });
  };

  return (
    <>
      <CloseSquareOutlined className={cx('reject-icon')} onClick={confirm} />
      {contextHolder}
    </>
  );
}
