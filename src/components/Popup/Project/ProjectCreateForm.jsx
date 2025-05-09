import React, { useEffect, useState } from "react";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { PlusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Slider, Upload, message } from "antd";
import classes from "./ProjectCreateForm.module.css";
import classNames from "classnames/bind";
import { searchAssociate, searchLeturers } from "../../../services/AssignApi";
import { createProject } from "../../../services/ProjectsApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(classes);
export const ProjectCreateForm = (props) => {
  const [open, setOpen] = useState(false);
  const [managers, setManagers] = useState([]);
  const [associates, setAssociates] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      lessonList: [""], // Khởi tạo một input mặc định
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lessonList",
  });

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Định dạng YYYY-MM-DD
  };

  const handleSearchManager = async (searchTerm) => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const data = await searchLeturers(searchTerm);
      console.log("Danh sách giảng viên từ API:", data); // Kiểm tra dữ liệu trả về
      setManagers(data.result);
    } catch (error) {
      console.error("Lỗi tìm kiếm giảng viên:", error);
    }
    setLoading(false);
  };

  const handleSearchAssociate = async (searchTerm) => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const data = await searchAssociate(searchTerm);
      console.log("Danh sách đối tác từ API:", data); // Kiểm tra dữ liệu trả về
      setAssociates(data.result);
    } catch (error) {
      console.error("Lỗi tìm kiếm đối tác:", error);
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

      console.log("Dữ liệu projectManager trước khi gửi:", data.projectManager);

      // Tạo object JSON thay vì FormData
      const payload = {
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        applicationStartDate: data.applicationStartDate,
        applicationEndDate: data.applicationEndDate,
        address: data.address,
        projectManagerId: data?.projectManager?.accountId || null,
        associateId: data?.associate?.accountId || null,
        minLessonTime: data?.minLessonTime,
        maxLessonTime: data?.maxLessonTime,
        lessonList: data.lessonList
          .map((lesson) => lesson.value)
          .filter(Boolean), // Loại bỏ giá trị rỗng
      };

      console.log("Dữ liệu payload trước khi gửi:", payload);

      await createProject(payload);

      toast.success("Dự án đã được tạo thành công!");
      setLoading(false);
      handleClose();
      reset();
      props.refresh();
      navigate("/home-department-head/projects");
    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi tạo dự án:", error);
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
              {Array.isArray(error.result) ? (
                error.result.map((err, index) => <p key={index}>{err}</p>)
              ) : (
                <p>{error.result}</p>
              )}
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
      <button className={cx("create-project-button")} onClick={handleClickOpen}>
        <PlusCircleOutlined
          color="white"
          size={20}
          style={{ marginRight: "5px" }}
        />
        Tạo dự án
      </button>
      {contextHolder}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>
          Tạo mới dự án
        </DialogTitle>
        <DialogContent>
          <form className={cx("create-project-form")}>
            {/* Tên dự án */}
            <Controller
              name="title"
              id="title"
              control={control}
              defaultValue=""
              rules={{
                required: "Vui lòng nhập tên dự án",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên dự án"
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  type="text"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />
            {/* Mô tả dự án */}
            <Controller
              name="description"
              id="description"
              control={control}
              defaultValue=""
              rules={{
                required: "Vui lòng nhập mô tả dự án",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mô tả dự án"
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  type="text"
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
            {/* Ngày bắt đầu đăng ký */}
            <Controller
              name="applicationStartDate"
              id="applicationStartDate"
              control={control}
              defaultValue=""
              rules={{
                required: "Vui lòng chọn ngày bắt đầu đăng ký",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Ngày bắt đầu đăng ký"
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  type="date"
                  slotProps={{
                    inputLabel: { shrink: true }, // Thay thế InputLabelProps
                  }}
                  inputProps={{ min: getTodayDate() }}
                  error={!!errors.applicationStartDate}
                  helperText={errors.applicationStartDate?.message}
                />
              )}
            />
            {/* Ngày kết thúc đăng ký */}
            <Controller
              name="applicationEndDate"
              id="applicationEndDate"
              control={control}
              defaultValue=""
              rules={{
                required: "Vui lòng chọn ngày kết thúc đăng ký",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Ngày kết thúc đăng ký"
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  type="date"
                  slotProps={{
                    inputLabel: { shrink: true }, // Thay thế InputLabelProps
                  }}
                  inputProps={{ min: getTodayDate() }}
                  error={!!errors.applicationEndDate}
                  helperText={errors.applicationEndDate?.message}
                />
              )}
            />

            {/* Ngày bắt đầu dự án */}
            <Controller
              name="startDate"
              id="startDate"
              control={control}
              defaultValue=""
              rules={{
                required: "Vui lòng chọn ngày bắt đầu lớp học",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Ngày bắt đầu lớp học"
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  type="date"
                  slotProps={{
                    inputLabel: { shrink: true }, // Thay thế InputLabelProps
                  }}
                  inputProps={{ min: getTodayDate() }}
                  error={!!errors.startDate}
                  helperText={errors.startDate?.message}
                />
              )}
            />
            {/* Ngày kết thúc dự án */}
            <Controller
              name="endDate"
              id="endDate"
              control={control}
              defaultValue=""
              rules={{
                required: "Vui lòng chọn ngày kết thúc lớp học",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Ngày kết thúc lớp học"
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  type="date"
                  slotProps={{
                    inputLabel: { shrink: true }, // Thay thế InputLabelProps
                  }}
                  inputProps={{ min: getTodayDate() }}
                  error={!!errors.endDate}
                  helperText={errors.endDate?.message}
                />
              )}
            />
            {/* Địa chi dự án */}
            <Controller
              name="address"
              id="address"
              control={control}
              defaultValue=""
              rules={{
                required: "Vui lòng nhập địa chỉ",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Địa chỉ"
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  type="text"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
            {/* Quản lý dự án */}
            <Controller
              name="projectManager"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={managers} // Danh sách từ API
                  getOptionLabel={(option) =>
                    `${option.fullName} - ${option.accountName}` || ""
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.accountId === value?.accountId
                  }
                  onInputChange={(event, newInputValue) =>
                    handleSearchManager(newInputValue)
                  }
                  onChange={(event, newValue) => {
                    console.log("Người quản lý được chọn:", newValue);
                    field.onChange(newValue);
                  }}
                  loading={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Quản lý dự án"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!errors.projectManager}
                      helperText={errors.projectManager?.message}
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

            {/* Đối tác */}
            <Controller
              name="associate"
              control={control}
              defaultValue={null}
              rules={{
                required: "Vui lòng chọn bên đối tác",
              }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={associates} // Danh sách từ API
                  getOptionLabel={(option) => `${option.associateName}` || ""}
                  isOptionEqualToValue={(option, value) =>
                    option.accountId === value?.accountId
                  }
                  onInputChange={(event, newInputValue) =>
                    handleSearchAssociate(newInputValue)
                  }
                  onChange={(event, newValue) => {
                    console.log("Đối tác được chọn:", newValue);
                    field.onChange(newValue);
                  }}
                  loading={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Bên đối tác"
                      variant="outlined"
                      fullWidth
                      required
                      margin="normal"
                      error={!!errors.associate}
                      helperText={errors.associate?.message}
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

            {/* Thời lượng tối thiểu cho từng nội dung */}
            <Controller
              name="minLessonTime"
              id="minLessonTime"
              control={control}
              defaultValue=""
              rules={{
                required:
                  "Vui lòng nhập thời lượng tối thiểu cho từng nội dung",
                validate: (value) => {
                  if (value <= 0) {
                    return "Thời lượng tối thiểu phải lớn hơn 0";
                  }
                  if (value >= 1000) {
                    return "Thời lượng tối thiểu phải nhỏ hơn 1000";
                  }
                  return true; // Nếu tất cả các điều kiện đều đúng
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Thời lượng tối thiểu"
                  placeholder="phút/nội dung"
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  type="number"
                  error={!!errors.minLessonTime}
                  helperText={errors.minLessonTime?.message}
                />
              )}
            />

            {/* Thời lượng tối đa cho từng nội dung  */}
            <Controller
              name="maxLessonTime"
              id="maxLessonTime"
              control={control}
              defaultValue=""
              rules={{
                required: "Vui lòng nhập thời lượng tối đa cho từng nội dung",
                validate: (value) => {
                  if (value <= 0) {
                    return "Thời lượng tối đa phải lớn hơn 0";
                  }
                  if (value >= 1000) {
                    return "Thời lượng tối đa phải nhỏ hơn 1000";
                  }
                  return true; // Nếu tất cả các điều kiện đều đúng
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Thời lượng tối đa"
                  placeholder="phút/nội dung"
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  type="number"
                  error={!!errors.maxLessonTime}
                  helperText={errors.maxLessonTime?.message}
                />
              )}
            />

            {/* Danh sách bài học */}
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Danh sách nội dung
            </Typography>

            {fields.map((field, index) => (
              <Box
                key={field.id}
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Controller
                  name={`lessonList.${index}.value`}
                  value={field.value || ""}
                  control={control}
                  defaultValue="" // ✅ Đảm bảo giá trị mặc định là chuỗi rỗng
                  rules={{ required: "Vui lòng nhập nội dung dự án" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={`Nội dung ${index + 1}`}
                      fullWidth
                      error={!!errors.lessonList?.[index]}
                      helperText={errors.lessonList?.[index]?.message}
                    />
                  )}
                />
                <IconButton onClick={() => remove(index)} color="error">
                  <RemoveCircleOutline />
                </IconButton>
              </Box>
            ))}

            <Button
              variant="outlined"
              icon={<AddCircleOutline />}
              onClick={() => append({ value: "" })}
            >
              Thêm nội dung
            </Button>
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={24} sx={{ color: "white" }} />
              </div>
            ) : (
              "Tạo mới"
            )}
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
