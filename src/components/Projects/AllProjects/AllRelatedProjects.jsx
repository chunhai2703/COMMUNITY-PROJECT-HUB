import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames/bind';
import { SearchOutlined } from '@ant-design/icons';
import { ProjectsList } from './ProjectsList/ProjectsList';
import useAuth from '../../../hooks/useAuth';
import styles from './AllRelatedProjects.module.css';

const cx = classNames.bind(styles);

export const AllRelatedProjects = () => {
  const [searchValue, setSearchValue] = useState('');
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();

  // Dùng useCallback để tránh re-creation của fetchProjects
  const fetchProjects = useCallback(async (query = '') => {
    if (!user?.accountId) return;

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
    }
  }, [user?.accountId]); 

  // Fetch khi user đã có accountId
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]); 

  
  useEffect(() => {
    if (!searchValue.trim()) return;
    const timer = setTimeout(() => fetchProjects(searchValue), 500);
    return () => clearTimeout(timer);
  }, [searchValue, fetchProjects]); 

  const handleSearch = () => {
    if (!searchValue.trim()) return;
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
