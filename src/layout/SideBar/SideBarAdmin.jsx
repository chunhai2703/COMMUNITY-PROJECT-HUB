import React, { useState } from 'react'
import { SettingOutlined, HomeOutlined, FolderOutlined, MailOutlined, TeamOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

export const SideBarAdmin = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const items = [
    {
      key: 'toggle',
      label: "",
      icon: collapsed ? <MenuUnfoldOutlined style={{ fontSize: collapsed ? 20 : 18 }} /> : <MenuFoldOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: toggleCollapse,
    },
    {
      key: 'home',
      label: 'Trang Chủ',
      icon: <HomeOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate('/home-admin'),
    },
    {
      key: 'account',
      label: 'Tài khoản',
      icon: <TeamOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate('/home-admin/account-management'),
    },
    {
      key: 'setting',
      label: 'Cài Đặt',
      icon: <SettingOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      children: [
        {
          key: 'profile',
          label: 'Hồ Sơ Cá Nhân',
          onClick: () => navigate('/home-admin/view-profile'),
        },

      ],
    },
    // {
    //   key: "message",
    //   label: "Tin Nhắn",
    //   icon: (
    //     <MailOutlined style={{ fontSize: 18 }} />
    //   ),
    // }
  ];

  // const onClick = (e) => {
  //   console.log('click ', e);
  //   if (e.key === 'home') {
  //     navigate('/home-admin')
  //   }
  //   if (e.key === 'profile') {
  //     navigate('/home-admin/view-profile')
  //   }
  //   if (e.key === 'account') {
  //     navigate('/home-admin/account-management')
  //   }
  // };
  return (
    <Menu
      onClick={(e) => {
        const item = items.find((i) => i.key === e.key);
        if (item?.onClick) item.onClick();
      }}
      style={{
        width: collapsed ? 90 : 256,
        fontSize: 18,
        backgroundColor: "#F3F4F7",
        color: 'black',
        transition: 'width 0.3s',
      }}
      defaultSelectedKeys={['home']}
      inlineCollapsed={collapsed}
      theme='light'
      mode="inline"
      items={items}
    />
  );
}
