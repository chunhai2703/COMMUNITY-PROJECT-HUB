import React, { useEffect, useState } from 'react'
import classes from './ChatList.module.css'
import classNames from 'classnames/bind';
import { SearchOutlined } from '@ant-design/icons';
import { ChatItem } from '../ChatItem/ChatItem';
import useAuth from '../../../hooks/useAuth';
import { Spinner } from '../../Spinner/Spinner';
import { GetChatClasses } from '../../../services/MessageApi';


const cx = classNames.bind(classes);


export const ChatList = () => {

  const { user } = useAuth();

  const [classGroup, setClassGroup] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const fetchClassGroup = async () => {
    const response = await GetChatClasses(searchValue, user.accountId);
    const responseData = await response.json();
    if (response.ok) {
      setClassGroup(responseData.result);
    } else {
      setClassGroup([]);
      console.log("Fetch class group error");
    }
  }

  useEffect(() => {
    if (user) {
      fetchClassGroup();
    }
  }, [user])

  const handleSearch = async () => {
    fetchClassGroup();
  }

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchValue.trim() === "") {
        fetchClassGroup();
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchValue]);

  if (!user) {
    return <Spinner />
  }

  return (
    <div className={cx('chat-list-container')}>
      <div className={cx('chat-list-header')}>
        <h2 className={cx('chat-list-title')}>Tin nhắn</h2>
        <div className={cx('chat-list-search')}>
          <input
            type="search" p
            laceholder="Tìm kiếm đoạn chat"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
          <SearchOutlined />
        </div>
      </div>

      <div className={cx('chat-list')}>
        {classGroup && classGroup.map((item) => (
          <ChatItem
            key={item.classId}
            id={item.classId}
            classCode={item.classCode}
            projectTitle={item.projectTitle}
            contentSender={item.contentSender}
            content={item.content}
            contentTimestamp={item.contentTimestamp}
          />
        ))}
      </div>
    </div>
  )
}
