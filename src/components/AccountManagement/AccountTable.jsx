import React, { useState } from "react";
import { Delete, Edit, MoreHorizOutlined, Person } from "@mui/icons-material";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Menu, MenuItem } from "@mui/material";

const columns = [
    { key: 'accountCode', title: 'Mã tài khoản' },
    { key: 'name', title: 'Họ và tên' },
    { key: 'phone', title: 'Số điện thoại' },
    { key: 'address', title: 'Địa chỉ' },
    { key: 'email', title: 'Email' },
    { key: 'dob', title: 'Ngày sinh' },
    { key: 'gender', title: 'Giới tính' },
    { key: 'role', title: 'Vai trò' },
    { key: 'status', title: 'Trạng thái' },
    { key: 'option', title: '' },
];

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};

const AccountTable = ({ accounts, onUpdate, onInactive }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const handleOpenMenu = (event, accountId) => {
        setAnchorEl(event.currentTarget);
        setSelectedAccount(accountId);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedAccount(null);
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead style={{ backgroundColor: "#474D57" }}>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell style={{ color: "white", fontWeight: '600' }} key={column.key}>{column.title}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {accounts.map((account) => (
                        <TableRow key={account.accountCode}>
                            <TableCell>{account.accountCode}</TableCell>
                            <TableCell>{account.fullName}</TableCell>
                            <TableCell>{account.phone}</TableCell>
                            <TableCell>{account.address}</TableCell>
                            <TableCell>{account.email}</TableCell>
                            <TableCell>{formatDate(account.dateOfBirth)}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                                {account.gender === "Nam" ? <Person style={{ color: "#474D57" }} /> : <Person style={{ color: "#E74A3B" }} />}
                            </TableCell>
                            <TableCell>{account.roleName}</TableCell>
                            <TableCell>{account.status ? "Active" : "Inactive"}</TableCell>
                            <TableCell>
                                <MoreHorizOutlined onClick={(e) => handleOpenMenu(e, account.accountCode)} style={{ cursor: "pointer" }} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Dropdown Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                <MenuItem style={{ color: "blue" }} onClick={() => { onUpdate(selectedAccount); handleCloseMenu(); }}><Edit className="mr-2" />  Cập nhật</MenuItem>
                <MenuItem style={{ color: "red" }} onClick={() => { onInactive(selectedAccount); handleCloseMenu(); }}><Delete className="mr-2" /> Vô hiệu hóa</MenuItem>
            </Menu>
        </TableContainer>
    );
};

export default AccountTable;
