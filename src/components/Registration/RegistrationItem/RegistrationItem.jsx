import React from 'react'
import { SyncOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Tag, Tooltip, ConfigProvider } from 'antd'
import classes from './RegistrationItem.module.css'
import classNames from 'classnames/bind'
import { RegistRemoveForm } from '../../Popup/Registration/RegistRemoveForm'


const cx = classNames.bind(classes)

export const RegistrationItem = (props) => {
  return (
    <div className={cx('registration-item-container')}>
      <div className={cx('registration-item')}>
        <div className={cx('registration-item-header')}>
          <h2 className={cx('project-name')}><span>{props.projectName}</span></h2>
          <RegistRemoveForm />
        </div>
        <div className={cx('registration-item-content')}>
          <p className={cx('created-date')}><span style={{ fontWeight: '600' }}>Ngày tạo: </span> <span>{props.createdDate}</span></p>
          <p className={cx('status')}><span style={{ fontWeight: '600' }}>Trạng thái: </span> <span>{props.status === 1 ?
            <Tag icon={<CheckCircleOutlined style={{ verticalAlign: 'middle' }} />} color="success">Đã duyệt</Tag> :
            props.status === 2 ?
              <Tag icon={<SyncOutlined spin style={{ verticalAlign: 'middle' }} />} color="processing">
                Đang chờ duyệt
              </Tag> :
              <Tag icon={<CloseCircleOutlined style={{ verticalAlign: 'middle' }} />} color="error">Từ chối</Tag>}
          </span>
          </p>
          <p className={cx('description')}><span style={{ fontWeight: '600' }}>Nội dung: </span>
            <ConfigProvider
              theme={{
                token: {
                  colorTextLightSolid: '#474747',
                  colorBgSpotlight: '#fff',
                },
              }}
            >
              <Tooltip overlayInnerStyle={{ width: '500px', padding: '12px', alignContent: 'justify' }} placement='right' title={props.description.split('\n').map((line, index) => (
                <span key={index}>{line}<br /></span>
              ))} >
                <span style={{ paddingLeft: "5px", fontStyle: 'italic', cursor: 'pointer' }}>Chạm vào để xem nội dung</span>
              </Tooltip>
            </ConfigProvider>
          </p>
        </div>
      </div>
    </div>
  )
}
