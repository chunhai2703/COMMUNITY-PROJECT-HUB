import React from 'react'
import { ExclamationCircleFilled, MinusCircleOutlined } from '@ant-design/icons';
import { Modal, Tooltip } from 'antd';
import classes from './FeedbackDeleteForm.module.css';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { deleteAnswerOfQuestion } from '../../../services/FeedbackApi';

const cx = classNames.bind(classes);
export const AnswerDeleteForm = (props) => {
  const [modal, contextHolder] = Modal.useModal();
  const navigate = useNavigate();


  const confirm = () => {
    modal.confirm({
      title: 'Xóa câu trả lời',
      icon: <ExclamationCircleFilled style={{ color: 'red' }} />,
      content: 'Bạn chắc chắn xóa câu trả lời này?',
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      centered: true,
      okButtonProps: { className: cx('ok-button') },
      cancelButtonProps: { className: cx('cancel-button') },
      onOk: async () => {
        try {
          await deleteAnswerOfQuestion(props.answer.answerId)
          toast.success('Xóa câu trả lời thành công');
          props.refresh();
          navigate(`/home-business-relation/feedback-management`);
        } catch (error) {
          console.error("Lỗi xóa câu hỏi:", error);
          toast.error(error.message || error.result);
        }
      },
    });
  };


  return (
    <>
      <Tooltip title="Nhấn vào để xóa câu trả lời" >
        <MinusCircleOutlined style={{ color: "#ea3d2a", fontSize: '12px', marginLeft: '4px' }} className={cx('delete-icon')} onClick={confirm} />
      </Tooltip>

      {contextHolder}
    </>
  );
}
