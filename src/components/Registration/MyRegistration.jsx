import React, { useState, useEffect, useCallback } from 'react'
import { SearchOutlined } from "@ant-design/icons";
import classes from './MyRegistration.module.css'
import classNames from 'classnames/bind'
import { RegistrationList } from './RegistrationList/RegistrationList';
import useAuth from '../../hooks/useAuth';


const cx = classNames.bind(classes)

export const MyRegistration = (props) => {
  const [searchValue, setSearchValue] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const { user } = useAuth();

  // Dùng useCallback để tránh re-creation của fetchProjects
  const fetchMyRegistrations = useCallback(async (query = '') => {
    if (!user?.accountId) return;

    try {
      const response = await fetch(
        `https://communityprojecthubdemo.azurewebsites.net/api/Registration/registrations?accountId=${user.accountId}&search=${query}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu');
      const data = await response.json();
      setRegistrations(data.result);
    } catch (error) {
      console.error('Lỗi lấy các đơn đăng kí:', error);
    }
  }, [user?.accountId]);

  // Fetch khi user đã có accountId
  useEffect(() => {
    fetchMyRegistrations();
  }, [fetchMyRegistrations]);


  useEffect(() => {
    const timer = setTimeout(() => fetchMyRegistrations(searchValue), 500);
    return () => clearTimeout(timer);
  }, [searchValue, fetchMyRegistrations]);

  const handleSearch = () => {
    fetchMyRegistrations(searchValue);
  };

  return (
    <div className={cx("my-registration-container")}>
      <h2 className={cx("my-registration-title")}>Danh sách đơn ứng tuyển</h2>
      <div className={cx("my-registration-search")}>
        <div className={cx("search-box-container")}>
          <div className={cx("search-box")}>
            <SearchOutlined color="#285D9A" size={20} />
            <input
              type="search"
              placeholder="Tìm kiếm đơn đăng ký"
              className={cx("search-input")}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Nhấn Enter để tìm kiếm
            />
          </div>
          <button className={cx("search-button")} >
            <SearchOutlined color="white" size={20} style={{ marginRight: "5px" }} />
            Tìm kiếm
          </button>
        </div>
      </div>
      <RegistrationList registrations={registrations} />
    </div>
  );
}
