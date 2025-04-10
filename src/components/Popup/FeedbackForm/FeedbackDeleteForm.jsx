import React from 'react'
import { ExclamationCircleFilled, CloseSquareOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import classes from './FeedbackDeleteForm.module.css';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';
import { approveDenyRegistration } from '../../../services/RegistrationApi';
import { useNavigate, useParams } from 'react-router-dom';

const cx = classNames.bind(classes);
export const FeedbackDeleteForm = (props) => {
  const [modal, contextHolder] = Modal.useModal();
  const navigate = useNavigate();
  const { projectId } = useParams();


  const confirm = () => {
    modal.confirm({
      title: 'Xóa câu hỏi',
      icon: <ExclamationCircleFilled style={{ color: 'red' }} />,
      content: 'Bạn chắc chắn xóa câu hỏi này?',
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
          toast.success('Xóa câu hỏi thành công');
          // Gọi lại hàm refreshTable để render lại danh sách đăng ký
          props.refreshTable();
          navigate(`/home-lecturer/project-registration/${projectId}`);
        } catch (error) {
          console.error("Lỗi xóa câu hỏi:", error);
          toast.error(error.message || error.result);
        }
      },
    });
  };

  return (
    <>
      <button className={cx('delete-feedback-button')} onClick={confirm}>
        <DeleteOutlined style={{ marginRight: '8px' }} /> Xóa
      </button>
      {contextHolder}
    </>
  );
}
