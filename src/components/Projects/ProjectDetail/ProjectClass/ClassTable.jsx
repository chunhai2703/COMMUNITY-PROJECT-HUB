import React from 'react'
import { ConfigProvider, Dropdown, Table, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, ContainerOutlined, EllipsisOutlined, SearchOutlined } from '@ant-design/icons';
import classes from './ClassTable.module.css'
import classNames from 'classnames/bind'
import { ClassCreateForm } from '../../../Popup/Class/ClassCreateForm';

const cx = classNames.bind(classes)


export const ClassTable = () => {
  const items = [
    {
      key: '1',
      label: (
        <button className={cx('view-detail', 'detail-button')}>
          <InfoCircleOutlined style={{ marginRight: '8px' }} /> Xem chi tiết
        </button>
      ),
    },
    {
      key: '2',
      label: (
        <button className={cx('detail-register', 'detail-button')}>
          <ContainerOutlined style={{ marginRight: '8px' }} /> Đăng ký
        </button>
      ),
    },
    {
      key: '3',
      label: (
        <button className={cx('detail-update', 'detail-button')}>
          <EditOutlined style={{ marginRight: '8px' }} /> Cập nhật
        </button>
      ),
    },
    {
      key: '4',
      label: (
        <button className={cx('detail-delete', 'detail-button')}  >
          <DeleteOutlined style={{ marginRight: '8px' }} /> Xóa
        </button>
      ),
    },

  ];

  const columns = [
    {
      title: 'Lớp',
      dataIndex: 'class',
      key: 'class',
      align: 'center',
    },
    {
      title: 'Giáo viên',
      dataIndex: 'teacher',
      key: 'teacher',
      align: 'center'
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      key: 'createdBy',
      align: 'center'
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      align: 'center'
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      align: 'center'
    },
    {
      title: 'Số học viên',
      dataIndex: 'numberOfTrainee',
      key: 'numberOfTrainee',
      align: 'center'
    },
    {
      title: 'Địa điểm',
      dataIndex: 'address',
      key: 'address',
      align: 'center'
    },
    {
      title: 'Hiện trạng',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      render: (text) => (
        <Tag color={text === 1 ? 'green' : 'orange'} >
          {text === 1 ? 'Chưa đủ' : 'Đã đủ'}
        </Tag>
      ),
    },
    {
      title: '',
      key: 'action',
      render: () => (
        <Dropdown
          menu={{
            items,
          }}
          placement="bottomRight"
          trigger={['click']}
        >
          <EllipsisOutlined style={{ fontSize: "18px", color: 'black' }} />
        </Dropdown>
      ),
    },
  ];
  const data = [
    {
      key: '1',
      class: 'AI2000',
      teacher: "Võ Nguyễn Trung Hải (HaiVNT)",
      createdBy: "HoaDNT",
      startDate: "2022-01-01",
      endDate: "2022-01-01",
      numberOfTrainee: 30,
      address: 'Thành phố Hồ Chí Minh',
      status: 1,
    },
    {
      key: '2',
      class: 'AI2001',
      teacher: "Võ Nguyễn Trung Hải (HaiVNT)",
      createdBy: "HoaDNT",
      startDate: "2022-01-01",
      endDate: "2022-01-01",
      numberOfTrainee: 30,
      address: 'Bà Rịa - Vũng Tàu',
      status: 0,
    },
    {
      key: '3',
      class: 'AI2001',
      teacher: "Võ Nguyễn Trung Hải (HaiVNT)",
      createdBy: "HoaDNT",
      startDate: "2022-01-01",
      endDate: "2022-01-01",
      numberOfTrainee: 30,
      address: 'Bà Rịa - Vũng Tàu',
      status: 0,
    },
    {
      key: '4',
      class: 'AI2001',
      teacher: "Võ Nguyễn Trung Hải (HaiVNT)",
      createdBy: "HoaDNT",
      startDate: "2022-01-01",
      endDate: "2022-01-01",
      numberOfTrainee: 30,
      address: 'Bà Rịa - Vũng Tàu',
      status: 0,
    },
    {
      key: '5',
      class: 'AI2001',
      teacher: "Võ Nguyễn Trung Hải (HaiVNT)",
      createdBy: "HoaDNT",
      startDate: "2022-01-01",
      endDate: "2022-01-01",
      numberOfTrainee: 30,
      address: 'Bà Rịa - Vũng Tàu',
      status: 0,
    },
    {
      key: '6',
      class: 'AI2001',
      teacher: "Võ Nguyễn Trung Hải (HaiVNT)",
      createdBy: "HoaDNT",
      startDate: "2022-01-01",
      endDate: "2022-01-01",
      numberOfTrainee: 30,
      address: 'Bà Rịa - Vũng Tàu',
      status: 0,
    },

  ];

  return (
    <div className={cx('class-table-container')}>
      <div className={cx('project-detail-search')}>
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

        <ClassCreateForm />
      </div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              /* here is your component tokens */
              headerBg: '#474D57',
              headerColor: 'white',
            },
          },
        }}
      >
        <Table size='large' columns={columns} dataSource={data} pagination={{ position: ['bottomCenter'], pageSize: 5 }} />
      </ConfigProvider>
    </div>


  )
}
