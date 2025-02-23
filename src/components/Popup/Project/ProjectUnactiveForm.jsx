import React from 'react';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import classes from './ProjectUnactiveForm.module.css';
import classNames from 'classnames/bind';
import { useParams, useNavigate } from 'react-router-dom';
import { unActiveProject } from '../../../services/ProjectsApi';
import { toast } from 'react-toastify';

const cx = classNames.bind(classes);

export const ProjectUnactiveForm = () => {
  const [modal, contextHolder] = Modal.useModal();
  const params = useParams();
  const navigate = useNavigate();

  const confirm = () => {
    modal.confirm({
      title: 'Vô hiệu hóa dự án',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn chắc chắn muốn vô hiệu hóa dự án này?',
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      centered: true,
      okButtonProps: { style: { backgroundColor: '#034ea2' } },
      onOk: async () => {
        try {
          await unActiveProject(params.projectId);
          toast.success('Vô hiệu hóa dự án thành công');
          navigate(`/home-department-head/projects`);
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


