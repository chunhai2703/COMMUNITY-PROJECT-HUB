import React, { useCallback, useEffect, useState } from "react";
import { ConfigProvider, Dropdown, Table } from "antd";
import {
  EllipsisOutlined,
  SearchOutlined,
  SmileOutlined,
  SmileTwoTone,
} from "@ant-design/icons";

import classes from "./FeedbackTraineeTable.module.css";
import classNames from "classnames/bind";

import useAuth from "../../hooks/useAuth";
import { Spinner } from "../Spinner/Spinner";

import { getAllUnfeedbackProject } from "../../services/FeedbackApi";
import { useNavigate } from "react-router-dom";
import { debounce, set } from "lodash";

const cx = classNames.bind(classes);

export const FeedbackTraineeTable = () => {
  const { user } = useAuth();
  const ITEMS_PER_PAGE = 3;
  const [pageNumber, setPageNumber] = useState(1);
  const [unfeedbackProject, setUnfeedbackProject] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const fetchUnfeedbackProject = useCallback(async () => {
    setLoading(true);
    const response = await getAllUnfeedbackProject(user.accountId, searchValue);
    if (response.isSuccess) {
      setUnfeedbackProject(response.result);
      setLoading(false);
    } else {
      setUnfeedbackProject([]);
      setLoading(false);
      console.error("Lỗi khi lấy các dự án cần đánh giá:", response.message);
    }
  }, [user.accountId, searchValue]);

  const handleInputSearch = debounce((e) => {
    setSearchValue(e.target.value);
    setPageNumber(1);
  }, 500);

  useEffect(() => {
    if (user) {
      fetchUnfeedbackProject();
    }
  }, [fetchUnfeedbackProject, user]);

  const moveToFeedbackPage = (record) => {
    navigate(`/home-trainee/project-feedback/${record.projectId}`);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "projectId",
      key: "projectId",
      align: "center",
      render: (_, __, index) => index + 1 + (pageNumber - 1) * ITEMS_PER_PAGE,
    },
    {
      title: "Dự án",
      dataIndex: "title",
      key: "title",
      align: "center",
    },
    {
      title: "Lớp",
      dataIndex: "classCode",
      key: "classCode",
      align: "center",
    },
    {
      title: "Giảng viên",
      dataIndex: "lecturerName",
      key: "lecturerName",
      align: "center",
    },
    {
      title: "",
      key: "action",
      align: "center",
      render: (record) => (
        <span
          className={cx("feedback-button")}
          onClick={() => moveToFeedbackPage(record)}
        >
          <SmileTwoTone style={{ marginRight: "8px" }} />
          Nhấn vào để đánh giá
        </span>
      ),
    },
  ];

  if (!user || loading || !unfeedbackProject) {
    return <Spinner />;
  }

  return (
    <div className={cx("unfeedback-project-container")}>
      <h2 className={cx("unfeedback-project-title")}>
        Danh sách lớp học cần đánh giá
      </h2>
      <div className={cx("unfeedback-project-search")}>
        <div className={cx("search-box-container")}>
          <div className={cx("search-box")}>
            <input
              type="search"
              placeholder="Tìm kiếm câu hỏi"
              className={cx("search-input")}
              onChange={(e) => handleInputSearch(e)}
            />
          </div>
          <button className={cx("search-button")}>
            <SearchOutlined
              color="white"
              size={20}
              style={{ marginRight: "5px" }}
            />
            Tìm kiếm
          </button>
        </div>
      </div>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#474D57",
              headerColor: "white",
            },
          },
        }}
      >
        <Table
          size="large"
          columns={columns}
          rowKey={(record) => record.projectId}
          dataSource={unfeedbackProject.map((item) => ({
            projectId: item.projectId,
            title: item.title,
            classId: item.traineeClass.classId,
            classCode: item.traineeClass.classCode,
            lecturerId: item.traineeClass.lecturerId,
            lecturerName: item.traineeClass.lecturerName,
          }))}
          pagination={{
            position: ["bottomCenter"],
            current: pageNumber,
            pageSize: ITEMS_PER_PAGE,
            total: unfeedbackProject.length,
            onChange: (page) => setPageNumber(page),
          }}
        />
      </ConfigProvider>
    </div>
  );
};
