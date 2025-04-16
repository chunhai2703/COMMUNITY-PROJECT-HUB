import React, { useState, useEffect, useCallback, useRef } from 'react';
import classNames from 'classnames/bind';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { ProjectsList } from './ProjectsList/ProjectsList';
import useAuth from '../../../hooks/useAuth';
import styles from './AllRelatedProjects.module.css';
import { Select } from 'antd';

const cx = classNames.bind(styles);
const baseUrl = process.env.REACT_APP_API_URL;

export const AllRelatedProjects = () => {
  const [searchValue, setSearchValue] = useState('');
  const [projects, setProjects] = useState([]);
  const [filterField, setFilterField] = useState("");
  const [filterOrder, setFilterOrder] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const debounceRef = useRef(null);

  // Hàm gọi API lấy danh sách dự án liên quan
  const fetchProjects = useCallback(async (query = '', filterField = '', filterOrder = '') => {
    if (!user?.accountId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${baseUrl}/api/Project/all-related-project?searchValue=${query}&userId=${user.accountId}&filterField=${filterField}&filterOrder=${filterOrder}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu');
      const data = await response.json();
      setProjects(data.result);
    } catch (error) {
      console.error('Lỗi lấy dự án:', error);
      setError(error.message || 'Đã có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  }, [user?.accountId]);

  // Gọi API khi user có accountId
  useEffect(() => {
    if (user?.accountId) {
      fetchProjects();
    }
  }, [fetchProjects, user]);

  // Debounce searchValue
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchProjects(searchValue);
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [searchValue, fetchProjects]);

  // Xử lý khi nhấn nút tìm kiếm
  const handleSearch = () => {
    fetchProjects(searchValue);
  };

  const handleFilter = useCallback(() => {
    if (filterField && filterOrder) {
      fetchProjects("", filterField, filterOrder);
    } else {
      alert("Vui lòng chọn cả trường lọc và thứ tự lọc!");
    }
  }, [fetchProjects, filterField, filterOrder]);

  useEffect(() => {
    if (filterField && filterOrder) {
      handleFilter();
    }
  }, [filterField, filterOrder, handleFilter]);

  return (
    <div className={cx('all-related-projects-container')}>
      <h2 className={cx('all-related-projects-title')}>Dự Án Cộng Đồng</h2>

      <div className={cx('all-related-projects-search')}>
        <div className={cx('search-box-container')}>
          <div className={cx('search-box')}>
            <input
              type='search'
              placeholder='Tìm kiếm dự án'
              className={cx('search-input')}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button className={cx('search-button')} onClick={handleSearch}>
            <SearchOutlined style={{ color: 'white', marginRight: 5 }} /> Tìm kiếm
          </button>
        </div>
        <div className={cx('filter-container')}>
          <Select
            size="large"
            variant="outlined"
            suffixIcon={<FilterOutlined />}
            style={{
              width: 150,
            }}
            placeholder="Trường lọc"
            optionFilterProp="label"
            options={[
              {
                value: 'Title',
                label: 'Tên dự án',
              },
              {
                value: 'StartDate',
                label: 'Ngày bắt đầu',
              },
              {
                value: 'EndDate',
                label: 'Ngày kết thúc',
              },
              {
                value: 'CreatedDate',
                label: 'Ngày tạo',
              },
            ]}
            value={filterField || undefined}
            onChange={(value) => setFilterField(value)}
          />

          <Select
            size="large"
            variant="outlined"
            suffixIcon={<FilterOutlined />}
            style={{
              width: 150,
            }}
            placeholder="Thứ tự lọc"
            optionFilterProp="label"
            options={[
              {
                value: 'ASC',
                label: 'Tăng dần',
              },
              {
                value: 'DESC',
                label: 'Giảm dần',
              },
            ]}
            value={filterOrder || undefined}
            onChange={(value) => setFilterOrder(value)}
          />
        </div>
      </div>

      <ProjectsList projects={projects} />
    </div>
  );
};
