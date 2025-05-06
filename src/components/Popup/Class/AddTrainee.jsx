import React, { useState } from "react";
import classes from "./AddTrainee.module.css";
import classNames from "classnames/bind";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import {} from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { PlusCircleOutlined } from "@ant-design/icons";
import { addTraineeToClass, searchTrainees } from "../../../services/AssignApi";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { message } from "antd";

const cx = classNames.bind(classes);
export const AddTrainee = (props) => {
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projectId } = useParams();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({});

  const handleSearchTrainees = async (searchTerm) => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const data = await searchTrainees(searchTerm);
      console.log("Danh sách học viên từ API:", data);
      setTrainees(data.result);
    } catch (error) {
      console.error(error.message);
    }
    setLoading(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const sent = {
        classId: props.classId,
        accountId: data.trainee.accountId,
      };
      await addTraineeToClass(sent);
      setLoading(false);
      toast.success("Học viên đã được thêm vào lớp thành công!");
      handleClose();
      props.refresh();
      reset();
      if (user && user?.roleId === 2) {
        navigate(`/home-lecturer/class-detail/${projectId}/${props.classId}`);
      } else if (user && user?.roleId === 4) {
        navigate(
          `/home-department-head/class-detail/${projectId}/${props.classId}`
        );
      }
    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi phân công học viên:", error);
      if (error.result && error.result.length > 0) {
        messageApi.open({
          type: "error",
          title: "Thông báo lỗi",
          content: (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                alignItems: "flex-start",
              }}
            >
              {error.result.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          ),
        });
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <React.Fragment>
      <button className={cx("add-trainee-button")} onClick={handleClickOpen}>
        <PlusCircleOutlined
          color="white"
          size={20}
          style={{ marginRight: "5px" }}
        />
        Thêm học viên
      </button>
      {contextHolder}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>
          Thêm học viên vào lớp
        </DialogTitle>
        <DialogContent>
          <form className={cx("add-trainee-form")}>
            {/* Học viên */}
            <Controller
              name="trainee"
              control={control}
              rules={{
                required: "Vui lòng chọn học viên để thêm vào",
              }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={trainees} // Danh sách từ API
                  getOptionLabel={(option) =>
                    option.fullName && option.accountName
                      ? `${option.fullName} - ${option.accountName}`
                      : option.fullName
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.accountId === value?.accountId
                  }
                  onInputChange={(event, newInputValue) =>
                    handleSearchTrainees(newInputValue)
                  }
                  onChange={(event, newValue) => {
                    console.log("Người học viên được chọn:", newValue);
                    field.onChange(newValue);
                  }}
                  loading={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Học viên"
                      variant="outlined"
                      fullWidth
                      required
                      margin="normal"
                      defaultValue={
                        field.value?.fullName
                          ? `${field.value.fullName} - ${field.value.accountName}`
                          : ""
                      }
                      error={!!errors.trainee}
                      helperText={errors.trainee?.message}
                      slotProps={{
                        input: {
                          ...params.InputProps,
                        },
                        endAdornment: (
                          <>
                            {loading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              )}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <button onClick={handleClose} className={cx("cancel-button")}>
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className={cx("create-button")}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Thêm vào"
            )}
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
