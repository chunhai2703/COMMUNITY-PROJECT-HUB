import React from 'react'
import { ArrowRightOutlined, ContactsOutlined } from '@ant-design/icons'
import classes from './ProjectInformation.module.css'
import classNames from 'classnames/bind'
import useAuth from '../../../../hooks/useAuth'
import { Spinner } from '../../../Spinner/Spinner'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'

const cx = classNames.bind(classes)

export const ProjectInformation = (props) => {
  const { user, isInitialized } = useAuth();
  const navigate = useNavigate();
  if (!isInitialized) {
    return <Spinner />
  }

  const startDate = new Date(props.project.startDate).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const endDate = new Date(props.project.endDate).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const applicationStartDate = new Date(props.project.applicationStartDate).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const applicationEndDate = new Date(props.project.applicationEndDate).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  console.log(applicationStartDate, applicationEndDate);


  return (
    <div className={cx('project-information-container')}>
      <div className={cx('project-information-title')} >
        <h3 className={cx('project-title')}>Thông tin chi tiết</h3>
        <p className={cx('project-description')}>
          {props.project.description.split('\n').map((line, index) => (
            <span key={index}>{line}<br /></span>
          ))}
        </p>
      </div>
      <div className={cx('project-information-content')}>
        <p className={cx('project-address')}><span className={cx('address-label', 'label')}>Địa chỉ :</span> <span className={cx('address-content', 'content')}>{props.project.address}</span></p>

        <p className={cx('project-number-lesson')}><span className={cx('number-lesson-label', 'label')}>Tổng số buổi học :</span> <span className={cx('number-lesson-content', 'content')}>{props.project.numberLesson} buổi</span></p>

        <p className={cx('project-number-trainee')}><span className={cx('number-trainee-label', 'label')}>Tổng số học viên :</span> <span className={cx('number-trainee-content', 'content')}>{props.project.totalNumberTrainee} người</span></p>

        <p className={cx('project-number-teacher')}><span className={cx('number-teacher-label', 'label')}>Tổng số giáo viên :</span> <span className={cx('number-teacher-content', 'content')}>{props.project.totalNumberLecturer} người</span></p>

        <p className={cx('project-number-student')}><span className={cx('number-student-label', 'label')}>Số học viên (mỗi nhóm) :</span> <span className={cx('number-student-content', 'content')}>{props.project.numberTraineeEachGroup} người</span></p>

        {/* <p className={cx('project-number-member')}><span className={cx('number-member-label', 'label')}>Danh sách thành viên :</span> <span className={cx('number-member-content', 'content')}><ContactsOutlined className={cx('number-member-icon')} onClick={() => navigate(`/home-lecturer/project-registration/${props.project.projectId}`)} /></span></p> */}

        {/* <p className={cx('project-number-member')}><span className={cx('number-member-label', 'label')}>Danh sách thành viên :</span> <span className={cx('number-member-content', 'content')} onClick={() => navigate(`/home-lecturer/project-registration/${props.project.projectId}`)} style={{ cursor: 'pointer', fontStyle: 'italic' }}>Xem chi tiết</span></p> */}

        <p className={cx('project-number-member')}><span className={cx('number-member-label', 'label')}>Danh sách thành viên :</span> <span className={cx('number-member-content', 'content')} onClick={() => navigate(`/home-lecturer/project-registration/${props.project.projectId}`)}><Button type='primary' icon={<ContactsOutlined />} size='small' onClick={() => navigate(`/home-lecturer/project-registration/${props.project.projectId}`)}>Xem chi tiết</Button></span></p>


        <p className={cx('project-date')}><span className={cx('start-date-label', 'label')} >Ngày bắt đầu: </span><span className={cx('start-date-content', 'content')}>{startDate}</span> <ArrowRightOutlined style={{ margin: "0 10px" }} /> <span className={cx('end-date-label', 'label')}> Ngày kết thúc:</span> <span className={cx('end-date-content', 'content')}>{endDate}</span></p>
        <p className={cx('project-manager')}>
          <span className={cx('manager-label', 'label')}>Quản lý dự án :</span>
          <span className={cx('manager-content', 'content')}>
            {props.project.projectManagerName ? (
              props.project.projectManagerName
            ) : (
              <>
                Chưa có <span style={{ color: 'red', fontWeight: '600' }}>(Vui lòng cập nhật quản lý dự án)</span>
              </>
            )}
          </span>
        </p>
        {Date.now() <= new Date(props.project.applicationEndDate) && (
          <p className={cx('project-application-date')}>
            (Thời gian đăng kí bắt đầu từ ngày <span style={{ fontStyle: 'italic' }}>{applicationStartDate}</span> {'\t'} đến ngày <span style={{ fontStyle: 'italic' }} >{applicationEndDate}</span>)
          </p>
        )}

      </div>
      <div className={cx('project-material-buttons')}>
        <button className={cx('project-material-button')}>Xem tài liệu</button>
        {user?.fullName === props.project.projectManagerName && (
          <button className={cx('project-register-button')} onClick={() => navigate(`/home-lecturer/project-registration/${props.project.projectId}`)}>Xem đăng kí</button>
        )}
      </div>
    </div>
  )
}
