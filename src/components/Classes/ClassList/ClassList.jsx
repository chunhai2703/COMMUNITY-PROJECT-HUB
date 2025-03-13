import React, { useState } from 'react'
import classes from './ClassList.module.css'
import classNames from 'classnames/bind'
import { DatabaseOutlined } from '@ant-design/icons'
import { ConfigProvider, Pagination, Result } from 'antd'
import { ClassItem } from '../ClassItem/ClassItem'

const cx = classNames.bind(classes)


const ITEMS_PER_PAGE = 4

export const ClassList = (props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentClasses = props.classes.slice(startIndex, endIndex);

  const refreshClasses = () => {
    props.onRefresh();  // Gọi callback từ AllClasses
  };

  if (!props.classes || props.classes.length === 0) {
    return (
      <div className={cx('classes-list-container')}>
        <div className={cx('classes-list-empty')}>
          <ConfigProvider
            theme={{
              components: {
                Result: {
                  iconFontSize: '40px',
                  colorInfo: 'grey',
                },
              },
            }}
          >
            <Result
              title="Chưa có lớp nào"
              icon={<DatabaseOutlined style={{ opacity: '0.5' }} />}
              style={{ color: 'grey', opacity: '0.5' }}
            />
          </ConfigProvider>

        </div>
      </div>
    )
  }

  return (
    <div className={cx('classes-list-container')}>
      <div className={cx('classes-list')}>
        {currentClasses.map((item) => <ClassItem key={item.classId} {...item} onRefresh={refreshClasses} />)}
      </div>
      <Pagination align="center" defaultCurrent={1} total={props.classes.length} pageSize={ITEMS_PER_PAGE} onChange={(page) => setCurrentPage(page)} />
    </div>

  )
}
