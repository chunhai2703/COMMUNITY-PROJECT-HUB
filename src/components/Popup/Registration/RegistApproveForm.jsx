import React from 'react'
import {CheckCircleFilled, CheckSquareOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import classes from './RegistApproveForm.module.css';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const cx = classNames.bind(classes);
export const RegistApproveForm = () => {
 const [modal, contextHolder] = Modal.useModal();
   const navigate = useNavigate();
 
   const confirm = () => {
     modal.confirm({
       title: 'Duyệt đơn đăng kí',
       icon: <CheckCircleFilled  style={{  color: 'rgb(11, 177, 11)' }} />,
       content: 'Bạn chắc chắn duyệt đơn đăng kí này?',
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
        <CheckSquareOutlined className={cx('approve-icon')} onClick={confirm} />
       {contextHolder}
     </>
   );
}
