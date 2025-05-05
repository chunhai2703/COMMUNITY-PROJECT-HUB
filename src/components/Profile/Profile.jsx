import React, { useEffect, useState } from "react";
import { Button, FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Spinner } from "../Spinner/Spinner";
import { updateAccountAvatar, UpdateProfile } from "../../services/AccountApi";
import { toast } from "react-toastify";
import { set } from "lodash";
import { Avatar } from "antd";

const Profile = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarBackground, setAvatarBackground] = useState("");

  // Hàm lấy màu random cho avatar
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Fetch danh sách thông báo khi component mount
  useEffect(() => {
    if (user && !user.avatarLink) {
      let storedColor = sessionStorage.getItem("avatarBackground");
      if (!storedColor) {
        storedColor = getRandomColor();
        sessionStorage.setItem("avatarBackground", storedColor);
      }
      setAvatarBackground(storedColor);
    }
    console.log(formatToMMDDYYYY(user.dateOfBirth))
  }, [user]);

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

  const formatToMMDDYYYY = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const onSubmit = async (data) => {
    const dataJson = {
      accountId: user.accountId,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      address: data.address,
      gender: data.gender,
      dateOfBirth: data.birthDate
    }
    setIsLoading(true);
    const response = await UpdateProfile(dataJson);
    const responseData = await response.json();
    console.log(responseData)
    if (response.ok) {
      setIsLoading(false);
      setIsEditing(false);
      window.location.reload();
    }
    else {
      toast.error(responseData.message);
      setIsLoading(false);
    }
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
                    rules={{
                      required: "Vui lòng nhập họ và tên",
                      minLength: {
                        value: 8,
                        message: "Họ và tên phải có ít nhất 8 ký tự",
                      },
                      pattern: {
                        value: /^[\p{L}]+([\s\p{L}]+)*$/u,
                        message: "Họ và tên không hợp lệ",
                      },
                    }}
                    control={control}
                    defaultValue={user.fullName}
                    render={({ field }) => <TextField
                      {...field}
                      fullWidth
                      error={!!errors.fullName}
                      helperText={errors.fullName?.message}
                    />}
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
                    rules={{
                      required: "Vui lòng nhập số điện thoại",
                      pattern: {
                        value: /^0\d{9}$/,
                        message: "Số điện thoại không hợp lệ",
                      },
                    }}
                    control={control}
                    defaultValue={user.phone}
                    render={({ field }) => <TextField
                      {...field}
                      fullWidth
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />}
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
                    rules={{
                      required: "Vui lòng nhập địa chỉ",
                    }}
                    control={control}
                    defaultValue={user.address}
                    render={({ field }) => <TextField
                      {...field}
                      fullWidth
                      error={!!errors.address}
                      helperText={errors.address?.message}
                    />}
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
                    rules={{
                      required: "Vui lòng nhập ngày sinh",
                    }}
                    control={control}
                    defaultValue={formatToMMDDYYYY(user.dateOfBirth)}
                    render={({ field }) => <TextField {...field} fullWidth
                      type="date"
                      error={!!errors.birthDate}
                      helperText={errors.birthDate?.message}
                    />}
                  />
                ) : (
                  formatDate(user.dateOfBirth)
                ),
              },
              {
                label: "Email:",
                value: isEditing ? (
                  <Controller
                    name="email"
                    rules={{
                      required: "Vui lòng nhập email",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Email không hợp lệ",
                      },
                    }}
                    control={control}
                    defaultValue={user.email}
                    render={({ field }) => <TextField
                      {...field}
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />}
                  />
                ) : (
                  user.email
                ),
              },
              {
                label: "Giới tính:",
                value: isEditing ? (
                  <Controller
                    name="gender"
                    control={control}
                    defaultValue={user.gender}
                    render={({ field }) => (
                      <RadioGroup row {...field}>
                        <FormControlLabel
                          value="Nam"
                          control={<Radio />}
                          label="Nam"
                        />
                        <FormControlLabel
                          value="Nữ"
                          control={<Radio />}
                          label="Nữ"
                        />
                      </RadioGroup>
                    )}
                  />
                ) : (
                  user.gender
                ),
              },
              { label: "Mật khẩu:", value: "********" },
            ].map((item, index) => (
              <div key={index} className={styles.infoRow}>
                <div className={styles.label}>{item.label}</div>
                <div className={styles.info}>
                  {item.value}
                  {/* Nút chỉnh sửa ngay sau Email và Mật khẩu */}
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
            <Avatar
              src={
                user.avatarLink ? (
                  <img src={user.avatarLink} alt="avatar" />
                ) : null
              }
              style={{
                backgroundColor: avatarBackground,
                color: avatarBackground ? "#fff" : "",
                marginBottom: 10,
                fontSize: 100,
              }}
              size={200}
            >
              {!user.avatarLink ? user.fullName.charAt(0) : ""}
            </Avatar>
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
