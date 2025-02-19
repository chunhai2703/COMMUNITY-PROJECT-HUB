import React from 'react'
import { DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import classes from './RegistRemoveForm.module.css';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';
import { removeRegistration } from '../../../services/RegistrationApi';

const cx = classNames.bind(classes);

export const RegistRemoveForm = (props) => {
  const [modal, contextHolder] = Modal.useModal();

  const confirm = () => {
    modal.confirm({
      title: 'Hủy đơn đăng kí',
      icon: <WarningOutlined style={{ color: 'red' }} />,
      content: 'Bạn chắc chắn hủy đơn đăng kí này?',
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      centered: true,
      okButtonProps: { className: cx('ok-button') },
      cancelButtonProps: { className: cx('cancel-button') },
      onOk: async () => {
        try {
          await removeRegistration(props.registrationId);
          toast.success('Đã từ chối đơn đăng kí thành công');
          window.location.reload();
        } catch (error) {
          console.error("Lỗi khi hủy đơn đăng kí:", error);
          toast.error(error.message);
        }
      },
    });
  };

  return (
    <>
      <DeleteOutlined className={cx('delete-icon')} onClick={confirm} />
      {contextHolder}
    </>
  );
}
