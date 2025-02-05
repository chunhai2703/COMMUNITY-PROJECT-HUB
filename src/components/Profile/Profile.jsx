import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Profile = () => {
    const { control, handleSubmit, setValue, formState: { isDirty } } = useForm();
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    const defaultValues = {
        fullName: "Nguyễn Văn A",
        phone: "0987654321",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        birthDate: "01/01/1990",
        gender: "Nam",
    };

    const onSubmit = (data) => {
        console.log("Dữ liệu sau khi chỉnh sửa:", data);
        setIsEditing(false);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleEditPassword = () => {
        if (user.roleId === 1) {
            navigate('/home-student/change-password');
        } else if (user.roleId === 2) {
            navigate('/home-lecturer/change-password');
        } else if (user.roleId === 3) {
            navigate('/home-trainee/change-password');
        } else if (user.roleId === 3) {
            navigate('/home-trainee/change-password');
        } else if (user.roleId === 4) {
            navigate('/home-department-head/change-password');
        } else if (user.roleId === 5) {
            navigate('/home-associate/change-password');
        } else if (user.roleId === 6) {
            navigate('/home-business-relation/change-password');
        } else if (user.roleId === 7) {
            navigate('/home-admin/change-password');
        }
        
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.accountTitle}>Hồ sơ cá nhân</h2>

            <div className={styles.content}>
                <div className={styles.leftSection}>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.infoGrid}>
                        {[
                            { label: "Mã tài khoản:", value: "123456" },
                            { label: "Tên tài khoản:", value: "user123" },
                            {
                                label: "Họ và tên:",
                                value: isEditing ? (
                                    <Controller
                                        name="fullName"
                                        control={control}
                                        defaultValue={defaultValues.fullName}
                                        render={({ field }) => <TextField {...field} fullWidth />}
                                    />
                                ) : (
                                    defaultValues.fullName
                                ),
                            },
                            {
                                label: "Số điện thoại:",
                                value: isEditing ? (
                                    <Controller
                                        name="phone"
                                        control={control}
                                        defaultValue={defaultValues.phone}
                                        render={({ field }) => <TextField {...field} fullWidth />}
                                    />
                                ) : (
                                    defaultValues.phone
                                ),
                            },
                            {
                                label: "Địa chỉ:",
                                value: isEditing ? (
                                    <Controller
                                        name="address"
                                        control={control}
                                        defaultValue={defaultValues.address}
                                        render={({ field }) => <TextField {...field} fullWidth />}
                                    />
                                ) : (
                                    defaultValues.address
                                ),
                            },
                            {
                                label: "Ngày sinh:",
                                value: isEditing ? (
                                    <Controller
                                        name="birthDate"
                                        control={control}
                                        defaultValue={defaultValues.birthDate}
                                        render={({ field }) => <TextField {...field} fullWidth />}
                                    />
                                ) : (
                                    defaultValues.birthDate
                                ),
                            },
                            {
                                label: "Giới tính:",
                                value: isEditing ? (
                                    <Controller
                                        name="gender"
                                        control={control}
                                        defaultValue={defaultValues.gender}
                                        render={({ field }) => <TextField {...field} fullWidth />}
                                    />
                                ) : (
                                    defaultValues.gender
                                ),
                            },
                            { label: "Email:", value: "user@example.com" },
                            { label: "Mật khẩu:", value: "********" },
                        ].map((item, index) => (
                            <div key={index} className={styles.infoRow}>
                                <div className={styles.label}>{item.label}</div>
                                <div className={styles.info}>
                                    {item.value}
                                    {/* Nút chỉnh sửa ngay sau Email và Mật khẩu */}
                                    {item.label === "Email:" && (
                                        <Button variant="text" className={styles.editButton}>
                                            Chỉnh sửa
                                        </Button>
                                    )}
                                    {item.label === "Mật khẩu:" && (
                                        <Button variant="text" onClick={handleEditPassword} className={styles.editButton}>
                                            Chỉnh sửa
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </form>
                </div>

                <div className={styles.rightSection}>
                    <div className={styles.avatarContainer}>
                        <img src="https://static.vecteezy.com/system/resources/previews/013/042/571/large_2x/default-avatar-profile-icon-social-media-user-photo-in-flat-style-vector.jpg" alt="Avatar" className={styles.avatar} />
                        <Button variant="contained" component="label" className={styles.editAvatarButton}>
                            Chỉnh sửa ảnh
                            <input type="file" hidden />
                        </Button>
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
                {isEditing && (
                    <Button
                        type="button"
                        variant="contained"
                        className={styles.editProfileButton}
                        onClick={handleSubmit(onSubmit)}
                    >
                        Lưu
                    </Button>
                )}

                <Button
                    variant="contained"
                    className={`${isEditing ? styles.editProfileButtonEditing : styles.editProfileButtonNotEditing}`}
                    onClick={handleEditToggle}
                >
                    {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa hồ sơ"}
                </Button>
            </div>
        </div>
    );
};

export default Profile;
