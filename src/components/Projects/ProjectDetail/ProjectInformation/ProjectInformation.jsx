import React from "react";
import { ArrowRightOutlined, ContactsOutlined } from "@ant-design/icons";
import classes from "./ProjectInformation.module.css";
import classNames from "classnames/bind";
import useAuth from "../../../../hooks/useAuth";
import { Spinner } from "../../../Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { ProjectUpdatePM } from "../../../Popup/Project/ProjectUpdatePM";

const cx = classNames.bind(classes);

export const ProjectInformation = (props) => {
  const { user, isInitialized } = useAuth();
  const navigate = useNavigate();
  if (!isInitialized) {
    return <Spinner />;
  }

  const startDate = new Date(props.project.startDate).toLocaleDateString(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
  const endDate = new Date(props.project.endDate).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handleClickMaterial = () => {
    if (!user) return;

    const rolePaths = {
      1: "home-student",
      2: "home-lecturer",
      3: "home-trainee",
      4: "home-department-head",
      5: "home-associate",
      6: "home-business-relation",
    };

    const rolePath = rolePaths[user.roleId] || "home";

    navigate(
      `/${rolePath}/project-detail/${props.project.projectId}/material`,
      {
        state: { project: props.project },
      }
    );
  };

  const handleClickViewMember = () => {
    if (user && user?.roleId === 4) {
      navigate(
        `/home-department-head/project-detail/${props.project.projectId}/member-list`
      );
    } else if (user && user?.roleId === 2) {
      navigate(
        `/home-lecturer/project-detail/${props.project.projectId}/member-list`
      );
    }
  };

  if (!user) {
    return <Spinner />;
  }

  const applicationStartDate = new Date(
    props.project.applicationStartDate
  ).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const applicationEndDate = new Date(
    props.project.applicationEndDate
  ).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className={cx("project-information-container")}>
      <div className={cx("project-information-title")}>
        <h3 className={cx("project-title")}>Thông tin chi tiết</h3>
        <p className={cx("project-description")}>
          {props.project.description.split("\n").map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </p>
      </div>
      <div className={cx("project-information-content")}>
        <p className={cx("project-associate")}>
          <span className={cx("associate-label", "label")}>Bên đối tác :</span>{" "}
          <span className={cx("associate-content", "content")}>
            {props.project.associateName}
          </span>
        </p>

        <p className={cx("project-address")}>
          <span className={cx("address-label", "label")}>Địa chỉ :</span>{" "}
          <span className={cx("address-content", "content")}>
            {props.project.address}
          </span>
        </p>

        <p className={cx("project-number-lesson")}>
          <span className={cx("number-lesson-label", "label")}>
            Tổng số buổi học :
          </span>{" "}
          <span className={cx("number-lesson-content", "content")}>
            {props.project.numberLesson} buổi
          </span>
        </p>

        <p className={cx("project-min-lesson-time")}>
          <span className={cx("min-lesson-time-label", "label")}>
            Thời gian tối thiểu :
          </span>{" "}
          <span className={cx("min-lesson-time-content", "content")}>
            {props.project.minLessonTime} phút/buổi
          </span>
        </p>

        <p className={cx("project-max-lesson-time")}>
          <span className={cx("max-lesson-time-label", "label")}>
            Thời gian tối đa :
          </span>{" "}
          <span className={cx("max-lesson-time-content", "content")}>
            {props.project.maxLessonTime} phút/buổi
          </span>
        </p>

        <p className={cx("project-number-trainee")}>
          <span className={cx("number-trainee-label", "label")}>
            Tổng số học viên :
          </span>{" "}
          <span className={cx("number-trainee-content", "content")}>
            {props.project.totalNumberTrainee} người
          </span>
        </p>

        <p className={cx("project-number-teacher")}>
          <span className={cx("number-teacher-label", "label")}>
            Tổng số giáo viên :
          </span>{" "}
          <span className={cx("number-teacher-content", "content")}>
            {props.project.totalNumberLecturer} người
          </span>
        </p>

        {/* <p className={cx('project-number-member')}><span className={cx('number-member-label', 'label')}>Danh sách thành viên :</span> <span className={cx('number-member-content', 'content')}><ContactsOutlined className={cx('number-member-icon')} onClick={() => navigate(`/home-lecturer/project-registration/${props.project.projectId}`)} /></span></p> */}

        {/* <p className={cx('project-number-member')}><span className={cx('number-member-label', 'label')}>Danh sách thành viên :</span> <span className={cx('number-member-content', 'content')} onClick={() => navigate(`/home-lecturer/project-registration/${props.project.projectId}`)} style={{ cursor: 'pointer', fontStyle: 'italic' }}>Xem chi tiết</span></p> */}

        {user &&
          (user.roleId === 4 ||
            (user.roleId === 2 &&
              user.accountId === props.project.projectManagerId)) && (
            <p className={cx("project-number-member")}>
              <span className={cx("number-member-label", "label")}>
                Danh sách thành viên :
              </span>
              <span
                className={cx("number-member-content", "content")}
                onClick={() => handleClickViewMember()}
              >
                <Button
                  type="primary"
                  icon={<ContactsOutlined />}
                  size="small"
                  onClick={() => handleClickViewMember()}
                >
                  Xem chi tiết
                </Button>
              </span>
            </p>
          )}

        <p className={cx("project-date")}>
          <span className={cx("start-date-label", "label")}>
            Ngày bắt đầu lớp học :{" "}
          </span>
          <span className={cx("start-date-content", "content")}>
            {startDate}
          </span>{" "}
          <ArrowRightOutlined style={{ margin: "0 10px" }} />{" "}
          <span className={cx("end-date-label", "label")}>
            Ngày kết thúc lớp học :
          </span>{" "}
          <span className={cx("end-date-content", "content")}>{endDate}</span>
        </p>
        <p className={cx("project-manager")}>
          <span className={cx("manager-label", "label")}>Quản lý dự án :</span>
          <span className={cx("manager-content", "content")}>
            {props.project.projectManagerName ? (
              props.project.projectManagerName
            ) : (
              <>
                Chưa có{" "}
                <span style={{ color: "red", fontWeight: "600" }}>
                  (Vui lòng cập nhật quản lý dự án)
                </span>
              </>
            )}
          </span>
          {user && user.roleId === 4 && props.project.status !== "Hủy" && (
            <ProjectUpdatePM project={props.project} />
          )}
        </p>
        {Date.now() <= new Date(props.project.applicationEndDate) && (
          <p className={cx("project-application-date")}>
            (Thời gian đăng kí bắt đầu từ ngày{" "}
            <span style={{ fontStyle: "italic" }}>{applicationStartDate}</span>{" "}
            {"\t"} đến ngày{" "}
            <span style={{ fontStyle: "italic" }}>{applicationEndDate}</span>)
          </p>
        )}
      </div>
      <div className={cx("project-material-buttons")}>
        {user &&
          (props.project.memberIds.includes(user.accountId) ||
            props.project.lecturerIds.includes(user.accountId) ||
            user.accountId === props.project.projectManagerId ||
            user.roleId === 4 ||
            user.roleId === 5 ||
            user.roleId === 6 ||
            user.roleId === 3) && (
            <button
              className={cx("project-material-button")}
              onClick={() => handleClickMaterial()}
            >
              Xem tài liệu
            </button>
          )}
        {user && user.accountId === props.project.projectManagerId && (
          <button
            className={cx("project-register-button")}
            onClick={() =>
              navigate(
                `/home-lecturer/project-registration/${props.project.projectId}`
              )
            }
          >
            Xem đăng kí
          </button>
        )}
      </div>
    </div>
  );
};
