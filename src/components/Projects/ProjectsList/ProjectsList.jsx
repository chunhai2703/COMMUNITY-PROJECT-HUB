import React, { useState } from 'react'
import classes from './ProjectsList.module.css'
import classNames from 'classnames/bind'
import { Pagination } from 'antd';
import { ProjectItem } from '../ProjectItem/ProjectItem'

const cx = classNames.bind(classes)
const ITEMS_PER_PAGE = 3;

export const ProjectsList = (props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProjects = props.projects.slice(startIndex, endIndex);


  return (
    <div className={cx('projects-list-container')}>
      <div className={cx('projects-list')}>
        {currentProjects.map((project) => <ProjectItem key={project.id} {...project} />)}
        <Pagination align="center" defaultCurrent={1} total={props.projects.length} pageSize={ITEMS_PER_PAGE} onChange={(page) => setCurrentPage(page)} />
      </div>
    </div>

  )
}
