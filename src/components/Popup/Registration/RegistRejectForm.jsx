import React, { useState } from "react";
import {
  ExclamationCircleFilled,
  CloseSquareOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import classes from "./RegistRejectForm.module.css";
import classNames from "classnames/bind";
import { toast } from "react-toastify";
import { approveDenyRegistration } from "../../../services/RegistrationApi";
import { data, useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { TextField } from "@mui/material";

const cx = classNames.bind(classes);
export const RegistRejectForm = (props) => {
  const [modal, contextHolder] = Modal.useModal();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [shouldRenderContent, setShouldRenderContent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({});
  const showModal = () => {
    setIsModalOpen(true);
    setTimeout(() => setShouldRenderContent(true), 50); // delay một chút
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setShouldRenderContent(false);
  };
  const onSubmit = async (data) => {
    const payload = {
      registrationId: props.registrationId,
      type: "Deny",
      deniedReason: data.reason,
    };

    try {
      await approveDenyRegistration(payload);
      toast.success("Đã từ chối đơn đăng kí thành công");
      props.refreshTable();
      navigate(`/home-lecturer/project-registration/${projectId}`);
    } catch (error) {
      console.error("Lỗi khi từ chối đơn đăng kí:", error);
      toast.error(error.message || error.result);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <CloseSquareOutlined className={cx("reject-icon")} onClick={showModal} />
      <Modal
        title={
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 20,
            }}
          >
            <ExclamationCircleFilled style={{ color: "red", fontSize: 20 }} />
            Từ chối đơn đăng kí
          </span>
        }
        open={isModalOpen}
        okText="Xác nhận"
        cancelText="Hủy"
        onOk={handleSubmit(onSubmit)}
        onCancel={handleCancel}
        okButtonProps={{ className: cx("ok-button") }}
        cancelButtonProps={{ className: cx("cancel-button") }}
        centered
      >
        {shouldRenderContent && (
          <Controller
            name="reason"
            id="reason"
            control={control}
            defaultValue=""
            rules={{
              required: "Vui lòng nhập lý do từ chối",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Lý do từ chối"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                type="text"
                multiline
                rows={4}
                error={!!errors.reason}
                helperText={errors.reason?.message}
              />
            )}
          />
        )}
      </Modal>
    </>
  );
};
