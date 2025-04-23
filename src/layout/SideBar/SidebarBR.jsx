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
  InboxOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

export const SideBarBR = () => {
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
      onClick: () => navigate("/home-business-relation"),
    },
    {
      key: "projects",
      label: "Dự án",
      icon: <FolderOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate("/home-business-relation/projects"),
    },
    {
      key: "feeback-management",
      label: "Quản lý đánh giá",
      icon: <InboxOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate("/home-business-relation/feedback-management"),
    },
    {
      key: "profile",
      label: "Hồ sơ cá nhân",
      icon: <UserOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate("/home-business-relation/view-profile"),
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
