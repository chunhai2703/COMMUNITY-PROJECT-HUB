import React from 'react';
import { FileSyncOutlined, SyncOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import classes from './ProjectChangeStatus.module.css';
import classNames from 'classnames/bind';
import { useNavigate, useParams } from 'react-router-dom';
import { toUpComingProject } from '../../../services/ProjectsApi';
import { toast } from 'react-toastify';
import useAuth from '../../../hooks/useAuth';


const cx = classNames.bind(classes);

export const ProjectChangeStatus = (props) => {
  const [modal, contextHolder] = Modal.useModal();
  const params = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();


  const confirm = () => {
    modal.confirm({
      title: 'Đổi trạng thái dự án',
      icon: <FileSyncOutlined />,
      content: 'Bạn chắc chắn muốn đổi trạng thái dự án này sang "Sắp diễn ra" không?',
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      centered: true,
      okButtonProps: { style: { backgroundColor: '#034ea2' } },
      onOk: async () => {
        try {
          await toUpComingProject(params.projectId);
          toast.success('Chuyển trạng thái dự án thành công');
          props.refreshProject();
          if (user && (user?.roleId === 2)) {
            navigate(`/home-lecturer/project-detail/${params.projectId}`);
          }
          else if (user && (user?.roleId === 4)) {
            navigate(`/home-department-head/project-detail/${params.projectId}`);
          }
        } catch (error) {
          console.error(error);
          toast.error(error.message);
        }
      },
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
