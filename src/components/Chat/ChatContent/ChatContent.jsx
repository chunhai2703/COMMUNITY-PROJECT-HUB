import React, { useRef, useEffect, useState } from 'react';
import classes from './ChatContent.module.css';
import classNames from 'classnames/bind';
import { Avatar, Badge, Button, Tooltip } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import useAuth from '../../../hooks/useAuth';
import { CreateMessage, GetMessage } from '../../../services/MessageApi';
import { useParams } from 'react-router-dom';
import { Spinner } from '../../Spinner/Spinner';

const cx = classNames.bind(classes);
const baseWebSocketUrl = process.env.REACT_APP_WEB_SOCKET_URL;

export const ChatContent = () => {
  const { user } = useAuth();
  const { classId } = useParams();

  const [messages, setMessages] = useState([]);
  const [groupChatData, setGroupChatData] = useState(null);
  const [textMessage, setTextMessage] = useState('');
  const messagesEndRef = useRef(null);
  const ws = useRef(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  };


  const fetchMessage = async () => {
    const response = await GetMessage(user.accountId, classId);
    const responseData = await response.json();
    if (response.ok) {
      setMessages(responseData.result.messageResponseDTOs);
      setGroupChatData(responseData.result);
    } else {
      setMessages([]);
      setGroupChatData(null);
      console.log('Fetch message list fail');
    }
  };
  useEffect(() => {
    if (user && classId) {
      fetchMessage();
    }
  }, [user, classId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (!user || !classId) return;

    const socketUrl = `${baseWebSocketUrl}/ws`;
    ws.current = new WebSocket(socketUrl);

    ws.current.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.current.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      if (newMessage.Type === "Message" && newMessage.ClassId == classId) {
        console.log(messages)
        const parsedMessage = {
          messageId: newMessage.MessageId,
          content: newMessage.Content,
          createdDate: newMessage.CreatedDate,
          sendAccountId: newMessage.SendAccountId,
          classId: newMessage.ClassId,
          sendAccountName: newMessage.SendAccountName
        }
        console.log(parsedMessage)
        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [classId, user]);

  if (!classId) {
    return (
      <div className='flex justify-center items-center h-full bg-gray-100'>
        <p className='text-3xl font-bold' style={{ textAlign: 'center' }}>Hãy chọn một nhóm chat để bắt đầu</p>
      </div>
    );
  }
  if (!user) {
    return <Spinner />
  }

  const handleOnSendMessage = async () => {
    if (textMessage === '') return;

    const messageData = {
      content: textMessage,
      accountId: user.accountId,
      classId: classId,
    };

    const response = await CreateMessage(messageData);
    setTextMessage('');

    if (response.ok) {
      fetchMessage();
    } else {
      console.log('Send message fail');
    }
  };

  return (
    <div className={cx('chat-content-container')}>
      <div className={cx('chat-content-header')}>
        <Badge dot style={{ backgroundColor: '#52c41a', fontSize: '12px' }}>
          <Avatar style={{ backgroundColor: '#87d068', fontSize: '16px' }} icon={<UserOutlined />} size={40} />
        </Badge>

        <div className={cx('chat-content-title')}>
          <h3 className={cx('title')}>
            {groupChatData && groupChatData.classCode} - {groupChatData && groupChatData.projectTitle}
          </h3>
        </div>
      </div>

      <div className={cx('chat-content-body')}>
        {messages.map((message) => (
          <div key={message.messageId} className={cx('chat-message-container', { 'user-container': message.sendAccountId === user.accountId })}>
            {message.sendAccountId !== user.accountId && (
              <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00', marginTop: '5px' }} icon={<UserOutlined />} />
            )}
            <div className={cx('chat-message')}>
              {message.sendAccountId !== user.accountId && <p className={cx('sender')}>{message.sendAccountName}</p>}
              <div className={cx(message.sendAccountId === user.accountId ? 'user-message' : 'admin-message')}>
                <Tooltip title={formatDate(message.createdDate)} placement={message.sendAccountId === user.accountId ? 'left' : 'right'}>
                  <p>{message.content}</p>
                </Tooltip>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={cx('chat-content-footer')}>
        <input
          type="text"
          placeholder="Nhập tin nhắn"
          className={cx('chat-input')}
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleOnSendMessage()}
        />
        <Button className="p-5" style={{ backgroundColor: '#007BFF', color: 'white' }} onClick={handleOnSendMessage}>
          <SendOutlined />
        </Button>
      </div>
    </div>
  );
};
