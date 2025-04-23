import React, { useState } from "react";
import {
  SettingOutlined,
  HomeOutlined,
  FolderOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SnippetsOutlined,
  InteractionOutlined,
  CalendarOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

export const SideBarTrainee = () => {
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
      onClick: () => navigate("/home-trainee"),
    },
    {
      key: "projects",
      label: "Dự án",
      icon: <FolderOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate("/home-trainee/all-related-projects"),
    },
    {
      key: "my-schedule",
      label: "Thời khóa biểu",
      icon: <CalendarOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate("/home-trainee/my-schedule"),
    },
    {
      key: "my-classes",
      label: "Lớp học của tôi",
      icon: <SnippetsOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate("/home-trainee/my-classes"),
    },
    {
      key: "change-class",
      label: "Chuyển lớp",
      icon: <InteractionOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate("/home-trainee/change-class"),
    },
    {
      key: "feedback",
      label: "Đánh giá lớp học",
      icon: <MailOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate("/home-trainee/project-feedback"),
    },
    {
      key: "message",
      label: "Tin nhắn",
      icon: collapsed ? (
        <MessageOutlined style={{ fontSize: 20 }} />
      ) : (
        <MessageOutlined style={{ fontSize: 18 }} />
      ),
      onClick: () => navigate("/home-trainee/chat"),
    },
    {
      key: "profile",
      label: "Hồ sơ cá nhân",
      icon: <UserOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate("/home-trainee/view-profile"),
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
