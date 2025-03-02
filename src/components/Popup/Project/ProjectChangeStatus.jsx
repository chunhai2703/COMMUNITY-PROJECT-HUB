import React from 'react';
import { FileSyncOutlined, SyncOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import classes from './ProjectChangeStatus.module.css';
import classNames from 'classnames/bind';
import { useParams, useNavigate } from 'react-router-dom';
import { unActiveProject } from '../../../services/ProjectsApi';
import { toast } from 'react-toastify';

const cx = classNames.bind(classes);

export const ProjectChangeStatus = () => {
  const [modal, contextHolder] = Modal.useModal();
  const params = useParams();
  const navigate = useNavigate();

  const confirm = () => {
    modal.confirm({
      title: 'Đổi trạng thái dự án',
      icon: <FileSyncOutlined   />,
      content: 'Bạn chắc chắn muốn đổi trạng thái dự án này?',
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      centered: true,
      okButtonProps: { style: { backgroundColor: '#034ea2' } },
      // onOk: async () => {
      //   try {
      //     await unActiveProject(params.projectId);
      //     toast.success('Vô hiệu hóa dự án thành công');
      //     // navigate(`/home-department-head/projects`);
      //     window.location.reload();
      //   } catch (error) {
      //     toast.error('Không thể vô hiệu hóa dự án');
      //   }
      // },
    });
  };

  return (
    <>
       <button className={cx('project-detail-status-change')} onClick={confirm}>
              <SyncOutlined style={{ marginRight: '8px' }} /> Chuyển trạng thái
            </button>
      {contextHolder}
    </>
  );
}
