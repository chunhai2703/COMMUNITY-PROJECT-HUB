import React from 'react'
import { SettingOutlined, HomeOutlined, FolderOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
const items = [
  {
    key: 'home',
    label: 'Trang Chủ',
    icon: <HomeOutlined style={{ fontSize: 18 }} />,
  },
  {
    key: 'account',
    label: 'Tài khoản',
    icon: <TeamOutlined style={{ fontSize: 18 }} />,
  },
  {
    key: 'setting',
    label: 'Cài Đặt',
    icon: <SettingOutlined style={{ fontSize: 18 }} />,
    children: [
      {
        key: 'profile',
        label: 'Hồ Sơ Cá Nhân',
      },

    ],
  },
  {
    key: "message",
    label: "Tin Nhắn",
    icon: (
      <MailOutlined style={{ fontSize: 18 }} />
    ),
  }
];

export const SideBarAdmin = () => {
  const navigate = useNavigate();
  const onClick = (e) => {
    console.log('click ', e);
    if (e.key === 'home') {
      navigate('/home-admin')
    }
    if (e.key === 'profile') {
      navigate('/home-admin/view-profile')
    }
    if (e.key === 'account') {
      navigate('/home-admin/account-management')
    }
  };
  return (
    <Menu
      onClick={onClick}
      style={{
        width: 256,
        fontSize: 18,
        backgroundColor: "#F3F4F7",
        color: 'black'
      }}
      defaultSelectedKeys={['home']}
      // defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
    />
  );
}
