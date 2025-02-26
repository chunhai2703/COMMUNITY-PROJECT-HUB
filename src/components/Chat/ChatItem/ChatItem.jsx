import React from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar } from 'antd';
import classNames from 'classnames/bind';
import classes from './ChatItem.module.css';
import { UserOutlined } from '@ant-design/icons';

const cx = classNames.bind(classes);

export const ChatItem = (props) => {
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
          <h2 className={cx('title', { 'unread-title': props.status === 0 })}>
            {props.title}
          </h2>
        </div>
        <div className={cx('chat-item-content', { 'unread-content': props.status === 0 })}>
          <span className={cx('user')}>{props.user}: </span>
          <span className={cx('message')}>{props.message}</span> |
          <span className={cx('time')}>{props.time} phút</span>
        </div>
      </div>
    </NavLink>
  );
};
