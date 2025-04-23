import React, { useState } from "react";
import {
  SettingOutlined,
  HomeOutlined,
  FolderOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SolutionOutlined,
  SnippetsOutlined,
  AreaChartOutlined,
  CalendarOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

export const SideBarLecturer = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const items = [
    {
      key: "toggle",
      label: "",
      icon: collapsed ? (
        <MenuUnfoldOutlined style={{ fontSize: collapsed ? 20 : 18 }} />
      ) : (
        <MenuFoldOutlined style={{ fontSize: collapsed ? 20 : 18 }} />
      ),
      onClick: toggleCollapse,
    },
    {
      key: "home",
      label: "Trang chủ",
      icon: <HomeOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate("/home-lecturer"),
    },
    {
      key: "dashboard-project-manager",
      label: "Thống kê",
      icon: <AreaChartOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate("/home-lecturer/dashboard"),
    },
    {
      key: "projects",
      label: "Dự án",
      icon: <FolderOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      children: [
        {
          key: "all-related-projects",
          label: "Dự án của tôi",
          onClick: () => navigate("/home-lecturer/all-related-projects"),
        },
        {
          key: "all-available-projects",
          label: "Dự án khác",
          onClick: () => navigate("/home-lecturer/all-available-projects"),
        },
      ],
    },
    {
      key: "my-registration",
      label: "Ứng tuyển của tôi",
      icon: <SolutionOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate("/home-lecturer/my-registration"),
    },
    {
      key: "my-schedule",
      label: "Thời khóa biểu",
      icon: <CalendarOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate("/home-lecturer/my-schedule"),
    },
    {
      key: "my-classes",
      label: "Lớp học của tôi",
      icon: <SnippetsOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate("/home-lecturer/my-classes"),
    },
    {
      key: "message",
      label: "Tin nhắn",
      icon: collapsed ? (
        <MessageOutlined style={{ fontSize: 20 }} />
      ) : (
        <MessageOutlined style={{ fontSize: 18 }} />
      ),
      onClick: () => navigate("/home-lecturer/chat"),
    },
    {
      key: "profile",
      label: "Hồ sơ cá nhân",
      icon: <UserOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate("/home-lecturer/view-profile"),
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
        color: "black",
        transition: "width 0.3s",
      }}
      defaultSelectedKeys={["home"]}
      inlineCollapsed={collapsed}
      theme="light"
      mode="inline"
      items={items}
    />
  );
};
