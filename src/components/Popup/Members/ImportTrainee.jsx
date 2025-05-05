import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  CircularProgress,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { UploadOutlined, ImportOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";
import classes from "./ImportTrainee.module.css";
import classNames from "classnames/bind";
import { importTraineesForProject } from "../../../services/ProjectsApi";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const cx = classNames.bind(classes);
export const ImportTrainee = (props) => {
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { projectId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({});

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

      const formData = new FormData();
      if (data.trainees?.length > 0) {
        const file = data.trainees[0]?.originFileObj;
        if (file) {
          formData.append("file", file);
        }
      }

      await importTraineesForProject(projectId, formData);

      toast.success("Import danh sách học viên thành công!");
      setLoading(false);
      handleClose();
      reset();
      props.refresh();
      navigate(`/home-associate/project-detail/${projectId}`);
    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi import danh sách học viên:", error);
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
      <button className={cx("import-trainee-button")} onClick={handleClickOpen}>
        <ImportOutlined style={{ marginRight: "8px" }} /> Import danh sách học
        viên
      </button>
      {contextHolder}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>
          Import danh sách học viên
        </DialogTitle>
        <DialogContent>
          <form className={cx("import-trainee-form")}>
            {/* Upload File */}
            <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
              Danh sách học viên
            </Typography>
            <Controller
              name="trainees"
              control={control}
              defaultValue={[]}
              rules={{
                required: "Vui lòng chọn file để import",
              }}
              render={({ field }) => (
                <div>
                  <Upload
                    name="file"
                    accept=".xls,.xlsx"
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    headers={{ authorization: "authorization-text" }}
                    fileList={field.value}
                    onChange={(info) => {
                      field.onChange(info.fileList);
                    }}
                    beforeUpload={() => false}
                  >
                    <Button icon={<UploadOutlined />} type="primary">
                      Nhấn vào để upload
                    </Button>
                  </Upload>
                  {errors.trainees && (
                    <p style={{ color: "red", fontSize: 14 }}>
                      {errors.trainees.message}
                    </p>
                  )}
                </div>
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
              "Thêm vào"
            )}
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
