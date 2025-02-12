import React, { useState, useEffect } from "react";
import {
  TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Box, Typography
} from "@mui/material";
import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import classes from "./LessonUpdateForm.module.css";
import classNames from "classnames/bind";
import { updateLesson } from "../../../services/LessonApi";

const cx = classNames.bind(classes);

export const LessonUpdateForm = (props) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      lessonList: props.project.lessons.map(lesson => ({
        value: lesson.lessonContent
      }))
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lessonList"
  });

  // Khi props.project.lessons thay đổi, cập nhật lại form
  useEffect(() => {
    if (props.project.lessons) {
      reset({
        lessonList: props.project.lessons.map(lesson => ({
          value: lesson.lessonContent,  // Chỉ lấy lessonContent để hiển thị
        }))
      });
    }
  }, [props.project.lessons, reset]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data) => {
    try {
      console.log("Dữ liệu gửi lên:", data);

      // Tạo payload đúng định dạng API yêu cầu
      const payload = {
        projectId: props.project.projectId,
        lessonOfProject: data.lessonList.map(lesson => lesson.value)
      };

      console.log("Payload trước khi gửi:", JSON.stringify(payload, null, 2));

      await updateLesson(payload);

      toast.success("Nội dung khóa học đã được cập nhật!");
      handleClose();
      reset();
      navigate(`/home-department-head/project-detail/${props.project.projectId}`);
    } catch (error) {
      console.error("Lỗi khi cập nhật nội dung khóa học :", error);
      toast.error("Không thể cập nhật nội dung khóa học. Vui lòng thử lại sau!");
    }
  };


  return (
    <React.Fragment>
      <button className={cx("update-lesson-button")} onClick={handleClickOpen}>
        <EditOutlined color="white" size={20} style={{ marginRight: "5px" }} />
        Chỉnh sửa
      </button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>
          Cập nhật nội dung khóa học
        </DialogTitle>
        <DialogContent>
          <form className={cx("update-lesson-form")}>
            {/* Danh sách bài học */}
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Danh sách bài học
            </Typography>

            {fields.map((field, index) => (
              <Box key={field.id} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Controller
                  name={`lessonList.${index}.value`}
                  control={control}
                  defaultValue={field.value} // ✅ Gán giá trị mặc định
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={`Bài học ${index + 1}`}
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
              Thêm bài học
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <button onClick={handleClose} className={cx("cancel-button")}>
            Hủy
          </button>
          <button type="submit" onClick={handleSubmit(onSubmit)} className={cx("create-button")}>
            Cập nhật
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
