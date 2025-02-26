import React, { useRef, useEffect, useState } from 'react';
import classes from './ChatContent.module.css';
import classNames from 'classnames/bind';
import { Avatar, Badge } from 'antd';
import { PictureOutlined, PlusCircleOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';

const cx = classNames.bind(classes);

export const ChatContent = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'admin', message: 'Bạn cần giúp đỡ gì à?' },
    { id: 2, sender: 'user', message: 'Hong biết nữa' },
    { id: 3, sender: 'user', message: 'Bạn có thể gợi ý được không' },
    { id: 4, sender: 'admin', message: 'Okee' }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Lắng nghe sự thay đổi của messages

  return (
    <div className={cx('chat-content-container')}>
      <div className={cx('chat-content-header')}>
        <Badge dot style={{ backgroundColor: '#52c41a', fontSize: '12px' }}>
          <Avatar style={{ backgroundColor: '#87d068', fontSize: '16px' }} icon={<UserOutlined />} size={40} />
        </Badge>

        <div className={cx('chat-content-title')}>
          <h3 className={cx('title')}>SE1715 - Cách sử dụng A.I. trong giảng dạy</h3>
          <p className={cx('status')}>Đang hoạt động</p>
        </div>
      </div>

      <div className={cx('chat-content-body')}>
        {messages.map((message) => (
          <div key={message.id} className={cx("chat-message-container", { "user-container": message.sender === "user" })}>
            {message.sender === "admin" && (
              <Avatar
                style={{
                  backgroundColor: "#fde3cf",
                  color: "#f56a00",
                  marginTop: "5px",
                }}
                icon={<UserOutlined />}
              />
            )}
            <div className={cx("chat-message")}>
              {message.sender === "admin" && (
                <p className={cx("sender")}>{message.sender}</p>
              )}
              <div className={cx(message.sender === "user" ? "user-message" : "admin-message")}>
                <p>{message.message}</p>
              </div>
            </div>
          </div>

        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={cx('chat-content-footer')}>
        <input type="text" placeholder="Nhập tin nhắn" className={cx('chat-input')} />
        <PlusCircleOutlined />
        <PictureOutlined />
        <SendOutlined />
      </div>
    </div>
  );
};
