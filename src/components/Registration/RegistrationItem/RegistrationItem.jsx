import React from 'react'
import { SyncOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Tag, Tooltip, ConfigProvider } from 'antd'
import classes from './RegistrationItem.module.css'
import classNames from 'classnames/bind'
import { RegistRemoveForm } from '../../Popup/Registration/RegistRemoveForm'


const cx = classNames.bind(classes)

export const RegistrationItem = (props) => {
  const createdAt = new Date(props.createdAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return (
    <div className={cx('registration-item-container')}>
      <div className={cx('registration-item')}>
        <div className={cx('registration-item-header')}>
          <h2 className={cx('registration-item-title')}><span>Đơn đăng ký</span></h2>
          <RegistRemoveForm registrationId={props.registrationId} />
        </div>
        <div className={cx('registration-item-content')}>
          <p className={cx('project-name')}><span style={{ fontWeight: '600' }}>Tên dự án: </span> <span>{props.title}</span></p>
          <p className={cx('class-code')}><span style={{ fontWeight: '600' }}>Mã lớp: </span> <span>{props.classCode}</span></p>
          <p className={cx('created-date')}><span style={{ fontWeight: '600' }}>Ngày tạo: </span> <span>{createdAt}</span></p>
          <p className={cx('status')}><span style={{ fontWeight: '600' }}>Trạng thái: </span> <span>{props.status === 'Đã duyệt' ?
            <Tag icon={<CheckCircleOutlined style={{ verticalAlign: 'middle' }} />} color="success">{props.status}</Tag> :
            props.status === 'Đang chờ duyệt' ?
              <Tag icon={<SyncOutlined spin style={{ verticalAlign: 'middle' }} />} color="processing">
              {props.status}
              </Tag> :
              <Tag icon={<CloseCircleOutlined style={{ verticalAlign: 'middle' }} />} color="error">{props.status}</Tag>}
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
              <Tooltip
                overlayInnerStyle={{ width: '500px', padding: '12px', alignContent: 'justify' }}
                placement="right"
                title={
                  <>
                    <p style={{ fontWeight: '600' }}>Mô tả bản thân: </p>
                    {props.description.split('\n').map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </>
                }
              >
                <span className={cx('description-content')} >
                  Chạm vào để xem nội dung
                </span>
              </Tooltip>
            </ConfigProvider>
          </p>
        </div>
      </div>
    </div >
  )
}
