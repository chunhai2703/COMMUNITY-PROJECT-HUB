import React, { useCallback, useEffect, useState } from 'react';
import { ConfigProvider, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import useAuth from '../../../hooks/useAuth';
import classes from './ChangeClass.module.css'
import classNames from 'classnames/bind'
import { Spinner } from '../../Spinner/Spinner';
import { getAllClassesOfTrainee } from '../../../services/ClassApi';
import { TraineeChangeClass } from '../../Popup/Class/TraineeChangeClass';

const cx = classNames.bind(classes)

export const ChangeClass = () => {
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
      align: 'center'
    },
    {
      title: 'Chuyển lớp',
      key: 'action',
      align: 'center',
      render: (record) => (
        <TraineeChangeClass classId={record.classId} projectStatus={record.projectStatus} refresh={fetchAllClassesOfTrainee} />
      ),
    },
  ];

  if (!user) {
    return <Spinner />
  }

  return (
    <div className={cx('change-class-container')}>
      <h2 className={cx("change-class-title")}>Chuyển lớp</h2>
      <div className={cx('change-class-search')}>
        <div className={cx('search-box-container')}>
          <div className={cx('search-box')}>
            <SearchOutlined color='#285D9A' size={20} />
            <input
              type="search"
              placeholder="Tìm kiếm lớp"
              className={cx('search-input')}
              onChange={(e) => handleInputSearch(e)}
            />
          </div>
          <button className={cx('search-button')}>
            <SearchOutlined color='white' size={20} style={{ marginRight: '5px' }} />
            Tìm kiếm
          </button>
        </div>

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
