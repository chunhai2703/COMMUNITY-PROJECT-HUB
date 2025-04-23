import React from "react";
import { useNavigate } from "react-router-dom";
import classes from "./ProjectItem.module.css";
import classNames from "classnames/bind";
import useAuth from "../../../../hooks/useAuth";
import { ArrowRightOutlined } from "@ant-design/icons";

const cx = classNames.bind(classes);

export const ProjectItem = (props) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log(user);

  // Chuyển đổi startDate & endDate thành đối tượng Date
  const startDate = new Date(props.startDate);
  const endDate = new Date(props.endDate);

  // Tính duration (số ngày)
  const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  // Format ngày tạo theo kiểu Việt Nam
  const createdDate = new Date(props.createdDate).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const startFormatDate = new Date(props.startDate).toLocaleDateString(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );

  const endFormatDate = new Date(props.endDate).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const applicationStartDate = new Date(
    props.applicationStartDate
  ).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const applicationEndDate = new Date(
    props.applicationEndDate
  ).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const toPage = () => {
    if (user && user?.roleId === 1) {
      navigate(`/home-student/project-detail/${props.projectId}`);
    } else if (user && user?.roleId === 2) {
      navigate(`/home-lecturer/project-detail/${props.projectId}`);
    } else if (user && user?.roleId === 3) {
      navigate(`/home-trainee/project-detail/${props.projectId}`);
    } else if (user && user?.roleId === 4) {
      navigate(`/home-department-head/project-detail/${props.projectId}`);
    } else if (user && user?.roleId === 5) {
      navigate(`/home-associate/project-detail/${props.projectId}`);
    } else if (user && user?.roleId === 6) {
      navigate(`/home-business-relation/project-detail/${props.projectId}`);
    } else if (user && user?.roleId === 7) {
      navigate(`/home-admin/project-detail/${props.projectId}`);
    }
  };

  return (
    <div className={cx("project-item-container")} onClick={toPage}>
      <div className={cx("project-item")}>
        <div className={cx("project-item-title")}>
          <h2 className={cx("project-item-name")}>{props.title}</h2>
          <span
            className={cx("project-item-status", {
              "planning-status": props.status === "Lên kế hoạch",
              "ongoing-status": props.status === "Sắp diễn ra",
              "active-status": props.status === "Đang diễn ra",
              "inactive-status": props.status === "Hủy",
              "completed-status": props.status === "Kết thúc",
            })}
          >
            {props.status}
          </span>
        </div>
        <div className={cx("project-item-description")}>
          <p className={cx("project-item-duration")}>
            <span style={{ fontWeight: "600", fontStyle: "normal" }}>
              Thời lượng dự án:{" "}
            </span>{" "}
            <span style={{ fontStyle: "italic" }}>{duration} ngày</span>
          </p>
          <p className={cx("project-item-created-date")}>
            <span style={{ fontWeight: "600" }}>Ngày tạo: </span>{" "}
            <span>{createdDate}</span>
          </p>
          <p className={cx("project-item-created-date")}>
            <span style={{ fontWeight: "600" }}>Ngày bắt đầu lớp học: </span>{" "}
            <span>{startFormatDate}</span>
            <ArrowRightOutlined
              style={{ marginLeft: "10px", marginRight: "10px" }}
            />
            <span style={{ fontWeight: "600" }}>Ngày kết thúc lớp học: </span>{" "}
            <span>{endFormatDate}</span>
          </p>
          <p className={cx("project-item-manager")}>
            <span style={{ fontWeight: "600" }}>Quản lý dự án: </span>{" "}
            <span>
              {props.projectManagerName ? (
                props.projectManagerName
              ) : (
                <span style={{ color: "red", fontWeight: "600" }}>Chưa có</span>
              )}
            </span>
          </p>
          {Date.now() <= new Date(props.applicationEndDate) && (
            <p className={cx("project-item-application-date")}>
              (Thời gian đăng kí bắt đầu từ ngày{" "}
              <span style={{ fontStyle: "italic" }}>
                {applicationStartDate}
              </span>
              {"\t"}đến ngày{" "}
              <span style={{ fontStyle: "italic" }}>{applicationEndDate}</span>)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
