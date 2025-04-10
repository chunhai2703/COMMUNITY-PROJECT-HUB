import React, { useCallback, useEffect, useState } from 'react';
import { ConfigProvider, Dropdown, Table } from 'antd';
import { EllipsisOutlined, SearchOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import classes from './FeedbackManagement.module.css'
import classNames from 'classnames/bind'
import { FeedbackUpdateForm } from '../Popup/FeedbackForm/FeedbackUpdateForm';
import { FeedbackDeleteForm } from '../Popup/FeedbackForm/FeedbackDeleteForm';
import useAuth from '../../hooks/useAuth';
import { getAllClassesOfTrainee } from '../../services/ClassApi';
import { Spinner } from '../Spinner/Spinner';
import { FeedbackCreateForm } from '../Popup/FeedbackForm/FeedbackCreateForm';

const cx = classNames.bind(classes)

export const FeedbackManage = () => {
  const { user } = useAuth();
  const ITEMS_PER_PAGE = 3;
  const [pageNumber, setPageNumber] = useState(1);
  const [classList, setClassList] = useState([]);
  const [searchValue, setSearchValue] = useState("")


  const fetchAllClassesOfTrainee = useCallback(async () => {
    const response = await getAllClassesOfTrainee(user.accountId, searchValue);
    if (response.isSuccess) {
      setClassList(response.result);
    } else {
      setClassList([]);
      console.error("Lỗi khi lấy các lớp của học viên:", response.message);
    }
  }, [user.accountId, searchValue]);

  const handleInputSearch = debounce((e) => {
    setSearchValue(e.target.value);
    setPageNumber(1);
  }, 500);

  useEffect(() => {
    if (user) {
      fetchAllClassesOfTrainee();
    }
  }, [fetchAllClassesOfTrainee, user]);

  const getMenuItems = () => [
    {
      key: '1',
      label: (
        <FeedbackUpdateForm />
      ),
    },
    {
      key: '2',
      label: (
        <FeedbackDeleteForm />
      ),
    },
  ];


  const columns = [
    {
      title: "STT",
      dataIndex: "classId",
      key: "classId",
      align: "center",
      render: (_, __, index) => index + 1 + (pageNumber - 1) * ITEMS_PER_PAGE,
    },
    {
      title: 'Lớp',
      dataIndex: 'classCode',
      key: 'classCode',
      align: 'center',
    },
    {
      title: 'Dự án',
      dataIndex: 'projectTitle',
      key: 'projectTitle',
      align: 'center',
    },
    {
      title: 'Giảng viên',
      dataIndex: 'lecturerName',
      key: 'lecturerName',
      align: 'center',
      render: (lecturerName) => lecturerName ?? <span style={{ color: 'red', fontWeight: 500 }}>Chưa được cập nhật</span>
    },
    {
      title: '',
      key: 'action',
      align: 'center',
      render: (record) => (
        <Dropdown menu={{ items: getMenuItems(record) }} placement="bottomRight" trigger={['click']}>
          <EllipsisOutlined style={{ fontSize: "18px", color: 'black' }} />
        </Dropdown>
      ),
    },
  ];

  if (!user) {
    return <Spinner />
  }

  return (
    <div className={cx('change-class-container')}>
      <h2 className={cx("change-class-title")}>Danh sách câu hỏi</h2>
      <div className={cx('change-class-search')}>
        <div className={cx('search-box-container')}>
          <div className={cx('search-box')}>
            <input
              type="search"
              placeholder="Tìm kiếm câu hỏi"
              className={cx('search-input')}
              onChange={(e) => handleInputSearch(e)}
            />
          </div>
          <button className={cx('search-button')}>
            <SearchOutlined color='white' size={20} style={{ marginRight: '5px' }} />
            Tìm kiếm
          </button>
        </div>
        <FeedbackCreateForm />
      </div>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: '#474D57',
              headerColor: 'white',
            },
          },
        }}
      >
        <Table
          size='large'
          columns={columns}
          rowKey={record => record.classId}
          dataSource={classList}
          pagination={{
            position: ['bottomCenter'],
            current: pageNumber, // Dùng pageNumber thay vì fix cứng current: 1
            pageSize: ITEMS_PER_PAGE,
            total: classList.length,
            onChange: (page) => setPageNumber(page), // Cập nhật pageNumber khi người dùng bấm chuyển trang
          }}
        />
      </ConfigProvider>
    </div>
  );
}
