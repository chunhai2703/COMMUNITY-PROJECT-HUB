import React, { useState } from "react";
import { Delete, Edit, MoreHorizOutlined, Person } from "@mui/icons-material";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
} from "@mui/material";
import { Tag } from "antd";

const columns = [
  { key: "accountCode", title: "Mã tài khoản" },
  { key: "name", title: "Họ và tên" },
  { key: "phone", title: "Số điện thoại" },
  { key: "address", title: "Địa chỉ" },
  { key: "email", title: "Email" },
  { key: "dob", title: "Ngày sinh" },
  { key: "gender", title: "Giới tính" },
  { key: "roleName", title: "Vai trò" },
  { key: "status", title: "Trạng thái" },
  { key: "option", title: "" },
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const AccountTable = ({
  accounts,
  onUpdate,
  onUpdateAssociate,
  onInactive,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountRoleId, setAccountRoleId] = useState(0);

  const handleOpenMenu = (event, account) => {
    setAnchorEl(event.currentTarget);
    setSelectedAccount(account);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedAccount(null);
  };

  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#474D57" }}>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                align="center"
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: { xs: "14px", sm: "14px" },
                  padding: { xs: "6px", sm: "12px" },
                  whiteSpace: "nowrap",
                }}
                key={column.key}
              >
                {column.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.accountCode}>
              <TableCell sx={{ fontSize: { xs: "14px", sm: "14px" } }}>
                {account.accountCode}
              </TableCell>
              <TableCell sx={{ fontSize: { xs: "14px", sm: "14px" } }}>
                {account.fullName}
              </TableCell>
              <TableCell sx={{ fontSize: { xs: "14px", sm: "14px" } }}>
                {account.phone}
              </TableCell>
              <TableCell
                sx={{
                  fontSize: { xs: "14px", sm: "14px" },
                }}
              >
                {account.address}
              </TableCell>
              <TableCell sx={{ fontSize: { xs: "14px", sm: "14px" } }}>
                {account.email}
              </TableCell>
              <TableCell sx={{ fontSize: { xs: "14px", sm: "14px" } }}>
                {formatDate(account.dateOfBirth)}
              </TableCell>
              <TableCell
                sx={{
                  fontSize: { xs: "14px", sm: "14px" },
                  textAlign: "center",
                }}
              >
                {account.gender === "Nam" ? "Nam" : "Nữ"}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: { xs: "14px", sm: "14px" } }}
              >
                {account.roleId === 1 ? (
                  <Tag color="geekblue">Sinh viên</Tag>
                ) : account.roleId === 2 ? (
                  <Tag color="orange">Giảng viên</Tag>
                ) : account.roleId === 3 ? (
                  <Tag color="green">Học viên</Tag>
                ) : account.roleId === 4 ? (
                  <Tag color="volcano">Trưởng bộ môn</Tag>
                ) : account.roleId === 5 ? (
                  <Tag color="magenta">Đối tác</Tag>
                ) : account.roleId === 6 ? (
                  <Tag color="gold">QHDN</Tag>
                ) : (
                  <Tag color="red">Học viên</Tag>
                )}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: { xs: "14px", sm: "14px" } }}
              >
                {" "}
                {account.status === "Active" ? (
                  <Person
                    style={{
                      fontSize: { xs: "14px", sm: "20px" },
                      color: "#474D57",
                    }}
                  />
                ) : (
                  <Person
                    style={{
                      fontSize: { xs: "14px", sm: "20px" },
                      color: "#E74A3B",
                    }}
                  />
                )}
              </TableCell>
              {/* <TableCell sx={{ fontSize: { xs: "14px", sm: "14px" } }}>
                <MoreHorizOutlined
                  onClick={(e) => handleOpenMenu(e, account)}
                  style={{ cursor: "pointer" }}
                />
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {selectedAccount && selectedAccount.roleId === 5 ? (
          <MenuItem
            style={{ color: "blue" }}
            onClick={() => {
              onUpdateAssociate(selectedAccount.accountCode);
              handleCloseMenu();
            }}
          >
            <Edit className="mr-2" /> Cập nhật đối tác
          </MenuItem>
        ) : (
          <MenuItem
            style={{ color: "blue" }}
            onClick={() => {
              onUpdate(selectedAccount.accountCode);
              handleCloseMenu();
            }}
          >
            <Edit className="mr-2" /> Cập nhật
          </MenuItem>
        )}
        <MenuItem
          style={{ color: "red" }}
          onClick={() => {
            onInactive(selectedAccount.accountCode);
            handleCloseMenu();
          }}
        >
          <Delete className="mr-2" /> Vô hiệu hóa
        </MenuItem>
      </Menu>
    </TableContainer>
  );
};

export default AccountTable;
