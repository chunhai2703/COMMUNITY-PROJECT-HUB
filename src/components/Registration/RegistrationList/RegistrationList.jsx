import React, { useState } from 'react'
import { Pagination, ConfigProvider, Result } from 'antd';
import { DatabaseOutlined } from '@ant-design/icons';
import classes from './RegistrationList.module.css'
import classNames from 'classnames/bind'
import { RegistrationItem } from '../RegistrationItem/RegistrationItem';

const cx = classNames.bind(classes)
const ITEMS_PER_PAGE = 3;

export const RegistrationList = (props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRegistrations = props.registrations.slice(startIndex, endIndex);

  if (currentRegistrations.length === 0) {
    return (
      <div className={cx('registration-list-container')}>
        <div className={cx('registration-list')}>
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
              title="Chưa có đơn đăng kí nào"
              icon={<DatabaseOutlined style={{ opacity: '0.5' }} />}
              style={{ color: 'grey', opacity: '0.5' }}
            />
          </ConfigProvider>

        </div>
      </div>
    )
  }

  return (
    <div className={cx('registration-list-container')}>
      <div className={cx('registration-list')}>
        {currentRegistrations.map((regis) => <RegistrationItem key={regis.registrationId} {...regis} />)}
        <Pagination align="center" defaultCurrent={1} total={props.registrations.length} pageSize={ITEMS_PER_PAGE} onChange={(page) => setCurrentPage(page)} />
      </div>
    </div>

  )
}
