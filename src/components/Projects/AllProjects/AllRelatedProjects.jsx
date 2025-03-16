import React, { useState, useEffect, useCallback, useRef } from 'react';
import classNames from 'classnames/bind';
import { SearchOutlined } from '@ant-design/icons';
import { ProjectsList } from './ProjectsList/ProjectsList';
import useAuth from '../../../hooks/useAuth';
import styles from './AllRelatedProjects.module.css';

const cx = classNames.bind(styles);

export const AllRelatedProjects = () => {
  const [searchValue, setSearchValue] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const debounceRef = useRef(null);

  // Hàm gọi API lấy danh sách dự án liên quan
  const fetchProjects = useCallback(async (query = '') => {
    if (!user?.accountId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5145/api/Project/all-related-project?searchValue=${query}&userId=${user.accountId}`,
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

  return (
    <div className={cx('all-related-projects-container')}>
      <h2 className={cx('all-related-projects-title')}>Dự Án Cộng Đồng</h2>

      <div className={cx('all-related-projects-search')}>
        <div className={cx('search-box-container')}>
          <div className={cx('search-box')}>
            <SearchOutlined style={{ color: '#285D9A', fontSize: 20 }} />
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
      </div>

      <ProjectsList projects={projects} />
    </div>
  );
};
