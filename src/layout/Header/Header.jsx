import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo-fpt.png';
import classes from './Header.module.css';
import classNames from 'classnames/bind';
import { BellOutlined } from '@ant-design/icons';
import Avatar from 'antd/es/avatar/avatar';
import { Badge } from 'antd';
import { Logout } from '../../services/AuthenApi';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../../components/Spinner/Spinner';


const cx = classNames.bind(classes);

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [avatarBackground, setAvatarBackground] = useState('');

  // Function tạo màu ngẫu nhiên
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Xử lý màu nền avatar nếu không có ảnh
  useEffect(() => {
    if (user && !user.avatarLink) {
      let storedColor = sessionStorage.getItem('avatarBackground');
      if (!storedColor) {
        storedColor = getRandomColor();
        sessionStorage.setItem('avatarBackground', storedColor);
      }
      setAvatarBackground(storedColor);
    }
  }, [user]);

  // Ngăn lỗi khi user chưa load xong
  if (user === null) {
    return <Spinner />;
  }

  const userName = user.fullName ? user.fullName.split(" ")[0] : "Guest";
  const avatarColor = user.avatarLink ? '' : '#fff';

  // Xử lý logout
  const handleClickLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await Logout(refreshToken);
    if (response.ok) {
      await logout();
      navigate("/");
    }
  };

  return (
    <header className={cx('header')}>
      <img src={logo} alt="logo" className={cx('logo')} />
      <nav className={cx('nav')}>
        <ul className={cx('nav-list')}>
          <li>
            <div className={cx('nav-item-notification')}>
              <Badge count={5} size="small">
                <BellOutlined style={{ fontSize: "20px", color: 'white' }} />
              </Badge>
              <span style={{ fontSize: "13px" }}>Thông báo</span>
            </div>
          </li>
          <li>
            <div className={cx('nav-item-avatar')}>
              <Avatar
                src={user.avatarLink ? <img src={user.avatarLink} alt="avatar" /> : null}
                style={{ backgroundColor: avatarBackground, color: avatarColor }}
                size={45}
              >
                {!user.avatarLink ? userName.charAt(0) : ''}
              </Avatar>
              <div className={cx('user-info')}>
                <p>{user.fullName}</p>
                <button onClick={handleClickLogout}>Log out</button>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
};
