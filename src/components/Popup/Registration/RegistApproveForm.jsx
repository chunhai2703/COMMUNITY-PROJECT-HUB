import React from 'react'
import { CheckCircleFilled, CheckSquareOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import classes from './RegistApproveForm.module.css';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { approveDenyRegistration } from '../../../services/RegistrationApi';

const cx = classNames.bind(classes);
export const RegistApproveForm = (props) => {
  const [modal, contextHolder] = Modal.useModal();
  const navigate = useNavigate();

  const confirm = () => {
    modal.confirm({
      title: 'Duyệt đơn đăng kí',
      icon: <CheckCircleFilled style={{ color: 'rgb(11, 177, 11)' }} />,
      content: 'Bạn chắc chắn duyệt đơn đăng kí này?',
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      centered: true,
      okButtonProps: { className: cx('ok-button') },
      cancelButtonProps: { className: cx('cancel-button') },
      onOk: async () => {
        try {
          const payload = {
            "registrationId": props.registrationId,
            "type": 'Approve'
          }
          await approveDenyRegistration(payload);
          toast.success('Đã duyệt đơn đăng kí thành công');
          window.location.reload();
        } catch (error) {
          console.error("Lỗi khi duyệt đơn đăng kí:", error);
          toast.error(error.message);
        }
      },
    });
  };

  return (
    <>
      <CheckSquareOutlined className={cx('approve-icon')} onClick={confirm} />
      {contextHolder}
    </>
  );
}
