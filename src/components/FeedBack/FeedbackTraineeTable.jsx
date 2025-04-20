import React, { useCallback, useEffect, useState } from "react";
import { ConfigProvider, Dropdown, Table } from "antd";
import {
  EllipsisOutlined,
  SearchOutlined,
  SmileOutlined,
  SmileTwoTone,
} from "@ant-design/icons";
import { debounce } from "lodash";
import classes from "./FeedbackTraineeTable.module.css";
import classNames from "classnames/bind";
import { FeedbackUpdateForm } from "../Popup/FeedbackForm/FeedbackUpdateForm";
import { FeedbackDeleteForm } from "../Popup/FeedbackForm/FeedbackDeleteForm";
import useAuth from "../../hooks/useAuth";
import { Spinner } from "../Spinner/Spinner";
import { FeedbackCreateForm } from "../Popup/FeedbackForm/FeedbackCreateForm";
import {
  getAllQuestionOfProject,
  getAllUnfeedbackProject,
} from "../../services/FeedbackApi";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(classes);

export const FeedbackTraineeTable = () => {
  const { user } = useAuth();
  const ITEMS_PER_PAGE = 3;
  const [pageNumber, setPageNumber] = useState(1);
  const [unfeedbackProject, setUnfeedbackProject] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const fetchUnfeedbackProject = useCallback(
    async (search = "") => {
      try {
        setLoading(true);
        const response = await getAllUnfeedbackProject(user?.accountId, search);

        if (response.isSuccess) {
          setUnfeedbackProject(response.result || []);
        } else {
          setUnfeedbackProject([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy các câu hỏi:", error);
        setUnfeedbackProject([]);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    fetchUnfeedbackProject();
  }, [fetchUnfeedbackProject]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchUnfeedbackProject(searchValue);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchValue, fetchUnfeedbackProject]);

  // Xử lý khi nhấn nút tìm kiếm
  const handleSearch = () => {
    fetchUnfeedbackProject(searchValue);
  };

  const moveToFeedbackPage = (record) => {
    navigate(`/home-trainee/project-feedback/${record.projectId}`);
  };

  //   const getMenuItems = (record) => [
  //     {
  //       key: "1",
  //       label: (
  //         <FeedbackUpdateForm
  //           question={record}
  //           refresh={fetchUnfeedbackProject}
  //         />
  //       ),
  //     },
  //     {
  //       key: "2",
  //       label: (
  //         <FeedbackDeleteForm
  //           question={record}
  //           refresh={fetchUnfeedbackProject}
  //         />
  //       ),
  //     },
  //   ];

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
    // {
    //   title: "Đáp án",
    //   key: "anwserList",
    //   dataIndex: "anwserList",
    //   align: "center",
    //   render: (_, record) => (
    //     <ol className={cx("answer-list")}>
    //       {record.anwserList.map((answer) => (
    //         <li className={cx("answer-item")} key={answer.answerId}>
    //           {answer.answerContent}
    //         </li>
    //       ))}
    //     </ol>
    //   ),
    // },
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

  if (!user || loading) {
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
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
          rowKey={(record) => record.questionId}
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
