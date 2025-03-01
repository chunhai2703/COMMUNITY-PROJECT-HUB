import React from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar } from 'antd';
import classNames from 'classnames/bind';
import classes from './ChatItem.module.css';
import { UserOutlined } from '@ant-design/icons';

const cx = classNames.bind(classes);

export const ChatItem = (props) => {
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

  return (
    <NavLink
      className={({ isActive }) => cx('chat-item-container', { active: isActive })}
      to={`${props.id}`} // Đường dẫn động theo ID
    >
      <div className={cx('chat-item')}>
        <div className={cx('chat-item-title')}>
          <Avatar
            style={{
              backgroundColor: '#87d068',
              fontSize: '16px',
            }}
            icon={<UserOutlined />}
          />
          <h2 className={cx('title')}>
            {props.classCode} - {props.projectTitle}
          </h2>
        </div>
        {props.content && (
          <div className={cx('chat-item-content')}>
            <span className={cx('user')}>{props.contentSender}: </span>
            <span className={cx('message')}>{props.content}</span> |
            <span className={cx('time')}>{formatTimeAgo(props.contentTimestamp)}</span>
          </div>
        )}

      </div>
    </NavLink>
  );
};
