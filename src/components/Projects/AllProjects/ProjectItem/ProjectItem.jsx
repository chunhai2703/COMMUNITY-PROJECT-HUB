import React from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './ProjectItem.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(classes);

export const ProjectItem = (props) => {
  const navigate = useNavigate();

  // Chuyển đổi startDate & endDate thành đối tượng Date
  const startDate = new Date(props.startDate);
  const endDate = new Date(props.endDate);

  // Tính duration (số ngày)
  const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  // Format ngày tạo theo kiểu Việt Nam
  const createdDate = new Date(props.createdDate).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className={cx('project-item-container')} onClick={() => navigate(`/home-department-head/project-detail/${props.projectId}`)}>
      <div className={cx('project-item')}>
        <div className={cx('project-item-title')}>
          <h2 className={cx('project-item-name')}>{props.title}</h2>
          <span className={cx('project-item-status', {
            'active-status': props.status,
            'inactive-status': !props.status,
          })}>
            {props.status ? 'Đang diễn ra' : 'Đã kết thúc'}
          </span>
        </div>
        <div className={cx('project-item-description')}>
          <p className={cx('project-item-duration')}>
            Thời lượng khóa học: {duration} ngày <span>({duration * 2} giờ)</span>
          </p>
          <p className={cx('project-item-created-date')}>
            Ngày tạo: {createdDate}
          </p>
          <p className={cx('project-item-manager')}>
            Quản lý dự án: {props.projectManagerName ? (props.projectManagerName) : (<span style={{ color: 'red', fontWeight: '600' }}>Chưa có</span>)}
          </p>
        </div>
      </div>
    </div>
  );
};
