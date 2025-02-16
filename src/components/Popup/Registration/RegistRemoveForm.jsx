import React from 'react'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import classes from './RegistRemoveForm.module.css';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const cx = classNames.bind(classes);

export const RegistRemoveForm = () => {
   const [modal, contextHolder] = Modal.useModal();
    const navigate = useNavigate();
  
    const confirm = () => {
      modal.confirm({
        title: 'Xóa đơn đăng kí',
        icon: <ExclamationCircleOutlined />,
        content: 'Bạn chắc chắn xóa đơn đăng kí này?',
        okText: 'Đồng ý',
        cancelText: 'Hủy',
        centered: true,
        okButtonProps: { style: { backgroundColor: '#034ea2' } },
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
        <DeleteOutlined className={cx('delete-icon')} onClick={confirm} />
        {contextHolder}
      </>
    );
}
