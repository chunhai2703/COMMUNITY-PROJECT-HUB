import React from 'react'
import { EllipsisOutlined, FileTextOutlined } from '@ant-design/icons'
import { Dropdown } from 'antd';
import classes from './ProjectDetail.module.css'
import classNames from 'classnames/bind'
import { ProjectInformation } from './ProjectInformation/ProjectInformation';
import { ProjectLesson } from './ProjectLesson/ProjectLesson';
import { ProjectClass } from './ProjectClass/ProjectClass';
import { ProjectUnactiveForm } from '../../Popup/Project/ProjectUnactiveForm';
import { ProjectUpdateForm } from '../../Popup/Project/ProjectUpdateForm';
import useAuth from '../../../hooks/useAuth';
import { Spinner } from '../../Spinner/Spinner';
import { ProjectChangeStatus } from '../../Popup/Project/ProjectChangeStatus';
import { useNavigate, useParams } from 'react-router-dom';


const cx = classNames.bind(classes)
export const ProjectDetail = (props) => {
  const { user } = useAuth();
  const { projectId } = useParams();
  const navigate = useNavigate();
  console.log(user);

  const moveToProjectLog = () => {
    if (user && (user?.roleId === 2)) {
      navigate(`/home-lecturer/project-detail/${projectId}/project-log`);
    } else if (user && (user?.roleId === 4)) {
      navigate(`/home-department-head/project-detail/${projectId}/project-log`);
    }
  }
  const items = [
    {
      key: '1',
      label: (
        <ProjectUpdateForm project={props.project} />
      ),
    },
    {
      key: '2',
      label: (
        <button className={cx('project-detail-backlog')} onClick={moveToProjectLog} >
          <FileTextOutlined style={{ marginRight: '8px' }} /> Xem log
        </button>
      ),
    },
    ...(props.project.status === 'Lên kế hoạch'
      ? [
        {
          key: '3',
          label: (
            <ProjectChangeStatus />
          ),
        },
      ]
      : []),
    // {
    //   key: '3',
    //   label: (
    //     <ProjectChangeStatus />
    //   ),
    // },
    {
      key: '4',
      label: (
        <ProjectUnactiveForm />
      ),
    },


  ];
  if (!user) {
    return <Spinner />;
  }

  return (
    <div className={cx('project-detail-container')}>
      <header className={cx('project-detail-header')}>
        <p className={cx('project-detail-title')}>Chi tiết dự án</p>
        <div className={cx('project-detail-name-container')}>
          <div className={cx('project-detail-name')}>
            <h2 className={cx('project-detail-name-title')}>{props.project.title}</h2>
            <span className={cx('project-detail-name-status')}>{props.project.status}</span>
          </div>
          {user && (user.roleId === 4 || user.accountId === props.project.projectManagerId) ? (
            <Dropdown
              menu={{ items }}
              placement="bottomRight"
              disabled={!props.project.status}
            >
              <EllipsisOutlined style={{ fontSize: "36px", color: "white" }} />
            </Dropdown>
          ) : null}


        </div>
      </header>
      <ProjectInformation project={props.project} />
      <ProjectLesson project={props.project} />
      <ProjectClass project={props.project}/>
    </div>
  )
}
