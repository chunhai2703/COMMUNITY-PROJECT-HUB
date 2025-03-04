import React from 'react';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import classes from './ProjectUnactiveForm.module.css';
import classNames from 'classnames/bind';
import { useParams, useNavigate } from 'react-router-dom';
import { unActiveProject } from '../../../services/ProjectsApi';
import { toast } from 'react-toastify';
import useAuth from '../../../hooks/useAuth';

const cx = classNames.bind(classes);

export const ProjectUnactiveForm = () => {
  const [modal, contextHolder] = Modal.useModal();
  const params = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const confirm = () => {
    modal.confirm({
      title: 'Vô hiệu hóa dự án',
      icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
      content: 'Bạn chắc chắn muốn vô hiệu hóa dự án này?',
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      centered: true,
      okButtonProps: { style: { backgroundColor: '#034ea2' } },
      onOk: async () => {
        try {
          await unActiveProject(params.projectId);
          toast.success('Vô hiệu hóa dự án thành công');
          if (user && (user?.roleId === 2)) {
            navigate(`/home-lecturer/project-detail/${params.projectId}`);
          } else if (user && (user?.roleId === 4)) {
            navigate(`/home-department-head/project-detail/${params.projectId}`);
          }
      
        } catch (error) {
          toast.error('Không thể vô hiệu hóa dự án');
        }
      },
    });
  };

  return (
    <>
      <button className={cx('project-detail-delete')} onClick={confirm}>
        <DeleteOutlined style={{ marginRight: '8px' }} /> Vô hiệu hóa
      </button>
      {contextHolder}
    </>
  );
};


