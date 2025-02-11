import React from 'react'
import { EllipsisOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Dropdown } from 'antd';
import classes from './ProjectDetail.module.css'
import classNames from 'classnames/bind'
import { ProjectInformation } from './ProjectInformation/ProjectInformation';
import { ProjectLesson } from './ProjectLesson/ProjectLesson';
import { ProjectClass } from './ProjectClass/ProjectClass';


const cx = classNames.bind(classes)
export const ProjectDetail = (props) => {
  const items = [
    {
      key: '1',
      label: (
        <button className={cx('project-detail-update')}>
          <EditOutlined style={{ marginRight: '8px' }} /> Cập nhật
        </button>
      ),
    },
    {
      key: '2',
      label: (
        <button className={cx('project-detail-delete')}  >
          <DeleteOutlined style={{ marginRight: '8px' }} /> Vô hiệu hóa
        </button>
      ),
    },

  ];
  return (
    <div className={cx('project-detail-container')}>
      <header className={cx('project-detail-header')}>
        <p className={cx('project-detail-title')}>Chi tiết dự án</p>
        <div className={cx('project-detail-name-container')}>
          <div className={cx('project-detail-name')}>
            <h2 className={cx('project-detail-name-title')}>Cách sử dụng A.I. trong giảng dạy</h2>
            <span className={cx('project-detail-name-status')}>{props.project.status ? 'Đang diễn ra' : 'Đã kết thúc'}</span>
          </div>
          <Dropdown
            menu={{
              items,
            }}
            placement="bottomRight"
            disabled={!props.project.status}
          >
            <EllipsisOutlined style={{ fontSize: "36px", color: 'white' }} />
          </Dropdown>
        </div>
      </header>
      <ProjectInformation project={props.project} />
      <ProjectLesson  project={props.project} />
      <ProjectClass />
    </div>
  )
}
