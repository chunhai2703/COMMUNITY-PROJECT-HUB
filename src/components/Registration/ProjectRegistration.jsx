import React from 'react'
import classes from './ProjectRegistration.module.css'
import classNames from 'classnames/bind'
import { RegistrationTable } from './RegistrationTable/RegistrationTable'

const cx = classNames.bind(classes)

export const ProjectRegistration = () => {
  return (
    <div className={cx("project-registration-container")}>
      <h2 className={cx("project-registration-title")}>Quản lý danh sách ứng tuyển</h2>
      <RegistrationTable />
    </div>
  )
}
