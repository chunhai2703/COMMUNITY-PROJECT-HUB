import React, { useState } from 'react'
import { SettingOutlined, HomeOutlined, FolderOutlined, MailOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SolutionOutlined, SnippetsOutlined, CalendarOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

export const SideBarStudent = () => {
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
      onClick: () => navigate('/home-student'),

    },
    {
      key: 'projects',
      label: 'Dự Án',
      icon: <FolderOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      children: [
        {
          key: 'all-related-projects',
          label: 'Dự Án Của Tôi',
          onClick: () => navigate('/home-student/all-related-projects'),
        }, {
          key: 'all-available-projects',
          label: 'Dự Án Khác',
          onClick: () => navigate('/home-student/all-available-projects'),
        }
      ]
    },
    {
      key: 'my-registration',
      label: 'Ứng Tuyển Của Tôi',
      icon: <SolutionOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate('/home-student/my-registration'),
    },
    {
      key: 'my-schedule',
      label: 'Thời khóa biểu',
      icon: <CalendarOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate('/home-student/my-schedule'),
    },
    {
      key: 'my-classes',
      label: 'Lớp Học Của Tôi',
      icon: <SnippetsOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate('/home-student/my-classes'),
    },
    {
      key: 'setting',
      label: 'Cài Đặt',
      icon: <SettingOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      children: [
        {
          key: 'profile',
          label: 'Hồ Sơ Cá Nhân',
          onClick: () => navigate('/home-student/view-profile'),
        },
      ],
    },
    {
      key: 'message',
      label: 'Tin Nhắn',
      icon: collapsed ? (
        <MailOutlined style={{ fontSize: 20 }} />
      ) : (
        <MailOutlined style={{ fontSize: 18 }} />
      ),
      onClick: () => navigate('/home-student/chat'),
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
}
