import React from 'react'
import classes from './ProjectClass.module.css'
import classNames from 'classnames/bind'
import { ClassTable } from './ClassTable'


const cx = classNames.bind(classes)

export const ProjectClass = () => {
  return (
    <div className={cx('project-class-container')}>
      <h2 className={cx('project-class-title')}>Danh sách các lớp</h2>
      <ClassTable />
    </div>
  )
}
