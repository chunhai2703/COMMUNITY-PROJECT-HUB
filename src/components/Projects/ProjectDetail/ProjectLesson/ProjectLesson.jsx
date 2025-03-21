import React from 'react'
import { Collapse } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import classes from './ProjectLesson.module.css'
import classNames from 'classnames/bind'
import { LessonUpdateForm } from '../../../Popup/Lesson/LessonUpdateForm';
import useAuth from '../../../../hooks/useAuth';


const cx = classNames.bind(classes)
export const ProjectLesson = (props) => {
  const { user } = useAuth();
  console.log(props.project.lessons);
  const items = props.project.lessons
    .sort((a, b) => a.lessonNo - b.lessonNo)
    .map((lesson, index) => ({
      key: lesson.lessonNo.toString(),
      label: (
        <span style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>
          Ngày {index + 1}
        </span>
      ),
      style: { backgroundColor: '#474D57' },
      children: <h2 className={cx('lesson-content')}>{lesson.lessonContent}</h2>,
    }));
  const onChange = (key) => {
    console.log(key);
  };
  const customExpandIcon = ({ isActive }) => (
    <DownOutlined style={{ color: 'white', fonWWeight: '600', transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
  );

  return (
    <div className={cx('project-lesson-container')}>
      <h2 className={cx('project-lesson-title')}>Nội dung dự án</h2>
      <div className={cx('project-lesson-content')}>
        {user?.roleId === 4 ? <LessonUpdateForm project={props.project} /> : null}
        {/* <LessonUpdateForm project={props.project} /> */}
        <Collapse size='large' items={items} onChange={onChange} expandIcon={customExpandIcon} />
      </div>

    </div>
  )
}
