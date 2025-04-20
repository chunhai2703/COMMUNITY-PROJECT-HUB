import React from 'react'
import { Card, Tag } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import classes from './ClassItem.module.css'
import classNames from 'classnames/bind'
import useAuth from '../../../hooks/useAuth'
import { SubmitReport } from '../../Popup/Class/SubmitReport'
import { ClassGroupForm } from '../../Popup/Class/ClassGroupForm'
import { TraineeResult } from '../../Popup/Members/TraineeResult'

const cx = classNames.bind(classes)

export const ClassItem = (props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const classData = props;

  console.log(classData);

  const moveToClassDetail = () => {
    if (user?.roleId === 2) {
      navigate(`/home-lecturer/class-detail/${props.projectId}/${props.classId}`)
    } else if (user?.roleId === 4) {
      navigate(`/home-department-head/class-detail/${props.projectId}/${props.classId}`)
    } else if (user?.roleId === 1) {
      navigate(`/home-student/class-detail/${props.projectId}/${props.classId}`)
    } else if (user?.roleId === 3) {
      navigate(`/home-trainee/class-detail/${props.projectId}/${props.classId}`)
    }
  }

  return (
    <Card
      title={
        <h3 className={cx('class-name')}>{props.classCode}</h3>
      }
      extra={

        <Link style={{ color: '#3987e1', fontWeight: '600' }} onClick={moveToClassDetail}>Xem thêm</Link>}
      style={{
        width: 400,
      }}
      className={cx('class-item')}
    >
      <div className={cx('class-item-content')}>
        <p className={cx('project-name')}><span className={cx('label')}>Dự án:</span> <span className={cx('project-name-value')}>{props.projectTitle}</span> </p>
        <p><span className={cx('label')}>Hiện trạng: </span><span className={cx('project-status', {
          'planning-status': props.projectStatus === 'Lên kế hoạch',
          'ongoing-status': props.projectStatus === 'Sắp diễn ra',
          'active-status': props.projectStatus === 'Đang diễn ra',
          'inactive-status': props.projectStatus === 'Hủy',
          'completed-status': props.projectStatus === 'Kết thúc',
        })}>{props.projectStatus}</span></p>

        {(user?.roleId === 1 || user?.roleId === 3) && (
          <p className={cx('lecturer')}>
            <span className={cx('label')}>Giảng viên: </span>
            <span className={cx('lecturer-value')}>{props.lecturerName}</span>
          </p>
        )}

        <p className={cx('address')}><span className={cx('label')}>Địa điểm: </span><span className={cx('address-value')}>{props.projectAddress}</span></p>

        {user?.accountId === props.lecturerId && (<p className={cx('group')}><span className={cx('label')}>Chia nhóm: </span><span className={cx('group-value')}><ClassGroupForm classData={classData} /></span></p>)}

        {user?.roleId === 3 && props.projectStatus === 'Đang diễn ra' && (
          <p><span className={cx('label')}>Báo cáo học tập: </span> <Tag color={props.traineeReportContent !== null ? '#87d068' : '#f50'}>{props.traineeReportContent !== null ? 'Đã có' : 'Chưa có'}</Tag> <SubmitReport traineeReportContent={props.traineeReportContent} projectId={props.projectId} classId={props.classId} onRefresh={props.onRefresh} /></p>
        )}
        {user.roleId === 3 && props.traineeScore && props.traineeResult !== null && props.projectStatus === 'Kết thúc' && <p className={cx('result')}><span className={cx('label')}>Kết quả: </span><span className={cx('result-value')}><TraineeResult traineeScore={props.traineeScore} traineeTotalPresentSlot={props.traineeTotalPresentSlot} traineeTotalSlot={props.traineeTotalSlot} traineeReportContent={props.traineeReportContent} traineeResult={props.traineeResult} /></span></p>}

      </div>

    </Card>
  )
}
