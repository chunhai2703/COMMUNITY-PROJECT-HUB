import React, { useState } from 'react'
import classes from './ChatList.module.css'
import classNames from 'classnames/bind';
import { SearchOutlined } from '@ant-design/icons';
import { ChatItem } from '../ChatItem/ChatItem';


const cx = classNames.bind(classes);

const DUMMY = [
  {
    id: '1',
    title: 'SE1715 - Cách sử dụng A.I. trong giảng dạy',
    user: 'Ocean',
    message: "Tui biết rồi",
    time: 7,
    status: 1
  },
  {
    id: '2',
    title: 'SE1700 - Hướng dẫn tin học văn phòng',
    user: 'Mark',
    message: "Tui hong biết làm cái này thì làm sao?",
    time: 19,
    status: 0
  },
  {
    id: '3',
    title: 'SE1715 - Cách sử dụng A.I. trong giảng dạy',
    user: 'Ocean',
    message: "Tui biết rồi",
    time: 7,
    status: 1
  },
  {
    id: '4',
    title: 'SE1715 - Cách sử dụng A.I. trong giảng dạy',
    user: 'Ocean',
    message: "Tui biết rồi",
    time: 7,
    status: 1
  },
  {
    id: '5',
    title: 'SE1715 - Cách sử dụng A.I. trong giảng dạy',
    user: 'Ocean',
    message: "Tui biết rồi",
    time: 7,
    status: 1
  },
  {
    id: '6',
    title: 'SE1715 - Cách sử dụng A.I. trong giảng dạy',
    user: 'Ocean',
    message: "Tui biết rồi",
    time: 7,
    status: 1
  },
  {
    id: '7',
    title: 'SE1715 - Cách sử dụng A.I. trong giảng dạy',
    user: 'Ocean',
    message: "Tui biết rồi",
    time: 7,
    status: 1
  },
  {
    id: '8',
    title: 'SE1715 - Cách sử dụng A.I. trong giảng dạy',
    user: 'Ocean',
    message: "Tui biết rồi",
    time: 7,
    status: 0
  },
]

export const ChatList = () => {
  return (
    <div className={cx('chat-list-container')}>
      <div className={cx('chat-list-header')}>
        <h2 className={cx('chat-list-title')}>Tin nhắn</h2>
        <div className={cx('chat-list-search')}>
          <input type="search" placeholder="Tìm kiếm đoạn chat" />
          <SearchOutlined />
        </div>
      </div>

      <div className={cx('chat-list')}>
        {DUMMY.map((item) => (
          <ChatItem
            key={item.id}
            id={item.id}
            title={item.title}
            user={item.user}
            message={item.message}
            time={item.time}
            status={item.status}
          />
        ))}
      </div>
    </div>
  )
}
