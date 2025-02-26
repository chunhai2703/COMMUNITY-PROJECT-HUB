import React, { useState } from 'react';
import { SettingOutlined, HomeOutlined, FolderOutlined, MailOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Badge, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

export const SideBarDH = () => {
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
      onClick: () => navigate('/home-department-head'),

    },
    {
      key: 'project',
      label: 'Dự Án',
      icon: <FolderOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate('/home-department-head/projects'),
    },
    {
      key: 'setting',
      label: 'Cài Đặt',
      icon: <SettingOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      children: [
        {
          key: 'profile',
          label: 'Hồ Sơ Cá Nhân',
          onClick: () => navigate('/home-department-head/view-profile'),
        },
      ],
    },
    {
      key: 'message',
      label: 'Tin Nhắn',
      icon: collapsed ? (
        <span style={{ marginTop: '10px' }}>
          <Badge count={5} size='default'>
            <MailOutlined style={{ fontSize: 20 }} />
          </Badge>
        </span>
      ) : (
        <Badge count={5} size={'small'}>
          <MailOutlined style={{ fontSize: 18 }} />
        </Badge>
      ),
      onClick: () => navigate('/home-department-head/chat'),
    },
  ];

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
};
