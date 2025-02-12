import React from 'react'
import classes from './AllProjects.module.css'
import classNames from 'classnames/bind'
import { SearchOutlined } from '@ant-design/icons'
import { ProjectsList } from './ProjectsList/ProjectsList'
import { ProjectCreateForm } from '../../Popup/Project/ProjectCreateForm'


const cx = classNames.bind(classes)

export const AllProjects = (props) => {
  return (
    <div className={cx('all-projects-container')}>
      <h2 className={cx('all-projects-title')}>Dự Án Cộng Đồng</h2>
      <div className={cx('all-projects-search')}>
        <div className={cx('search-box-container')}>
          <div className={cx('search-box')}>
            <SearchOutlined color='#285D9A' size={20} />
            <input type="search" placeholder="Tìm kiếm dự án" className={cx('search-input')} />
          </div>
          <button className={cx('search-button')}>
            <SearchOutlined color='white' size={20} style={{ marginRight: '5px' }} />
            Tìm kiếm
          </button>
        </div>

        <ProjectCreateForm />
      </div>
      <ProjectsList projects={props.projects} />
    </div>
  )
}
