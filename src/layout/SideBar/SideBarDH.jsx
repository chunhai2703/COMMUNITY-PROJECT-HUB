import React from 'react'
import { SettingOutlined, HomeOutlined, FolderOutlined, MailOutlined } from '@ant-design/icons';
import { Badge, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
const items = [
  {
    key: 'home',
    label: 'Trang Chủ',
    icon: <HomeOutlined style={{ fontSize: 18 }} />,
  },
  {
    key: 'project',
    label: 'Dự Án',
    icon: <FolderOutlined style={{ fontSize: 18 }} />,
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
    icon: (<Badge count={5} size='small'>
      <MailOutlined style={{ fontSize: 18 }} />
    </Badge>),
  }
];

export const SideBarDH = () => {
  const navigate = useNavigate();
  const onClick = (e) => {
    console.log('click ', e);
    if (e.key === 'home') {
      navigate('/home-department-head')
    }
    if (e.key === 'project') {
      navigate('/home-department-head/projects')
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
