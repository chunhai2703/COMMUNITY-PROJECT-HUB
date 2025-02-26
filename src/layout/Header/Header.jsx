import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo-fpt.png';
import classes from './Header.module.css';
import classNames from 'classnames/bind';
import { BellOutlined } from '@ant-design/icons';
import Avatar from 'antd/es/avatar/avatar';
import { Badge, Dropdown, Menu } from 'antd';
import { Logout } from '../../services/AuthenApi';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../../components/Spinner/Spinner';
import { GetAllANotification } from '../../services/Notification';

const cx = classNames.bind(classes);
const baseWebSocketUrl = process.env.REACT_APP_WEB_SOCKET_URL;

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [avatarBackground, setAvatarBackground] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  // Hàm lấy màu random cho avatar
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Fetch danh sách thông báo khi component mount
  useEffect(() => {
    if (user && !user.avatarLink) {
      let storedColor = sessionStorage.getItem('avatarBackground');
      if (!storedColor) {
        storedColor = getRandomColor();
        sessionStorage.setItem('avatarBackground', storedColor);
      }
      setAvatarBackground(storedColor);
    }

    if (user) {
      fetchNotification();

      const ws = new WebSocket(`${baseWebSocketUrl}/ws`);

      ws.onopen = () => {
        console.log("WebSocket Connected!");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data)
        if (data.Type === "Notification" && data.AccountId == user.userId) {
          fetchNotification();
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket Disconnected");
      };

      setSocket(ws);

      return () => {
        ws.close();
      };
    }
  }, [user]);

  const fetchNotification = async () => {
    const response = await GetAllANotification(user.accountId);
    const responseData = await response.json();
    if (response.ok) {
      setNotifications(responseData.result);
    } else {
      setNotifications([]);
    }
  };

  const formatTimeAgo = (createdDate) => {
    const now = new Date();
    const created = new Date(createdDate);
    const diffInSeconds = Math.floor((now - created) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} tuần trước`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} tháng trước`;
    return `${Math.floor(diffInDays / 365)} năm trước`;
  };

  const handleClickLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await Logout(refreshToken);
    if (response.ok) {
      await logout();
      navigate("/");
    }
  };


  const notificationMenu = (
    <Menu style={{ width: "300px", padding: 0, maxHeight: "800px", overflowY: "auto" }}>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <Menu.Item
            key={notification.notificationId}
            style={{
              borderBottom: index !== notifications.length - 1 ? "1px solid #ddd" : "none",
              padding: "10px",
            }}
          >
            <p
              style={{
                fontSize: '16px',
                fontWeight: "bold",
                color: notification.isRead ? "gray" : "black"
              }}>
              {notification.messageContent}
            </p>
            <p
              style={{
                fontSize: '14px',
                color: notification.isRead ? "gray" : "rgb(22, 119, 255)"
              }}>
              {formatTimeAgo(notification.createdDate)}
            </p>
          </Menu.Item>
        ))
      ) : (
        <Menu.Item style={{ textAlign: "center", color: "red" }}>Không có thông báo</Menu.Item>
      )}
    </Menu>
  );

  if(!user) {
    return <Spinner />
  }

  return (
    <header className={cx('header')}>
      <img src={logo} alt="logo" className={cx('logo')} />
      <nav className={cx('nav')}>
        <ul className={cx('nav-list')}>
          <li>
            <Dropdown overlay={notificationMenu} trigger={['click']} placement="bottomRight">
              <div className={cx('nav-item-notification')} style={{ cursor: 'pointer' }}>
                <Badge count={notifications.length} size="small">
                  <BellOutlined style={{ fontSize: "20px", color: 'white' }} />
                </Badge>
                <span style={{ fontSize: "13px" }}>Thông báo</span>
              </div>
            </Dropdown>
          </li>
          <li>
            <div className={cx('nav-item-avatar')}>
              <Avatar
                src={user.avatarLink ? <img src={user.avatarLink} alt="avatar" /> : null}
                style={{ backgroundColor: avatarBackground, color: avatarBackground ? '#fff' : '' }}
                size={45}
              >
                {!user.avatarLink ? user.fullName.charAt(0) : ''}
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
