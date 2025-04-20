import React, { useEffect, useState } from 'react';
import { ConfigProvider, Dropdown, Table, Tag } from 'antd';
import { InfoCircleOutlined, EllipsisOutlined, SearchOutlined } from '@ant-design/icons';
import classes from './ClassTable.module.css';
import classNames from 'classnames/bind';
import { GetAllClassOfProject } from '../../../../services/ClassApi';
import { useParams, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import useAuth from '../../../../hooks/useAuth';
import { Spinner } from '../../../Spinner/Spinner';
import { RegisterClassForm } from '../../../Popup/Class/RegisterClassForm';
import { ClassGroupForm } from '../../../Popup/Class/ClassGroupForm';
import { AssignLecturer } from '../../../Popup/Class/AssignLecturer';
import { AssignStudent } from '../../../Popup/Class/AssignStudent';


const cx = classNames.bind(classes);

export const ClassTable = (props) => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { user } = useAuth();

  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [classList, setClassList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [totalItem, setTotalItem] = useState(0);

  const fetchAllClassesOfProject = async () => {
    const response = await GetAllClassOfProject(projectId, searchValue, pageNumber, rowsPerPage);
    const responseData = await response.json();

    if (response.ok) {
      setClassList(responseData.result.getAllClassOfProjectDTOs);
      setTotalItem(responseData.result.totalCount);
      setPageNumber(responseData.result.currentPage);
    } else {
      setClassList([]);
      setTotalItem(0);
      setPageNumber(1);
      console.log("Error fetching classes");
    }
  };

  const handleInputSearch = debounce((e) => {
    setSearchValue(e.target.value);
    setPageNumber(1);
  }, 500);

  useEffect(() => {
    if (projectId) {
      fetchAllClassesOfProject();
    }
  }, [pageNumber, projectId, searchValue]);

  const handleNavigateToDetail = (navigate, projectId, classId) => {
    if (user && user?.roleId === 1) {
      navigate(`/home-student/class-detail/${projectId}/${classId}`);
    } else if (user && (user?.roleId === 2)) {
      navigate(`/home-lecturer/class-detail/${projectId}/${classId}`);
    } else if (user && (user?.roleId === 3)) {
      navigate(`/home-trainee/class-detail/${projectId}/${classId}`);
    } else if (user && (user?.roleId === 4)) {
      navigate(`/home-department-head/class-detail/${projectId}/${classId}`);
    } else if (user && (user?.roleId === 5)) {
      navigate(`/home-associate/class-detail/${projectId}/${classId}`);
    } else if (user && (user?.roleId === 6)) {
      navigate(`/home-business-relation/class-detail/${projectId}/${classId}`);
    }
  };

  const getMenuItems = (classData) => {
    let items = [
      {
        key: '1',
        label: (
          <button
            className={cx('class-detail')}
            onClick={() => handleNavigateToDetail(navigate, projectId, classData.classId)}
          >
            <InfoCircleOutlined style={{ marginRight: '8px' }} /> Xem chi tiết
          </button>
        ),
      },
    ];

    if (
      (user?.roleId === 1 && classData.studentSlotAvailable !== null && props.project.status === "Sắp diễn ra") ||
      (user?.roleId === 2 && user?.accountId !== props.project.projectManagerId && classData.lecturerSlotAvailable !== 0 && props.project.status === "Sắp diễn ra")
    ) {
      items.push({
        key: '2',
        label: <RegisterClassForm classId={classData.classId} />,
      });
    }

    if (
      (user?.roleId === 2 &&
        user?.accountId === props.project.projectManagerId &&
        ["Sắp diễn ra", "Đang diễn ra"].includes(props.project.status) &&
        classData.lecturerSlotAvailable !== 0) ||
      (user?.roleId === 4 &&
        ["Sắp diễn ra", "Đang diễn ra"].includes(props.project.status) &&
        classData.lecturerSlotAvailable !== 0)
    ) {
      items.push({
        key: '4',
        label: <AssignLecturer classId={classData.classId} project={props.project} refresh={fetchAllClassesOfProject} />
      });
    }

    if (
      (user?.roleId === 2 &&
        user?.accountId === props.project.projectManagerId &&
        ["Sắp diễn ra", "Đang diễn ra"].includes(props.project.status) &&
        classData.studentSlotAvailable > 0) ||
      (user?.roleId === 4 &&
        ["Sắp diễn ra", "Đang diễn ra"].includes(props.project.status) &&
        classData.studentSlotAvailable > 0)
    ) {
      items.push({
        key: '5',
        label: <AssignStudent classId={classData.classId} project={props.project} refresh={fetchAllClassesOfProject} />
      });
    }

    return items;
  };

  const columns = [
    {
      title: 'Lớp',
      dataIndex: 'classCode',
      key: 'classCode',
      align: 'center',
    },
    {
      title: 'Giảng viên',
      dataIndex: 'lecturerName',
      key: 'teacher',
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'lecturerEmail',
      key: 'lecturerEmail',
      align: 'center',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'lecturerPhone',
      key: 'lecturerPhone',
      align: 'center',
    },
    {
      title: 'Số học viên',
      dataIndex: 'totalTrainee',
      key: 'totalTrainee',
      align: 'center',
    },
    {
      title: 'Slot giảng viên trống',
      key: 'lecturerSlotAvailable',
      dataIndex: 'lecturerSlotAvailable',
      align: 'center',
      render: (text) => (
        <Tag color={text >= 1 ? 'green' : 'orange'}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Slot sinh viên trống',
      key: 'studentSlotAvailable',
      dataIndex: 'studentSlotAvailable',
      align: 'center',
      render: (text) => (
        <Tag color={text >= 1 ? 'green' : 'orange'}>
          {text}
        </Tag>
      ),
    },
    {
      title: '',
      key: 'action',
      render: (record) => (
        <Dropdown
          menu={{
            items: getMenuItems(record),
          }}
          placement="bottomRight"
          trigger={['click']}
        >
          <EllipsisOutlined style={{ fontSize: "18px", color: 'black' }} />
        </Dropdown>
      ),
    },
  ];

  if (!user || !projectId) {
    return <Spinner />
  }

  return (
    <div className={cx('class-table-container')}>
      <div className={cx('project-detail-search')}>
        <div className={cx('search-box-container')}>
          <div className={cx('search-box')}>
            <SearchOutlined color='#285D9A' size={20} />
            <input
              type="search"
              placeholder="Tìm kiếm lớp học"
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
          rowKey="classId"
          dataSource={classList}
          pagination={{
            position: ['bottomCenter'],
            current: pageNumber,
            pageSize: rowsPerPage,
            total: totalItem,
            onChange: (page, pageSize) => {
              setPageNumber(page);
              setRowsPerPage(pageSize);
            },
          }}
        />
      </ConfigProvider>
    </div>
  );
};
