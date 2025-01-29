import React from 'react'
import classes from './ProjectItem.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(classes)

export const ProjectItem = (props) => {
  return (
    <div className={cx('project-item-container')}>
      <div className={cx('project-item')}>
        <div className={cx('project-item-title')}>
          <h2 className={cx('project-item-name')}>{props.projectName}</h2>
          <sub className={cx('project-item-status', {
            'active-status': props.status === 1,
            'inactive-status': props.status !== 1,
          })}>{props.status === 1 ? 'Đang diễn ra' : 'Đã kết thúc'}</sub>
        </div>
        <div className={cx('project-item-description')}>
          <p className={cx('project-item-code')}>Project code: {props.projectCode}</p>
          <p className={cx('project-item-duration')}>Duration: {props.duration} days <span>({props.duration * 2} hours) </span></p>
          <p className={cx('project-item-created-date')}>Created on: {props.createdDate} by {props.createdBy}</p>
          <p className={cx('project-item-manager')}>Project Manager: {props.projectManager}</p>

        </div>
      </div>
    </div>
  )
}
