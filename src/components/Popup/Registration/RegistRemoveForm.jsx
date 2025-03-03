import React from 'react'
import { DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import classes from './RegistRemoveForm.module.css';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';
import { removeRegistration } from '../../../services/RegistrationApi';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

const cx = classNames.bind(classes);

export const RegistRemoveForm = (props) => {
  const [modal, contextHolder] = Modal.useModal();
  const navigate = useNavigate();
  const { user } = useAuth();

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
          toast.success('Đã hủy đơn đăng kí thành công');
          if (user && (user?.roleId === 1)) {
            navigate(`/home-student/my-registration`);
          } else if (user && (user?.roleId === 2)) {
            navigate(`/home-lecturer/my-registration`);
          }
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
