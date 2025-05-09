import React, { useState } from "react";
import {
  SettingOutlined,
  HomeOutlined,
  TeamOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

export const SideBarAdmin = () => {
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
      onClick: () => navigate("/home-admin"),
    },
    {
      key: "account",
      label: "Quản lý tài khoản",
      icon: <TeamOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate("/home-admin/account-management"),
    },
    {
      key: "feedback-time",
      label: "Thời gian đánh giá",
      icon: <ClockCircleOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate("/home-admin/feedback-time"),
    },
    {
      key: "profile",
      label: "Hồ sơ cá nhân",
      icon: <UserOutlined style={{ fontSize: collapsed ? 20 : 18 }} />,
      onClick: () => navigate("/home-admin/view-profile"),
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
