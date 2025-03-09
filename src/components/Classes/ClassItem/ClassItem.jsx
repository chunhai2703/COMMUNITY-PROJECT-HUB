import React from 'react'
import { Card, Tag, Tooltip } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import classes from './ClassItem.module.css'
import classNames from 'classnames/bind'
import useAuth from '../../../hooks/useAuth'
import { BookOutlined, FormOutlined } from '@ant-design/icons'

const cx = classNames.bind(classes)

export const ClassItem = (props) => {
  const { user } = useAuth();
  const navigate = useNavigate()

  return (
    <Card
      title={
        <h3 className={cx('class-name')}>{props.classCode}</h3>
      }
      extra={<Link style={{ color: '#3987e1', fontWeight: '600' }} to={user?.roleId === 2 ? `/home-lecturer/class-detail/${props.projectId}/${props.classId}` : `/home-department-head/class-detail/${props.projectId}/${props.classId}`}>Xem thêm</Link>}
      style={{
        width: 400,
      }}
      className={cx('class-item')}
    >
      <div className={cx('class-item-content')}>
        <p className={cx('project-name')}><span className={cx('label')}>Dự án:</span> <span className={cx('project-name-value')}>{props.projectTitle}</span> - <span className={cx('project-status', {
          'planning-status': props.projectStatus === 'Lên kế hoạch',
          'ongoing-status': props.projectStatus === 'Sắp diễn ra',
          'active-status': props.projectStatus === 'Đang diễn ra',
          'inactive-status': props.projectStatus === 'Hủy',
          'completed-status': props.projectStatus === 'Hoàn thành',
        })}>{props.projectStatus}</span></p>
        <p className={cx('room')}><span className={cx('label')}>Địa điểm: </span><span className={cx('address-value')}>{props.projectAddress}</span></p>
        <p><span className={cx('label')}>Báo cáo: </span> <Tag color={props.reportContent !== null ? '#87d068' : '#f50'}>{props.reportContent !== null ? 'Đã có' : 'Chưa có'}</Tag> <span><Tooltip title={props.reportContent !== null ? 'Cập nhật báo cáo' : 'Tạo báo cáo'} onClick={() => navigate(`/home-lecturer/my-classes/report`)}
        ><FormOutlined className={cx('report-icon')} /></Tooltip></span></p>
      </div>

    </Card>
  )
}
