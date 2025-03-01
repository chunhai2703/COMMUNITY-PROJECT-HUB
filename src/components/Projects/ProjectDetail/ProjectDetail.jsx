import React from 'react'
import { EllipsisOutlined, SolutionOutlined } from '@ant-design/icons'
import { Dropdown } from 'antd';
import classes from './ProjectDetail.module.css'
import classNames from 'classnames/bind'
import { ProjectInformation } from './ProjectInformation/ProjectInformation';
import { ProjectLesson } from './ProjectLesson/ProjectLesson';
import { ProjectClass } from './ProjectClass/ProjectClass';
import { ProjectUnactiveForm } from '../../Popup/Project/ProjectUnactiveForm';
import { ProjectUpdateForm } from '../../Popup/Project/ProjectUpdateForm';
import useAuth from '../../../hooks/useAuth';


const cx = classNames.bind(classes)
export const ProjectDetail = (props) => {
  const { user } = useAuth();
  console.log(user);
  const items = [
    {
      key: '1',
      label: (
        <button className={cx('project-detail-backlog')} >
          <SolutionOutlined style={{ marginRight: '8px'}} /> Xem backlog
        </button>
      ),
    },
    {
      key: '2',
      label: (
        <ProjectUpdateForm project={props.project} />
      ),
    },
    {
      key: '3',
      label: (
        <ProjectUnactiveForm />
      ),
    },

  ];
  return (
    <div className={cx('project-detail-container')}>
      <header className={cx('project-detail-header')}>
        <p className={cx('project-detail-title')}>Chi tiết dự án</p>
        <div className={cx('project-detail-name-container')}>
          <div className={cx('project-detail-name')}>
            <h2 className={cx('project-detail-name-title')}>{props.project.title}</h2>
            <span className={cx('project-detail-name-status')}>{props.project.status}</span>
          </div>
          {user?.roleId === 4 ? <Dropdown
            menu={{
              items,
            }}
            placement="bottomRight"
            disabled={!props.project.status}
          >
            <EllipsisOutlined style={{ fontSize: "36px", color: 'white' }} />
          </Dropdown> : null}



        </div>
      </header>
      <ProjectInformation project={props.project} />
      <ProjectLesson project={props.project} />
      <ProjectClass />
    </div>
  )
}
