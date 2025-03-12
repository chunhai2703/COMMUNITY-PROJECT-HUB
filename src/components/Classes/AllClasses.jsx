import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import classes from './AllClasses.module.css';
import useAuth from '../../hooks/useAuth';
import { Spinner } from '../Spinner/Spinner';
import { SearchOutlined } from '@ant-design/icons';
import { ClassList } from './ClassList/ClassList';
import { getAllClassesOfLecturer, getAllClassesOfStudent, getAllClassesOfTrainee } from '../../services/ClassApi';

const cx = classNames.bind(classes);

export const AllClasses = () => {
  const [searchValue, setSearchValue] = useState('');
  const [allClasses, setAllClasses] = useState([]);
  const { user } = useAuth();

  // Hàm fetch dữ liệu với debounce (tối ưu hơn)
  const fetchClasses = useCallback(async (query = '') => {
    if (!user?.accountId) return;

    try {
      if (user.roleId === 1) {
        const data = await getAllClassesOfStudent(user.accountId, query);
        console.log('📢 Dữ liệu từ API:', data.result);
        setAllClasses(data.result || []);
      } else if (user.roleId === 2) {
        const data = await getAllClassesOfLecturer(user.accountId, query);
        console.log('📢 Dữ liệu từ API:', data.result);
        setAllClasses(data.result || []);
      } else if (user.roleId === 3) {
        const data = await getAllClassesOfTrainee(user.accountId, query);
        console.log('📢 Dữ liệu từ API:', data.result);
        setAllClasses(data.result || []);
      }
    
     
    } catch (error) {
      console.error('❌ Lỗi khi lấy lớp của giảng viên:', error);
      setAllClasses([]);
    }
  }, [user?.accountId, user?.roleId]);

  // useEffect gọi API khi lần đầu vào trang
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Xử lý debounce cho tìm kiếm (500ms)
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchClasses(searchValue);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchValue, fetchClasses]);

  // Xử lý khi nhấn nút tìm kiếm
  const handleSearch = () => {
    fetchClasses(searchValue);
  };

  if (!user || !user.accountId) {
    return <Spinner />;
  }

  return (
    <div className={cx('all-classes-container')}>
      <h2 className={cx('all-classes-title')}>{user?.roleId === 3 ? 'Các lớp tham gia' : 'Các lớp được phân công'}</h2>
      <div className={cx('all-classes-search')}>
        <div className={cx('search-box-container')}>
          <div className={cx('search-box')}>
            <input
              type="search"
              placeholder="Tìm kiếm lớp"
              className={cx('search-input')}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button className={cx('search-button')} onClick={handleSearch}>
            <SearchOutlined color="white" size={20} style={{ marginRight: '5px' }} />
            Tìm kiếm
          </button>
        </div>
      </div>
      <ClassList classes={allClasses} />
    </div>
  );
};
