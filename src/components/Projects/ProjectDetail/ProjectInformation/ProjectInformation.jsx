import React from 'react'
import { ArrowRightOutlined } from '@ant-design/icons'
import classes from './ProjectInformation.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(classes)

export const ProjectInformation = (props) => {
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

  return (
    <div className={cx('project-information-container')}>
      <div className={cx('project-information-title')} >
        <h3 className={cx('project-title')}>Thông tin chi tiết</h3>
        <p className={cx('project-description')}>{props.project.description}</p>
      </div>
      <div className={cx('project-information-content')}>
        <p className={cx('project-address')}><span className={cx('address-label', 'label')}>Địa chỉ :</span> <span className={cx('address-content', 'content')}>{props.project.address}</span></p>

        <p className={cx('project-number-lesson')}><span className={cx('number-lesson-label', 'label')}>Tổng số buổi học :</span> <span className={cx('number-lesson-content', 'content')}>{props.project.numberLesson} buổi</span></p>
        
        <p className={cx('project-number-trainee')}><span className={cx('number-trainee-label', 'label')}>Tổng số học viên :</span> <span className={cx('number-trainee-content', 'content')}>{props.project.totalNumberTrainee} người</span></p>
        
        <p className={cx('project-number-teacher')}><span className={cx('number-teacher-label', 'label')}>Tổng số giáo viên :</span> <span className={cx('number-teacher-content', 'content')}>{props.project.totalNumberLecturer} người</span></p>
        
        <p className={cx('project-number-student')}><span className={cx('number-student-label', 'label')}>Tổng sinh viên hỗ trợ (mỗi nhóm) :</span> <span className={cx('number-student-content', 'content')}>{props.project.numberTraineeEachGroup} người</span></p>
        
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

      </div>
      <div className={cx('project-material-buttons')}>
        <button className={cx('project-material-button')}>Xem tài liệu</button>
      </div>
    </div>
  )
}
