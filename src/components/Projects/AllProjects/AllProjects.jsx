import React from 'react'
import classes from './AllProjects.module.css'
import classNames from 'classnames/bind'
import { SearchOutlined, FilterOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { ProjectsList } from '../ProjectsList/ProjectsList'


const cx = classNames.bind(classes)

const DUMMY_PROJECTS = [
  {
    id: 1,
    projectName: 'Sử dụng A.I. trong giảng dạy',
    status: 1,
    projectCode: 'AI-001',
    duration: 2,
    createdDate: '2025-01-01',
    createdBy: 'John Doe',
    projectManager: 'Jane Smith',
  },
  {
    id: 2,
    projectName: 'Excel cơ bản',
    status: 1,
    projectCode: 'EXC-001',
    duration: 3,
    createdDate: '2025-01-10',
    createdBy: 'John Doe',
    projectManager: 'Max Johnson',
  },
  {
    id: 3,
    projectName: 'Powerpoint cơ bản',
    status: 2,
    projectCode: 'PPT-001',
    duration: 3,
    createdDate: '2023-02-01',
    createdBy: 'John Doe',
    projectManager: 'Mary Brown',
  },
  {
    id: 4,
    projectName: 'Powerpoint cơ bản',
    status: 2,
    projectCode: 'PPT-001',
    duration: 3,
    createdDate: '2023-02-01',
    createdBy: 'John Doe',
    projectManager: 'Mary Brown',
  }
]

export const AllProjects = () => {
  return (
    <div className={cx('all-projects-container')}>
      <h2 className={cx('all-projects-title')}>Dự Án Cộng Đồng</h2>
      <div className={cx('all-projects-search')}>
        <div className={cx('search-box-container')}>
          <div className={cx('search-box')}>
            <SearchOutlined color='#285D9A' size={20} />
            <input type="text" placeholder="Tìm kiếm dự án" className={cx('search-input')} />
          </div>
          <button className={cx('filter-button')}>
            <FilterOutlined color='white' size={20} style={{ marginRight: '5px' }} />
            Bộ lọc
          </button>
        </div>

        <button className={cx('create-project-button')}>
          <PlusCircleOutlined color='white' size={20} style={{ marginRight: '5px' }} />
          Tạo dự án
        </button>
      </div>
      <ProjectsList projects={DUMMY_PROJECTS} />
    </div>
  )
}
