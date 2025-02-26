import React from 'react'
import classes from './ChatLayout.module.css'
import classNames from 'classnames/bind';
import { ChatList } from '../ChatList/ChatList';
import { Outlet } from 'react-router-dom';

const cx = classNames.bind(classes);



export const ChatLayout = () => {
  return (
    <div className={cx('chat-layout')}>
      <ChatList />
      <main className={cx('main')}>
        <Outlet/>
      </main>
    </div>
  )
}
