import React from 'react'
import { ExclamationCircleFilled, CloseSquareOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import classes from './RegistRejectForm.module.css';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';
import { approveDenyRegistration } from '../../../services/RegistrationApi';
import { useNavigate, useParams } from 'react-router-dom';

const cx = classNames.bind(classes);
export const RegistRejectForm = (props) => {
  const [modal, contextHolder] = Modal.useModal();
  const navigate = useNavigate();
  const { projectId } = useParams();


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
      onOk: async () => {
        try {
          const payload = {
            "registrationId": props.registrationId,
            "type": 'Deny'
          }
          await approveDenyRegistration(payload);
          toast.success('Đã từ chối đơn đăng kí thành công');
          navigate(`/home-lecturer/project-registration/${projectId}`);
        } catch (error) {
          console.error("Lỗi khi từ chối đơn đăng kí:", error);
          toast.error(error.message || error.result);
        }
      },
    });
  };

  return (
    <>
      <CloseSquareOutlined className={cx('reject-icon')} onClick={confirm} />
      {contextHolder}
    </>
  );
}
