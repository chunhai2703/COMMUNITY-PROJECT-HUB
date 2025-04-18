import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Spinner } from "../Spinner/Spinner";
import { updateAccountAvatar } from "../../services/AccountApi";
import { toast } from "react-toastify";
import { set } from "lodash";

const Profile = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const maxDate = getTodayDate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
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
      navigate("/home-student/change-password");
    } else if (user.roleId === 2) {
      navigate("/home-lecturer/change-password");
    } else if (user.roleId === 3) {
      navigate("/home-trainee/change-password");
    } else if (user.roleId === 3) {
      navigate("/home-trainee/change-password");
    } else if (user.roleId === 4) {
      navigate("/home-department-head/change-password");
    } else if (user.roleId === 5) {
      navigate("/home-associate/change-password");
    } else if (user.roleId === 6) {
      navigate("/home-business-relation/change-password");
    } else if (user.roleId === 7) {
      navigate("/home-admin/change-password");
    }
  };

  const handleAvatarChange = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file); // ⬅️ Backend có thể yêu cầu tên khác, kiểm tra lại nếu cần

    try {
      setIsLoading(true);
      await updateAccountAvatar(user.accountId, formData);
      toast.success("Cập nhật avatar thành công!");
      setIsLoading(false);
      window.location.reload();
    } catch (error) {
      setIsLoading(false);
      console.error("Lỗi khi upload ảnh:", error.message);
      toast.error(error.message);
    }
  };

  if (!user) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.accountTitle}>Hồ sơ cá nhân</h2>

      <div className={styles.content}>
        <div className={styles.leftSection}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.infoGrid}>
            {[
              { label: "Mã tài khoản:", value: user.accountCode },
              { label: "Tên tài khoản:", value: user.accountName },
              {
                label: "Họ và tên:",
                value: isEditing ? (
                  <Controller
                    name="fullName"
                    control={control}
                    defaultValue={user.fullName}
                    render={({ field }) => <TextField {...field} fullWidth />}
                  />
                ) : (
                  user.fullName
                ),
              },
              {
                label: "Số điện thoại:",
                value: isEditing ? (
                  <Controller
                    name="phone"
                    control={control}
                    defaultValue={user.phone}
                    render={({ field }) => <TextField {...field} fullWidth />}
                  />
                ) : (
                  user.phone
                ),
              },
              {
                label: "Địa chỉ:",
                value: isEditing ? (
                  <Controller
                    name="address"
                    control={control}
                    defaultValue={user.address}
                    render={({ field }) => <TextField {...field} fullWidth />}
                  />
                ) : (
                  user.address
                ),
              },
              {
                label: "Ngày sinh:",
                value: isEditing ? (
                  <Controller
                    name="birthDate"
                    control={control}
                    defaultValue={formatDate(user.dateOfBirth)}
                    render={({ field }) => <TextField {...field} fullWidth />}
                  />
                ) : (
                  formatDate(user.dateOfBirth)
                ),
              },
              {
                label: "Giới tính:",
                value: isEditing ? (
                  <Controller
                    name="gender"
                    control={control}
                    defaultValue={user.gender}
                    render={({ field }) => <TextField {...field} fullWidth />}
                  />
                ) : (
                  user.gender
                ),
              },
              { label: "Email:", value: user.email },
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
                    <Button
                      variant="text"
                      onClick={handleEditPassword}
                      className={styles.editButton}
                    >
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
            <img
              src={
                user.avatarLink
                  ? user.avatarLink
                  : "https://static.vecteezy.com/system/resources/previews/013/042/571/large_2x/default-avatar-profile-icon-social-media-user-photo-in-flat-style-vector.jpg"
              }
              alt="Avatar"
              className={styles.avatar}
            />
            <Button
              variant="contained"
              component="label"
              className={styles.editAvatarButton}
              disabled={isLoading}
            >
              {isLoading ? "Đang chỉnh sửa..." : "Chỉnh sửa avatar"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarChange}
              />
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
