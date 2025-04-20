import React, { useState } from "react";
import classes from "./ImportAttendance.module.css";
import classNames from "classnames/bind";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Button, message, Typography, Upload } from "antd";
import { submitScoreTrainee } from "../../../services/LecturerApi";
import { ImportOutlined, UploadOutlined } from "@ant-design/icons";
import { importAttendanceTrainee } from "../../../services/AttendanceApi";

const cx = classNames.bind(classes);
const { Title } = Typography;

export const ImportAttendance = (props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { classId, projectId } = useParams();

  console.log(classId);

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
      if (data.report?.length > 0) {
        const file = data.report[0]?.originFileObj;
        if (file) {
          formData.append("file", file);
        }
      }

      console.log("Dữ liệu formData trước khi gửi:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }

      await importAttendanceTrainee(classId, formData);
      setLoading(false);
      toast.success("Nộp báo cáo diểm danh thành công!");
      handleClose();
      reset();
      props.refresh();
      // navigate(`/home-associate/class-detail/${projectId}/${classId}`);
    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi nộp báo cáo điểm danh:", error);
      console.log("Lỗi từ API:", error);
      console.log("Error.result:", error.result);
      console.log("Error.message:", error.message);
      console.log("Error.error:", error.error);
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
      <Button
        size="large"
        style={{
          backgroundColor: "#d45b13",
          color: "white",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        }}
        onClick={handleClickOpen}
        color="primary"
        variant="contained"
      >
        <ImportOutlined style={{ marginRight: "5px" }} />
        Import
      </Button>
      {contextHolder}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>
          Báo cáo điểm danh
        </DialogTitle>
        <DialogContent>
          <form className={cx("import-attendance-form")}>
            {/* Upload File */}
            <p style={{ marginBottom: "10px", fontSize: 24 }}>Điểm danh</p>
            <Controller
              name="report"
              control={control}
              defaultValue={[]}
              rules={{
                required: "Vui lòng chọn file báo cáo điểm danh",
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
                    <Button
                      icon={<UploadOutlined />}
                      type="primary"
                      disabled={loading}
                    >
                      {" "}
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
                        "Nhấp vào để upload"
                      )}
                    </Button>
                  </Upload>
                  {errors.report && (
                    <p style={{ color: "red", fontSize: 14 }}>
                      {errors.report.message}
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
              "Nộp"
            )}
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
