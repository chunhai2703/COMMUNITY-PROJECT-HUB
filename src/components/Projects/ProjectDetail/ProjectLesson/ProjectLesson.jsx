import React from 'react'
import { Collapse } from 'antd';
import { DownOutlined, EditOutlined } from '@ant-design/icons';
import classes from './ProjectLesson.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(classes)
export const ProjectLesson = (props) => {

  const items = props.project.lessons.map((lesson, index) => ({
    key: lesson.lessonId.toString(), // Đảm bảo key là chuỗi
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
      <h2 className={cx('project-lesson-title')}>Nội dung khóa học</h2>
      <div className={cx('project-lesson-content')}>
        <button className={cx('project-lesson-edit')}><EditOutlined /> Chỉnh sửa </button>
        <Collapse size='large' defaultActiveKey={['1']} items={items} onChange={onChange} expandIcon={customExpandIcon} />
      </div>

    </div>
  )
}
